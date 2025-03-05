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
  StatisticsGrid
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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const [agendamentosRes, servicosRes, funcionariosRes] = await Promise.all([
          fetch('/api/agendamentos').then(res => res.json()),
          fetch('/api/servicos').then(res => res.json()),
          fetch('/api/funcionarios').then(res => res.json())
        ]);
        
        if (agendamentosRes.success && Array.isArray(agendamentosRes.data)) {
          setAgendamentos(agendamentosRes.data);
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

  const prepararDadosServicos = () => {
    if (!agendamentos.length || !servicos.length) return { labels: [], data: [] };
    
    const contagem = {};
    
    servicos.forEach(servico => {
      contagem[servico.id] = {
        nome: servico.descricao,
        count: 0
      };
    });
    
    agendamentos.forEach(agendamento => {
      if (contagem[agendamento.servicoId]) {
        contagem[agendamento.servicoId].count++;
      }
    });
    
    const servicosOrdenados = Object.values(contagem)
      .sort((a, b) => b.count - a.count);
    
    return {
      labels: servicosOrdenados.map(item => item.nome),
      data: servicosOrdenados.map(item => item.count)
    };
  };

  const prepararDadosFuncionarios = () => {
    if (!agendamentos.length || !funcionarios.length) return { labels: [], data: [] };
    
    const contagem = {};
    
    funcionarios.forEach(funcionario => {
      contagem[funcionario.id] = {
        nome: funcionario.nome,
        count: 0
      };
    });
    
    agendamentos.forEach(agendamento => {
      if (contagem[agendamento.funcionarioId]) {
        contagem[agendamento.funcionarioId].count++;
      }
    });
    
    const funcionariosOrdenados = Object.values(contagem)
      .sort((a, b) => b.count - a.count);
    
    return {
      labels: funcionariosOrdenados.map(item => item.nome),
      data: funcionariosOrdenados.map(item => item.count)
    };
  };

  const prepararDadosDiasSemana = () => {
    if (!agendamentos.length) return { labels: [], data: [] };
    
    const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const contagem = [0, 0, 0, 0, 0, 0, 0]; 
    
    agendamentos.forEach(agendamento => {
      const data = new Date(agendamento.horaInicio);
      const diaSemana = data.getDay(); 
      contagem[diaSemana]++;
    });
    
    const pares = diasSemana.map((dia, index) => [dia, contagem[index]]);
    
    pares.sort((a, b) => b[1] - a[1]);
    
    return {
      labels: pares.map(par => par[0]),
      data: pares.map(par => par[1])
    };
  };

  const prepararDadosMeses = () => {
    if (!agendamentos.length) return { labels: [], data: [] };
    
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const contagem = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    
    agendamentos.forEach(agendamento => {
      const data = new Date(agendamento.horaInicio);
      const mes = data.getMonth();
      contagem[mes]++;
    });
    
    const pares = meses.map((mes, index) => [mes, contagem[index]]);
    
    pares.sort((a, b) => b[1] - a[1]);
    
    return {
      labels: pares.map(par => par[0]),
      data: pares.map(par => par[1])
    };
  };

  // Preparar dados para os gráficos
  const dadosServicos = prepararDadosServicos();
  const dadosFuncionarios = prepararDadosFuncionarios();
  const dadosDiasSemana = prepararDadosDiasSemana();
  const dadosMeses = prepararDadosMeses();
  
  // Configurar dados para os gráficos
  const servicosChartData = {
    labels: dadosServicos.labels,
    datasets: [
      {
        label: 'Quantidade de Agendamentos',
        data: dadosServicos.data,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  const funcionariosChartData = {
    labels: dadosFuncionarios.labels,
    datasets: [
      {
        label: 'Quantidade de Agendamentos',
        data: dadosFuncionarios.data,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  const diasSemanaChartData = {
    labels: dadosDiasSemana.labels,
    datasets: [
      {
        label: 'Quantidade de Agendamentos',
        data: dadosDiasSemana.data,
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  const mesesChartData = {
    labels: dadosMeses.labels,
    datasets: [
      {
        label: 'Quantidade de Agendamentos',
        data: dadosMeses.data,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
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
          precision: 0
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
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Quantidade: ${context.parsed.x}`;
          }
        }
      }
    },
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
          <StatisticsGrid>
            <ChartContainer>
              <ChartTitle>Serviços Mais Agendados</ChartTitle>
              {dadosServicos.labels.length > 0 ? (
                <Bar 
                  data={servicosChartData} 
                  options={chartOptions} 
                  height={Math.max(dadosServicos.labels.length * 30, 200)} 
                />
              ) : (
                <p>Nenhum dado disponível para serviços</p>
              )}
            </ChartContainer>
            
            <ChartContainer>
              <ChartTitle>Profissionais Mais Requisitados</ChartTitle>
              {dadosFuncionarios.labels.length > 0 ? (
                <Bar 
                  data={funcionariosChartData} 
                  options={chartOptions} 
                  height={Math.max(dadosFuncionarios.labels.length * 30, 200)} 
                />
              ) : (
                <p>Nenhum dado disponível para profissionais</p>
              )}
            </ChartContainer>
            
            <ChartContainer>
              <ChartTitle>Dias da Semana Mais Agendados</ChartTitle>
              {dadosDiasSemana.labels.length > 0 ? (
                <Bar 
                  data={diasSemanaChartData} 
                  options={chartOptions} 
                  height={Math.max(dadosDiasSemana.labels.length * 30, 200)} 
                />
              ) : (
                <p>Nenhum dado disponível para dias da semana</p>
              )}
            </ChartContainer>
            
            <ChartContainer>
              <ChartTitle>Meses Mais Agendados</ChartTitle>
              {dadosMeses.labels.length > 0 ? (
                <Bar 
                  data={mesesChartData} 
                  options={chartOptions} 
                  height={Math.max(dadosMeses.labels.length * 30, 200)} 
                />
              ) : (
                <p>Nenhum dado disponível para meses</p>
              )}
            </ChartContainer>
          </StatisticsGrid>
        )}
      </StatisticsContent>
    </StatisticsContainer>
  );
};

export default EstatisticasPage;
