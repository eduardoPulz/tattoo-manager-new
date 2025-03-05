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
    if (!agendamentos.length || !servicos.length) return [];
    
    const contagem = {};
    const valorTotal = {};
    const duracaoTotal = {};
    const clientesUnicos = {};
    const contadorServicos = {};
    
    servicos.forEach(servico => {
      if (!servico || !servico.id) return;
      
      contagem[servico.id] = 0;
      valorTotal[servico.id] = 0;
      duracaoTotal[servico.id] = 0;
      clientesUnicos[servico.id] = new Set();
      contadorServicos[servico.id] = {
        nome: servico.nome || servico.descricao || 'Serviço',
        descricao: servico.descricao || '',
        preco: parseFloat(servico.preco || 0),
        duracao: parseInt(servico.duracao || 0)
      };
    });
    
    agendamentos.forEach(agendamento => {
      if (!agendamento || !agendamento.servicoId || !contagem[agendamento.servicoId]) return;
      
      contagem[agendamento.servicoId]++;
      
      // Adicionar valor total com validação
      try {
        valorTotal[agendamento.servicoId] += parseFloat(agendamento.preco || 0);
      } catch (e) {
        console.error('Erro ao processar preço:', e);
      }
      
      // Calcular duração com validação
      try {
        const servico = contadorServicos[agendamento.servicoId];
        if (servico) {
          duracaoTotal[agendamento.servicoId] += parseInt(servico.duracao || 0);
        }
      } catch (e) {
        console.error('Erro ao processar duração:', e);
      }
      
      // Adicionar cliente único com validação
      try {
        if (agendamento.clienteNome) {
          clientesUnicos[agendamento.servicoId].add(agendamento.clienteNome);
        }
      } catch (e) {
        console.error('Erro ao processar cliente:', e);
      }
    });
    
    // Preparar dados para ordenação com validação
    const servicosData = Object.keys(contagem).map(id => {
      try {
        return {
          id,
          nome: `Serviço: ${contadorServicos[id]?.nome || 'Desconhecido'}`,
          quantidade: contagem[id] || 0,
          valorTotal: valorTotal[id] || 0,
          duracaoMedia: contagem[id] > 0 ? (duracaoTotal[id] || 0) / contagem[id] : 0,
          clientesUnicos: (clientesUnicos[id]?.size) || 0
        };
      } catch (e) {
        console.error('Erro ao preparar dados de serviço:', e);
        return {
          id,
          nome: `Serviço: Desconhecido`,
          quantidade: 0,
          valorTotal: 0,
          duracaoMedia: 0,
          clientesUnicos: 0
        };
      }
    });
    
    // Ordenar por quantidade (padrão) com validação
    try {
      servicosData.sort((a, b) => (b.quantidade || 0) - (a.quantidade || 0));
    } catch (e) {
      console.error('Erro ao ordenar serviços:', e);
    }
    
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
      if (!agendamento || !agendamento.horaInicio) return;
      
      try {
        const data = new Date(agendamento.horaInicio);
        
        // Verificar se a data é válida
        if (isNaN(data.getTime())) return;
        
        const diaSemana = data.getDay();
        
        // Verificar se o índice é válido
        if (diaSemana < 0 || diaSemana > 6) return;
        
        contagem[diaSemana]++;
        
        // Adicionar valor total com validação
        try {
          valorTotal[diaSemana] += parseFloat(agendamento.preco || 0);
        } catch (e) {
          console.error('Erro ao processar preço para dia da semana:', e);
        }
        
        // Calcular duração com validação
        try {
          if (agendamento.horaFim) {
            const horaInicio = new Date(agendamento.horaInicio);
            const horaFim = new Date(agendamento.horaFim);
            
            // Verificar se as datas são válidas
            if (!isNaN(horaInicio.getTime()) && !isNaN(horaFim.getTime())) {
              const duracao = Math.max(0, (horaFim - horaInicio) / (1000 * 60)); // em minutos, não permite valores negativos
              duracaoTotal[diaSemana] += duracao;
            }
          }
        } catch (e) {
          console.error('Erro ao processar duração para dia da semana:', e);
        }
        
        // Adicionar cliente único com validação
        try {
          if (agendamento.clienteNome) {
            clientesUnicos[diaSemana].add(agendamento.clienteNome);
          }
        } catch (e) {
          console.error('Erro ao processar cliente para dia da semana:', e);
        }
      } catch (e) {
        console.error('Erro ao processar agendamento para dia da semana:', e);
      }
    });
    
    // Preparar dados para ordenação com validação
    const diasSemanaData = diasSemana.map((dia, index) => {
      try {
        return {
          nome: `Dia: ${dia}`,
          quantidade: contagem[index] || 0,
          valorTotal: valorTotal[index] || 0,
          duracaoMedia: contagem[index] > 0 ? (duracaoTotal[index] || 0) / contagem[index] : 0,
          clientesUnicos: (clientesUnicos[index]?.size) || 0
        };
      } catch (e) {
        console.error('Erro ao preparar dados de dia da semana:', e);
        return {
          nome: `Dia: ${dia}`,
          quantidade: 0,
          valorTotal: 0,
          duracaoMedia: 0,
          clientesUnicos: 0
        };
      }
    });
    
    // Ordenar por quantidade (padrão) com validação
    try {
      diasSemanaData.sort((a, b) => (b.quantidade || 0) - (a.quantidade || 0));
    } catch (e) {
      console.error('Erro ao ordenar dias da semana:', e);
    }
    
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
      if (!agendamento || !agendamento.horaInicio) return;
      
      try {
        const data = new Date(agendamento.horaInicio);
        
        // Verificar se a data é válida
        if (isNaN(data.getTime())) return;
        
        const mes = data.getMonth();
        
        // Verificar se o índice é válido
        if (mes < 0 || mes > 11) return;
        
        contagem[mes]++;
        
        // Adicionar valor total com validação
        try {
          valorTotal[mes] += parseFloat(agendamento.preco || 0);
        } catch (e) {
          console.error('Erro ao processar preço para mês:', e);
        }
        
        // Calcular duração com validação
        try {
          if (agendamento.horaFim) {
            const horaInicio = new Date(agendamento.horaInicio);
            const horaFim = new Date(agendamento.horaFim);
            
            // Verificar se as datas são válidas
            if (!isNaN(horaInicio.getTime()) && !isNaN(horaFim.getTime())) {
              const duracao = Math.max(0, (horaFim - horaInicio) / (1000 * 60)); // em minutos, não permite valores negativos
              duracaoTotal[mes] += duracao;
            }
          }
        } catch (e) {
          console.error('Erro ao processar duração para mês:', e);
        }
        
        // Adicionar cliente único com validação
        try {
          if (agendamento.clienteNome) {
            clientesUnicos[mes].add(agendamento.clienteNome);
          }
        } catch (e) {
          console.error('Erro ao processar cliente para mês:', e);
        }
      } catch (e) {
        console.error('Erro ao processar agendamento para mês:', e);
      }
    });
    
    // Preparar dados para ordenação com validação
    const mesesData = meses.map((mes, index) => {
      try {
        return {
          nome: `Mês: ${mes}`,
          quantidade: contagem[index] || 0,
          valorTotal: valorTotal[index] || 0,
          duracaoMedia: contagem[index] > 0 ? (duracaoTotal[index] || 0) / contagem[index] : 0,
          clientesUnicos: (clientesUnicos[index]?.size) || 0
        };
      } catch (e) {
        console.error('Erro ao preparar dados de mês:', e);
        return {
          nome: `Mês: ${mes}`,
          quantidade: 0,
          valorTotal: 0,
          duracaoMedia: 0,
          clientesUnicos: 0
        };
      }
    });
    
    // Ordenar por quantidade (padrão) com validação
    try {
      mesesData.sort((a, b) => (b.quantidade || 0) - (a.quantidade || 0));
    } catch (e) {
      console.error('Erro ao ordenar meses:', e);
    }
    
    return mesesData;
  };

  const renderizarGrafico = () => {
    if (isLoading) return <LoadingMessage>Carregando dados...</LoadingMessage>;
    if (error) return <ErrorMessage>{error}</ErrorMessage>;
    
    try {
      // Preparar dados com base no filtro selecionado
      const dadosServicos = prepararDadosServicos();
      const dadosFuncionarios = prepararDadosFuncionarios();
      const dadosDiasSemana = prepararDadosDiasSemana();
      const dadosMeses = prepararDadosMeses();
      
      // Verificar se há dados para exibir
      if (!dadosServicos.length && !dadosFuncionarios.length && !dadosDiasSemana.length && !dadosMeses.length) {
        return <ErrorMessage>Não há dados suficientes para gerar estatísticas.</ErrorMessage>;
      }
      
      // Combinar todos os dados em um único array
      const todosDados = [
        ...(dadosServicos || []), 
        ...(dadosFuncionarios || []), 
        ...(dadosDiasSemana || []), 
        ...(dadosMeses || [])
      ];
      
      // Verificar se há dados combinados
      if (!todosDados.length) {
        return <ErrorMessage>Não há dados suficientes para gerar estatísticas.</ErrorMessage>;
      }
      
      // Definir cores para cada categoria
      const cores = {
        'Serviço:': 'rgba(75, 192, 192, 0.8)',
        'Profissional:': 'rgba(153, 102, 255, 0.8)',
        'Dia:': 'rgba(255, 159, 64, 0.8)',
        'Mês:': 'rgba(255, 99, 132, 0.8)'
      };
      
      // Obter valor com base no filtro selecionado
      const obterValor = (item) => {
        try {
          switch (filtroSelecionado) {
            case 'quantidade':
              return item.quantidade || 0;
            case 'valor':
              return item.valorTotal || 0;
            case 'duracao':
              return item.duracaoMedia || 0;
            case 'clientes':
              return item.clientesUnicos || 0;
            default:
              return item.quantidade || 0;
          }
        } catch (e) {
          console.error('Erro ao obter valor para o gráfico:', e);
          return 0;
        }
      };
      
      // Ordenar todos os dados com base no filtro selecionado
      try {
        todosDados.sort((a, b) => obterValor(b) - obterValor(a));
      } catch (e) {
        console.error('Erro ao ordenar dados para o gráfico:', e);
      }
      
      // Preparar dados para o gráfico
      const labels = todosDados.map(item => item.nome || 'Desconhecido');
      const data = todosDados.map(obterValor);
      
      // Determinar cores com base no prefixo do label
      const backgroundColor = todosDados.map(item => {
        try {
          const prefixo = item.nome?.split(':')[0] + ':';
          return cores[prefixo] || 'rgba(201, 203, 207, 0.8)';
        } catch (e) {
          console.error('Erro ao determinar cor para o gráfico:', e);
          return 'rgba(201, 203, 207, 0.8)';
        }
      });
      
      // Configuração do gráfico
      const options = {
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                try {
                  const item = todosDados[context.dataIndex];
                  let valor = context.formattedValue;
                  
                  switch (filtroSelecionado) {
                    case 'quantidade':
                      return `Quantidade: ${valor}`;
                    case 'valor':
                      return `Valor Total: R$ ${parseFloat(valor).toFixed(2)}`;
                    case 'duracao':
                      return `Duração Média: ${parseFloat(valor).toFixed(0)} min`;
                    case 'clientes':
                      return `Clientes Únicos: ${valor}`;
                    default:
                      return `Quantidade: ${valor}`;
                  }
                } catch (e) {
                  console.error('Erro ao formatar tooltip:', e);
                  return 'Valor: ' + context.formattedValue;
                }
              }
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                try {
                  if (filtroSelecionado === 'valor') {
                    return 'R$ ' + value.toLocaleString('pt-BR');
                  } else if (filtroSelecionado === 'duracao') {
                    return value + ' min';
                  }
                  return value;
                } catch (e) {
                  console.error('Erro ao formatar ticks do eixo X:', e);
                  return value;
                }
              }
            }
          }
        }
      };
      
      // Altura dinâmica com base na quantidade de itens
      const altura = Math.max(400, todosDados.length * 30);
      
      return (
        <div>
          <FilterContainer>
            <FilterLabel>Visualizar por:</FilterLabel>
            <FilterSelect 
              value={filtroSelecionado}
              onChange={(e) => setFiltroSelecionado(e.target.value)}
            >
              <option value="quantidade">Quantidade de Agendamentos</option>
              <option value="valor">Valor Total (R$)</option>
              <option value="duracao">Duração Média (minutos)</option>
              <option value="clientes">Clientes Únicos</option>
            </FilterSelect>
          </FilterContainer>
          
          <ChartContainer style={{ height: altura + 'px' }}>
            <Bar 
              data={{
                labels,
                datasets: [{
                  data,
                  backgroundColor,
                  borderColor: backgroundColor.map(cor => cor.replace('0.8', '1')),
                  borderWidth: 1
                }]
              }}
              options={options}
            />
          </ChartContainer>
        </div>
      );
    } catch (error) {
      console.error('Erro ao renderizar gráfico:', error);
      return <ErrorMessage>Erro ao renderizar gráfico: {error.message}</ErrorMessage>;
    }
  };

  return (
    <StatisticsContainer>
      <Navigation />
      <StatisticsContent>
        <StatisticsHeader>Estatísticas de Agendamentos</StatisticsHeader>
        {renderizarGrafico()}
      </StatisticsContent>
    </StatisticsContainer>
  );
};

export default EstatisticasPage;
