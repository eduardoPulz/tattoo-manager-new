'use client';

import { useEffect, useState } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Navigation } from '../components/navigation/Navigation';
import { 
  StatisticsContainer, 
  StatisticsContent, 
  StatisticsHeader, 
  ChartContainer, 
  ChartTitle, 
  LoadingMessage, 
  ErrorMessage,
  FilterContainer,
  FilterLabel,
  FilterSelect,
  StatisticsGrid,
  StatisticsCard,
  StatisticsCardTitle
} from './styles';

// Registrar componentes do ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Estatisticas() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [periodoFiltro, setPeriodoFiltro] = useState('mes');
  const [categoriaFiltro, setCategoriaFiltro] = useState('servicos');
  const [estatisticas, setEstatisticas] = useState(null);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        setLoading(true);
        
        // Buscar agendamentos
        const agendamentosResponse = await fetch('/api/agendamentos');
        if (!agendamentosResponse.ok) {
          throw new Error('Erro ao buscar agendamentos');
        }
        const agendamentosData = await agendamentosResponse.json();
        
        // Buscar serviços
        const servicosResponse = await fetch('/api/servicos');
        if (!servicosResponse.ok) {
          throw new Error('Erro ao buscar serviços');
        }
        const servicosData = await servicosResponse.json();
        
        // Buscar funcionários
        const funcionariosResponse = await fetch('/api/funcionarios');
        if (!funcionariosResponse.ok) {
          throw new Error('Erro ao buscar funcionários');
        }
        const funcionariosData = await funcionariosResponse.json();
        
        setAgendamentos(agendamentosData.data || []);
        setServicos(servicosData.data || []);
        setFuncionarios(funcionariosData.data || []);
        
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError('Não foi possível carregar os dados. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDados();
  }, []);
  
  useEffect(() => {
    if (agendamentos.length > 0 && servicos.length > 0 && funcionarios.length > 0) {
      const estatisticasCalculadas = calcularEstatisticas();
      setEstatisticas(estatisticasCalculadas);
    }
  }, [agendamentos, servicos, funcionarios, periodoFiltro]);
  
  // Função para filtrar agendamentos por período
  const filtrarPorPeriodo = (agendamentos) => {
    if (!agendamentos || agendamentos.length === 0) return [];
    
    const hoje = new Date();
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - hoje.getDay()); // Domingo
    inicioSemana.setHours(0, 0, 0, 0);
    
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const inicioAno = new Date(hoje.getFullYear(), 0, 1);
    
    return agendamentos.filter(a => {
      const dataAgendamento = new Date(a.horaInicio);
      
      switch (periodoFiltro) {
        case 'semana':
          return dataAgendamento >= inicioSemana;
        case 'mes':
          return dataAgendamento >= inicioMes;
        case 'ano':
          return dataAgendamento >= inicioAno;
        default:
          return true;
      }
    });
  };
  
  // Função para calcular estatísticas
  const calcularEstatisticas = () => {
    if (!agendamentos || !servicos || !funcionarios) return null;

    const agendamentosFiltrados = filtrarPorPeriodo(agendamentos);
    
    // Estatísticas gerais
    const totalAgendamentos = agendamentosFiltrados.length;
    
    // Calcular o faturamento total buscando o preço do serviço para cada agendamento
    const totalFaturamento = agendamentosFiltrados.reduce((acc, a) => {
      // Buscar o serviço correspondente para obter o preço
      const servico = servicos.find(s => s.id === a.servicoId);
      const preco = servico ? Number(servico.preco) : 0;
      return acc + preco;
    }, 0);
    
    const mediaFaturamento = totalAgendamentos > 0 ? totalFaturamento / totalAgendamentos : 0;
    
    // Estatísticas por serviço
    const servicosMap = new Map();
    agendamentosFiltrados.forEach(a => {
      if (!a.servicoId) return;
      
      if (!servicosMap.has(a.servicoId)) {
        // Buscar o serviço correspondente para obter o preço
        const servico = servicos.find(s => s.id === a.servicoId);
        if (!servico) return;
        
        servicosMap.set(a.servicoId, {
          nome: servico.nome || servico.descricao || 'Serviço sem nome',
          quantidade: 0,
          faturamento: 0,
          preco: Number(servico.preco) || 0
        });
      }
      
      const servicoStat = servicosMap.get(a.servicoId);
      servicoStat.quantidade += 1;
      servicoStat.faturamento += servicoStat.preco;
    });
    
    // Estatísticas por profissional
    const profissionaisMap = new Map();
    agendamentosFiltrados.forEach(a => {
      if (!a.funcionarioId) return;
      
      if (!profissionaisMap.has(a.funcionarioId)) {
        const funcionario = funcionarios.find(f => f.id === a.funcionarioId);
        if (!funcionario) return;
        
        profissionaisMap.set(a.funcionarioId, {
          nome: funcionario.nome || 'Profissional sem nome',
          quantidade: 0,
          faturamento: 0
        });
      }
      
      const profissionalStat = profissionaisMap.get(a.funcionarioId);
      profissionalStat.quantidade += 1;
      
      // Obter o preço do serviço
      const servico = servicos.find(s => s.id === a.servicoId);
      const preco = servico ? Number(servico.preco) : 0;
      
      profissionalStat.faturamento += preco;
    });
    
    return {
      geral: {
        totalAgendamentos,
        totalFaturamento,
        mediaFaturamento
      },
      servicos: Array.from(servicosMap.values()).sort((a, b) => b.quantidade - a.quantidade),
      profissionais: Array.from(profissionaisMap.values()).sort((a, b) => b.quantidade - a.quantidade)
    };
  };

  // Função para renderizar o gráfico dinâmico
  const renderizarGraficoDinamico = () => {
    if (!estatisticas) return null;
    
    let dados = [];
    let labels = [];
    let titulo = '';
    
    // Definir dados com base na categoria selecionada
    if (categoriaFiltro === 'servicos') {
      dados = estatisticas.servicos.map(s => s.faturamento);
      labels = estatisticas.servicos.map(s => s.nome);
      titulo = 'Faturamento por Serviço';
    } else if (categoriaFiltro === 'profissionais') {
      dados = estatisticas.profissionais.map(p => p.faturamento);
      labels = estatisticas.profissionais.map(p => p.nome);
      titulo = 'Faturamento por Profissional';
    }
    
    // Configuração do gráfico
    const dadosGrafico = {
      labels,
      datasets: [
        {
          label: 'Faturamento (R$)',
          data: dados,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
          ],
          borderWidth: 1,
        },
      ],
    };
    
    // Opções do gráfico
    const opcoesGrafico = {
      indexAxis: 'y', // Para barras horizontais
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: titulo,
        },
      },
    };
    
    return (
      <ChartContainer>
        <Bar data={dadosGrafico} options={opcoesGrafico} height={400} />
      </ChartContainer>
    );
  };

  // Renderizar cards de estatísticas gerais
  const renderizarEstatisticasGerais = () => {
    if (!estatisticas) return null;
    
    const formatarValor = (valor) => `R$ ${valor.toFixed(2).replace('.', ',')}`;
    
    return (
      <StatisticsGrid>
        <StatisticsCard>
          <StatisticsCardTitle>Total de Agendamentos</StatisticsCardTitle>
          <div>{estatisticas.geral.totalAgendamentos}</div>
        </StatisticsCard>
        
        <StatisticsCard>
          <StatisticsCardTitle>Valor Total</StatisticsCardTitle>
          <div>{formatarValor(estatisticas.geral.totalFaturamento)}</div>
        </StatisticsCard>
        
        <StatisticsCard>
          <StatisticsCardTitle>Valor Médio</StatisticsCardTitle>
          <div>{formatarValor(estatisticas.geral.mediaFaturamento)}</div>
        </StatisticsCard>
      </StatisticsGrid>
    );
  };

  if (loading) {
    return (
      <StatisticsContainer>
        <Navigation />
        <StatisticsContent>
          <LoadingMessage>Carregando estatísticas...</LoadingMessage>
        </StatisticsContent>
      </StatisticsContainer>
    );
  }

  if (error) {
    return (
      <StatisticsContainer>
        <Navigation />
        <StatisticsContent>
          <ErrorMessage>{error}</ErrorMessage>
        </StatisticsContent>
      </StatisticsContainer>
    );
  }

  return (
    <StatisticsContainer>
      <Navigation />
      
      <StatisticsContent>
        <FilterContainer>
          <div>
            <FilterLabel>Período:</FilterLabel>
            <FilterSelect 
              value={periodoFiltro} 
              onChange={(e) => setPeriodoFiltro(e.target.value)}
            >
              <option value="semana">Última Semana</option>
              <option value="mes">Último Mês</option>
              <option value="ano">Último Ano</option>
            </FilterSelect>
          </div>
          
          <div>
            <FilterLabel>Categoria:</FilterLabel>
            <FilterSelect 
              value={categoriaFiltro} 
              onChange={(e) => setCategoriaFiltro(e.target.value)}
            >
              <option value="servicos">Serviços</option>
              <option value="profissionais">Profissionais</option>
            </FilterSelect>
          </div>
        </FilterContainer>

        {estatisticas && (
          <>
            {renderizarEstatisticasGerais()}
            {renderizarGraficoDinamico()}
          </>
        )}
      </StatisticsContent>
    </StatisticsContainer>
  );
}