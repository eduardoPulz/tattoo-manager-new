"use client";

import { useEffect, useState } from "react";
import { Navigation } from "../components/navigation/Navigation";
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { 
  StatisticsContainer, 
  StatisticsContent, 
  ChartContainer, 
  ChartTitle, 
  StatisticsHeader, 
  LoadingMessage, 
  ErrorMessage,
  FilterContainer,
  FilterLabel,
  FilterSelect
} from "./styles";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const EstatisticasPage = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroSelecionado, setFiltroSelecionado] = useState('quantidade');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const [agendamentosRes, servicosRes, funcionariosRes] = await Promise.all([
          fetchAgendamentos(),
          fetch('/api/servicos').then(res => res.json()),
          fetch('/api/funcionarios').then(res => res.json())
        ]);
        
        if (agendamentosRes) {
          setAgendamentos(agendamentosRes);
        } else {
          console.error('Resposta inválida de agendamentos:', agendamentosRes);
          setAgendamentos([]);
        }
        
        if (servicosRes.success && Array.isArray(servicosRes.data)) {
          setServicos(servicosRes.data);
        } else {
          console.error('Resposta inválida de serviços:', servicosRes);
          setServicos([]);
        }
        
        if (funcionariosRes.success && Array.isArray(funcionariosRes.data)) {
          setFuncionarios(funcionariosRes.data);
        } else {
          console.error('Resposta inválida de funcionários:', funcionariosRes);
          setFuncionarios([]);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Erro ao carregar dados. Por favor, tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Função para buscar dados de agendamentos
  async function fetchAgendamentos() {
    try {
      const response = await fetch('/api/agendamentos', {
        cache: 'no-store',
        next: { revalidate: 0 }
      });
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      return [];
    }
  }

  const prepararDadosServicos = () => {
    if (!agendamentos.length || !servicos.length) return { labels: [], data: [] };
    
    const contagem = {};
    const valorTotal = {};
    const duracaoTotal = {};
    const clientesUnicos = {};
    const contadorServicos = {};
    
    servicos.forEach(servico => {
      contagem[servico.id] = 0;
      valorTotal[servico.id] = 0;
      duracaoTotal[servico.id] = 0;
      clientesUnicos[servico.id] = new Set();
      contadorServicos[servico.id] = {
        nome: servico.nome,
        descricao: servico.descricao,
        preco: servico.preco,
        duracao: servico.duracao
      };
    });
    
    agendamentos.forEach(agendamento => {
      if (contagem[agendamento.servicoId]) {
        contagem[agendamento.servicoId]++;
        valorTotal[agendamento.servicoId] += parseFloat(agendamento.preco || 0);
        
        // Calcular duração
        const servico = contadorServicos[agendamento.servicoId];
        duracaoTotal[agendamento.servicoId] += parseInt(servico?.duracao || 0);
        
        // Adicionar cliente único
        clientesUnicos[agendamento.servicoId].add(agendamento.clienteNome);
      }
    });
    
    // Preparar dados para ordenação
    const servicosData = Object.keys(contagem).map(id => ({
      id,
      nome: `Serviço: ${contadorServicos[id]?.nome || 'Desconhecido'}`,
      quantidade: contagem[id],
      valorTotal: valorTotal[id],
      duracaoMedia: contagem[id] > 0 ? duracaoTotal[id] / contagem[id] : 0,
      clientesUnicos: clientesUnicos[id].size
    }));
    
    // Ordenar por quantidade (padrão)
    servicosData.sort((a, b) => b.quantidade - a.quantidade);
    
    return servicosData;
  };

  const prepararDadosFuncionarios = () => {
    if (!agendamentos.length || !funcionarios.length) return [];
    
    const contagem = {};
    const valorTotal = {};
    const duracaoTotal = {};
    const clientesUnicos = {};
    const contadorFuncionarios = {};
    
    funcionarios.forEach(funcionario => {
      contagem[funcionario.id] = 0;
      valorTotal[funcionario.id] = 0;
      duracaoTotal[funcionario.id] = 0;
      clientesUnicos[funcionario.id] = new Set();
      contadorFuncionarios[funcionario.id] = {
        nome: funcionario.nome
      };
    });
    
    agendamentos.forEach(agendamento => {
      if (contagem[agendamento.funcionarioId]) {
        contagem[agendamento.funcionarioId]++;
        valorTotal[agendamento.funcionarioId] += parseFloat(agendamento.preco || 0);
        
        // Calcular duração
        const horaInicio = new Date(agendamento.horaInicio);
        const horaFim = new Date(agendamento.horaFim);
        const duracao = (horaFim - horaInicio) / (1000 * 60); // em minutos
        
        duracaoTotal[agendamento.funcionarioId] += duracao;
        
        // Adicionar cliente único
        clientesUnicos[agendamento.funcionarioId].add(agendamento.clienteNome);
      }
    });
    
    // Preparar dados para ordenação
    const funcionariosData = Object.keys(contagem).map(id => ({
      id,
      nome: `Profissional: ${contadorFuncionarios[id]?.nome || 'Desconhecido'}`,
      quantidade: contagem[id],
      valorTotal: valorTotal[id],
      duracaoMedia: contagem[id] > 0 ? duracaoTotal[id] / contagem[id] : 0,
      clientesUnicos: clientesUnicos[id].size
    }));
    
    // Ordenar por quantidade (padrão)
    funcionariosData.sort((a, b) => b.quantidade - a.quantidade);
    
    return funcionariosData;
  };

  const prepararDadosDiasSemana = () => {
    if (!agendamentos.length) return [];
    
    const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const contagem = [0, 0, 0, 0, 0, 0, 0];
    const valorTotal = [0, 0, 0, 0, 0, 0, 0];
    const duracaoTotal = [0, 0, 0, 0, 0, 0, 0];
    const clientesUnicos = [new Set(), new Set(), new Set(), new Set(), new Set(), new Set(), new Set()];
    
    agendamentos.forEach(agendamento => {
      const data = new Date(agendamento.horaInicio);
      const diaSemana = data.getDay();
      
      contagem[diaSemana]++;
      valorTotal[diaSemana] += parseFloat(agendamento.preco || 0);
      
      // Calcular duração
      const horaInicio = new Date(agendamento.horaInicio);
      const horaFim = new Date(agendamento.horaFim);
      const duracao = (horaFim - horaInicio) / (1000 * 60); // em minutos
      
      duracaoTotal[diaSemana] += duracao;
      
      // Adicionar cliente único
      clientesUnicos[diaSemana].add(agendamento.clienteNome);
    });
    
    // Preparar dados para ordenação
    const diasSemanaData = diasSemana.map((dia, index) => ({
      nome: `Dia: ${dia}`,
      quantidade: contagem[index],
      valorTotal: valorTotal[index],
      duracaoMedia: contagem[index] > 0 ? duracaoTotal[index] / contagem[index] : 0,
      clientesUnicos: clientesUnicos[index].size
    }));
    
    // Ordenar por quantidade (padrão)
    diasSemanaData.sort((a, b) => b.quantidade - a.quantidade);
    
    return diasSemanaData;
  };

  const prepararDadosMeses = () => {
    if (!agendamentos.length) return [];
    
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const contagem = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const valorTotal = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const duracaoTotal = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const clientesUnicos = [new Set(), new Set(), new Set(), new Set(), new Set(), new Set(), new Set(), new Set(), new Set(), new Set(), new Set(), new Set()];
    
    agendamentos.forEach(agendamento => {
      const data = new Date(agendamento.horaInicio);
      const mes = data.getMonth();
      
      contagem[mes]++;
      valorTotal[mes] += parseFloat(agendamento.preco || 0);
      
      // Calcular duração
      const horaInicio = new Date(agendamento.horaInicio);
      const horaFim = new Date(agendamento.horaFim);
      const duracao = (horaFim - horaInicio) / (1000 * 60); // em minutos
      
      duracaoTotal[mes] += duracao;
      
      // Adicionar cliente único
      clientesUnicos[mes].add(agendamento.clienteNome);
    });
    
    // Preparar dados para ordenação
    const mesesData = meses.map((mes, index) => ({
      nome: `Mês: ${mes}`,
      quantidade: contagem[index],
      valorTotal: valorTotal[index],
      duracaoMedia: contagem[index] > 0 ? duracaoTotal[index] / contagem[index] : 0,
      clientesUnicos: clientesUnicos[index].size
    }));
    
    // Ordenar por quantidade (padrão)
    mesesData.sort((a, b) => b.quantidade - a.quantidade);
    
    return mesesData;
  };

  // Preparar dados para o gráfico unificado
  const dadosServicos = prepararDadosServicos();
  const dadosFuncionarios = prepararDadosFuncionarios();
  const dadosDiasSemana = prepararDadosDiasSemana();
  const dadosMeses = prepararDadosMeses();

  // Combinar todos os dados em um único array
  const dadosUnificados = [
    ...dadosServicos,
    ...dadosFuncionarios,
    ...dadosDiasSemana,
    ...dadosMeses
  ];

  // Obter valor de acordo com o filtro selecionado
  const obterValorPorFiltro = (item) => {
    switch (filtroSelecionado) {
      case 'valorTotal':
        return item.valorTotal;
      case 'duracaoMedia':
        return item.duracaoMedia;
      case 'clientesUnicos':
        return item.clientesUnicos;
      case 'quantidade':
      default:
        return item.quantidade;
    }
  };

  // Ordenar dados pelo valor do filtro selecionado
  dadosUnificados.sort((a, b) => obterValorPorFiltro(b) - obterValorPorFiltro(a));

  // Limitar a quantidade de itens para melhorar a visualização
  const dadosLimitados = dadosUnificados.slice(0, 20);

  // Configurar dados para o gráfico unificado
  const chartData = {
    labels: dadosLimitados.map(item => item.nome),
    datasets: [
      {
        label: filtroSelecionado === 'quantidade' ? 'Quantidade de Agendamentos' :
               filtroSelecionado === 'valorTotal' ? 'Valor Total (R$)' :
               filtroSelecionado === 'duracaoMedia' ? 'Duração Média (min)' :
               'Clientes Únicos',
        data: dadosLimitados.map(item => obterValorPorFiltro(item)),
        backgroundColor: dadosLimitados.map(item => {
          if (item.nome.startsWith('Serviço:')) return 'rgba(75, 192, 192, 0.6)';
          if (item.nome.startsWith('Profissional:')) return 'rgba(153, 102, 255, 0.6)';
          if (item.nome.startsWith('Dia:')) return 'rgba(255, 159, 64, 0.6)';
          if (item.nome.startsWith('Mês:')) return 'rgba(255, 99, 132, 0.6)';
          return 'rgba(54, 162, 235, 0.6)';
        }),
        borderColor: dadosLimitados.map(item => {
          if (item.nome.startsWith('Serviço:')) return 'rgba(75, 192, 192, 1)';
          if (item.nome.startsWith('Profissional:')) return 'rgba(153, 102, 255, 1)';
          if (item.nome.startsWith('Dia:')) return 'rgba(255, 159, 64, 1)';
          if (item.nome.startsWith('Mês:')) return 'rgba(255, 99, 132, 1)';
          return 'rgba(54, 162, 235, 1)';
        }),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          precision: filtroSelecionado === 'valorTotal' ? 2 : 0
        }
      },
      y: {
        ticks: {
          callback: function(value, index, values) {
            const label = this.getLabelForValue(value);
            const maxLength = window.innerWidth < 768 ? 15 : 25;
            if (label && label.length > maxLength) {
              return label.substr(0, maxLength) + '...';
            }
            return label;
          }
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.parsed.x;
            
            if (filtroSelecionado === 'valorTotal') {
              return `Valor: R$ ${value.toFixed(2)}`;
            } else if (filtroSelecionado === 'duracaoMedia') {
              return `Duração: ${value.toFixed(0)} min`;
            } else if (filtroSelecionado === 'clientesUnicos') {
              return `Clientes: ${value}`;
            } else {
              return `Quantidade: ${value}`;
            }
          }
        }
      }
    },
  };

  // Função para lidar com a mudança de filtro
  const handleFiltroChange = (e) => {
    setFiltroSelecionado(e.target.value);
  };

  return (
    <StatisticsContainer>
      <Navigation />
      <StatisticsContent>
        <StatisticsHeader>Estatísticas de Agendamentos</StatisticsHeader>
        
        {isLoading ? (
          <LoadingMessage>Carregando estatísticas...</LoadingMessage>
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : (
          <>
            <FilterContainer>
              <FilterLabel>Visualizar por:</FilterLabel>
              <FilterSelect value={filtroSelecionado} onChange={handleFiltroChange}>
                <option value="quantidade">Quantidade de Agendamentos</option>
                <option value="valorTotal">Valor Total (R$)</option>
                <option value="duracaoMedia">Duração Média (minutos)</option>
                <option value="clientesUnicos">Clientes Únicos</option>
              </FilterSelect>
            </FilterContainer>
            
            <ChartContainer>
              <ChartTitle>
                {filtroSelecionado === 'quantidade' ? 'Estatísticas por Quantidade de Agendamentos' :
                 filtroSelecionado === 'valorTotal' ? 'Estatísticas por Valor Total (R$)' :
                 filtroSelecionado === 'duracaoMedia' ? 'Estatísticas por Duração Média (minutos)' :
                 'Estatísticas por Número de Clientes Únicos'}
              </ChartTitle>
              {dadosLimitados.length > 0 ? (
                <Bar 
                  data={chartData} 
                  options={chartOptions} 
                  height={Math.max(dadosLimitados.length * 30, 400)} 
                />
              ) : (
                <p>Nenhum dado disponível para exibição</p>
              )}
            </ChartContainer>
          </>
        )}
      </StatisticsContent>
    </StatisticsContainer>
  );
};

export default EstatisticasPage;
