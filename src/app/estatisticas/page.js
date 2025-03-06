'use client';

import { useEffect, useState } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
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
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Estatisticas() {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [periodoFiltro, setPeriodoFiltro] = useState('todos');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todos');

  // Buscar dados em tempo real
  useEffect(() => {
    const fetchDados = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dados');
        if (!response.ok) {
          throw new Error('Falha ao buscar dados');
        }
        const result = await response.json();
        setDados(result.data);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDados();

    // Atualizar dados a cada 30 segundos para manter em tempo real
    const intervalId = setInterval(fetchDados, 30000);
    return () => clearInterval(intervalId);
  }, []);

  // Função para filtrar agendamentos por período
  const filtrarPorPeriodo = (agendamentos) => {
    if (!agendamentos || periodoFiltro === 'todos') return agendamentos;
    
    const hoje = new Date();
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - hoje.getDay());
    inicioSemana.setHours(0, 0, 0, 0);
    
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    
    const inicioAno = new Date(hoje.getFullYear(), 0, 1);
    
    switch (periodoFiltro) {
      case 'semana':
        return agendamentos.filter(a => new Date(a.horaInicio) >= inicioSemana);
      case 'mes':
        return agendamentos.filter(a => new Date(a.horaInicio) >= inicioMes);
      case 'ano':
        return agendamentos.filter(a => new Date(a.horaInicio) >= inicioAno);
      default:
        return agendamentos;
    }
  };

  // Função para calcular estatísticas
  const calcularEstatisticas = () => {
    if (!dados) return null;

    const agendamentosFiltrados = filtrarPorPeriodo(dados.agendamentos);
    
    // Estatísticas gerais
    const totalAgendamentos = agendamentosFiltrados.length;
    
    // Calcular o faturamento total buscando o preço do serviço para cada agendamento
    const totalFaturamento = agendamentosFiltrados.reduce((acc, a) => {
      // Buscar o serviço correspondente para obter o preço
      const servico = dados.servicos.find(s => s.id === a.servicoid);
      const preco = servico ? Number(servico.preco) : 0;
      return acc + preco;
    }, 0);
    
    const mediaFaturamento = totalAgendamentos > 0 ? totalFaturamento / totalAgendamentos : 0;
    
    // Estatísticas por serviço
    const servicosMap = new Map();
    agendamentosFiltrados.forEach(a => {
      if (!a.servicoid) return;
      
      if (!servicosMap.has(a.servicoid)) {
        // Buscar o serviço correspondente para obter o preço
        const servico = dados.servicos.find(s => s.id === a.servicoid);
        if (!servico) return;
        
        servicosMap.set(a.servicoid, {
          nome: servico.nome || servico.descricao || 'Serviço sem nome',
          quantidade: 0,
          faturamento: 0,
          preco: Number(servico.preco) || 0
        });
      }
      
      const servicoStat = servicosMap.get(a.servicoid);
      servicoStat.quantidade += 1;
      servicoStat.faturamento += servicoStat.preco;
    });
    
    // Estatísticas por profissional
    const profissionaisMap = new Map();
    agendamentosFiltrados.forEach(a => {
      if (!a.funcionarioid) return;
      
      if (!profissionaisMap.has(a.funcionarioid)) {
        const funcionario = dados.funcionarios.find(f => f.id === a.funcionarioid);
        if (!funcionario) return;
        
        profissionaisMap.set(a.funcionarioid, {
          nome: funcionario.nome || 'Profissional sem nome',
          quantidade: 0,
          faturamento: 0
        });
      }
      
      const profissionalStat = profissionaisMap.get(a.funcionarioid);
      profissionalStat.quantidade += 1;
      
      // Obter o preço do serviço
      const servico = dados.servicos.find(s => s.id === a.servicoid);
      const preco = servico ? Number(servico.preco) : 0;
      
      profissionalStat.faturamento += preco;
    });
    
    // Estatísticas por dia da semana
    const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const agendamentosPorDia = new Array(7).fill(0);
    const faturamentoPorDia = new Array(7).fill(0);
    
    agendamentosFiltrados.forEach(a => {
      const data = new Date(a.horaInicio);
      const diaSemana = data.getDay();
      agendamentosPorDia[diaSemana] += 1;
      
      // Obter o preço do serviço
      const servico = dados.servicos.find(s => s.id === a.servicoid);
      const preco = servico ? Number(servico.preco) : 0;
      
      faturamentoPorDia[diaSemana] += preco;
    });
    
    // Estatísticas por mês
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const agendamentosPorMes = new Array(12).fill(0);
    const faturamentoPorMes = new Array(12).fill(0);
    
    agendamentosFiltrados.forEach(a => {
      const data = new Date(a.horaInicio);
      const mes = data.getMonth();
      agendamentosPorMes[mes] += 1;
      
      // Obter o preço do serviço
      const servico = dados.servicos.find(s => s.id === a.servicoid);
      const preco = servico ? Number(servico.preco) : 0;
      
      faturamentoPorMes[mes] += preco;
    });
    
    // Estatísticas por hora do dia
    const horasDia = Array.from({ length: 12 }, (_, i) => `${i + 8}h`); // 8h às 19h
    const agendamentosPorHora = new Array(12).fill(0);
    
    agendamentosFiltrados.forEach(a => {
      const data = new Date(a.horaInicio);
      const hora = data.getHours();
      if (hora >= 8 && hora < 20) {
        agendamentosPorHora[hora - 8] += 1;
      }
    });

    return {
      geral: {
        totalAgendamentos,
        totalFaturamento,
        mediaFaturamento,
        ticketMedio: totalAgendamentos > 0 ? totalFaturamento / totalAgendamentos : 0
      },
      servicos: Array.from(servicosMap.values()),
      profissionais: Array.from(profissionaisMap.values()),
      diasSemana: {
        labels: diasSemana,
        agendamentos: agendamentosPorDia,
        faturamento: faturamentoPorDia
      },
      meses: {
        labels: meses,
        agendamentos: agendamentosPorMes,
        faturamento: faturamentoPorMes
      },
      horas: {
        labels: horasDia,
        agendamentos: agendamentosPorHora
      }
    };
  };

  const estatisticas = dados ? calcularEstatisticas() : null;

  // Dados para o gráfico de serviços
  const dadosGraficoServicos = estatisticas ? {
    labels: estatisticas.servicos.map(s => s.nome),
    datasets: [
      {
        label: 'Quantidade de Agendamentos',
        data: estatisticas.servicos.map(s => s.quantidade),
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
  } : null;

  // Dados para o gráfico de profissionais
  const dadosGraficoProfissionais = estatisticas ? {
    labels: estatisticas.profissionais.map(p => p.nome),
    datasets: [
      {
        label: 'Faturamento (R$)',
        data: estatisticas.profissionais.map(p => p.faturamento),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  } : null;

  // Dados para o gráfico de dias da semana
  const dadosGraficoDiasSemana = estatisticas ? {
    labels: estatisticas.diasSemana.labels,
    datasets: [
      {
        label: 'Agendamentos',
        data: estatisticas.diasSemana.agendamentos,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  } : null;

  // Dados para o gráfico de meses
  const dadosGraficoMeses = estatisticas ? {
    labels: estatisticas.meses.labels,
    datasets: [
      {
        label: 'Faturamento (R$)',
        data: estatisticas.meses.faturamento,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ],
  } : null;

  // Dados para o gráfico de agendamentos por mês
  const dadosGraficoAgendamentosMeses = estatisticas ? {
    labels: estatisticas.meses.labels,
    datasets: [
      {
        label: 'Agendamentos',
        data: estatisticas.meses.agendamentos,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderWidth: 2,
        tension: 0.1
      }
    ],
  } : null;

  // Dados para o gráfico de horas
  const dadosGraficoHoras = estatisticas ? {
    labels: estatisticas.horas.labels,
    datasets: [
      {
        label: 'Agendamentos por Hora',
        data: estatisticas.horas.agendamentos,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  } : null;

  // Opções para os gráficos
  const opcoesGraficos = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  // Renderizar cards de estatísticas gerais
  const renderEstatisticasGerais = () => {
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
        <StatisticsContent>
          <StatisticsHeader>Estatísticas</StatisticsHeader>
          <LoadingMessage>Carregando dados...</LoadingMessage>
        </StatisticsContent>
      </StatisticsContainer>
    );
  }

  if (error) {
    return (
      <StatisticsContainer>
        <StatisticsContent>
          <StatisticsHeader>Estatísticas</StatisticsHeader>
          <ErrorMessage>Erro ao carregar dados: {error}</ErrorMessage>
        </StatisticsContent>
      </StatisticsContainer>
    );
  }

  return (
    <StatisticsContainer>
      <StatisticsContent>
        <StatisticsHeader>Estatísticas Analíticas</StatisticsHeader>
        
        <FilterContainer>
          <FilterLabel>Período:</FilterLabel>
          <FilterSelect 
            value={periodoFiltro} 
            onChange={(e) => setPeriodoFiltro(e.target.value)}
          >
            <option value="todos">Todos os períodos</option>
            <option value="semana">Última semana</option>
            <option value="mes">Último mês</option>
            <option value="ano">Último ano</option>
          </FilterSelect>
          
          <FilterLabel style={{ marginLeft: '20px' }}>Categoria:</FilterLabel>
          <FilterSelect 
            value={categoriaFiltro} 
            onChange={(e) => setCategoriaFiltro(e.target.value)}
          >
            <option value="todos">Todas as categorias</option>
            <option value="servicos">Serviços</option>
            <option value="profissionais">Profissionais</option>
            <option value="tempo">Análise Temporal</option>
          </FilterSelect>
        </FilterContainer>

        {estatisticas && (
          <>
            {renderEstatisticasGerais()}

            {(categoriaFiltro === 'todos' || categoriaFiltro === 'servicos') && (
              <ChartContainer>
                <ChartTitle>Distribuição de Agendamentos por Serviço</ChartTitle>
                {dadosGraficoServicos && <Pie data={dadosGraficoServicos} options={opcoesGraficos} />}
              </ChartContainer>
            )}

            {(categoriaFiltro === 'todos' || categoriaFiltro === 'profissionais') && (
              <ChartContainer>
                <ChartTitle>Faturamento por Profissional</ChartTitle>
                {dadosGraficoProfissionais && <Bar data={dadosGraficoProfissionais} options={opcoesGraficos} />}
              </ChartContainer>
            )}

            {(categoriaFiltro === 'todos' || categoriaFiltro === 'tempo') && (
              <>
                <ChartContainer>
                  <ChartTitle>Agendamentos por Dia da Semana</ChartTitle>
                  {dadosGraficoDiasSemana && <Bar data={dadosGraficoDiasSemana} options={opcoesGraficos} />}
                </ChartContainer>

                <ChartContainer>
                  <ChartTitle>Faturamento por Mês</ChartTitle>
                  {dadosGraficoMeses && <Bar data={dadosGraficoMeses} options={opcoesGraficos} />}
                </ChartContainer>

                <ChartContainer>
                  <ChartTitle>Agendamentos por Mês</ChartTitle>
                  {dadosGraficoAgendamentosMeses && <Bar data={dadosGraficoAgendamentosMeses} options={opcoesGraficos} />}
                </ChartContainer>

                <ChartContainer>
                  <ChartTitle>Distribuição de Agendamentos por Hora</ChartTitle>
                  {dadosGraficoHoras && <Bar data={dadosGraficoHoras} options={opcoesGraficos} />}
                </ChartContainer>
              </>
            )}
          </>
        )}
      </StatisticsContent>
    </StatisticsContainer>
  );
}