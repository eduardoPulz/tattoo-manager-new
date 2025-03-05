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
      console.log('Iniciando busca de agendamentos...');
      const response = await fetch('/api/agendamentos', {
        cache: 'no-store',
        next: { revalidate: 60 } // Revalidar a cada 60 segundos
      });
      
      if (!response.ok) {
        console.error(`Erro ao buscar agendamentos: ${response.status} ${response.statusText}`);
        throw new Error(`Erro ao buscar agendamentos: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`Agendamentos carregados com sucesso: ${data.length} registros`);
      return data;
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      throw error;
    }
  }

  // Função para processar dados de serviços com tratamento de erros
  function processarDadosServicos(agendamentos, filtro) {
    if (!agendamentos || !Array.isArray(agendamentos) || agendamentos.length === 0) {
      console.log('Nenhum agendamento para processar dados de serviços');
      return { labels: [], data: [] };
    }

    console.log(`Processando dados de serviços com filtro: ${filtro}`);
    try {
      // Agrupar por serviço
      const servicosMap = new Map();
      
      agendamentos.forEach(agendamento => {
        if (!agendamento || !agendamento.servicoId || !agendamento.servicoNome) {
          console.warn('Agendamento com dados de serviço incompletos:', agendamento);
          return;
        }
        
        const servicoId = agendamento.servicoId;
        if (!servicosMap.has(servicoId)) {
          servicosMap.set(servicoId, {
            nome: agendamento.servicoNome,
            quantidade: 0,
            valorTotal: 0,
            duracaoTotal: 0,
            clientesUnicos: new Set(),
          });
        }
        
        const servico = servicosMap.get(servicoId);
        servico.quantidade += 1;
        
        // Valor total
        if (agendamento.preco && !isNaN(parseFloat(agendamento.preco))) {
          servico.valorTotal += parseFloat(agendamento.preco);
        }
        
        // Duração
        if (agendamento.horaInicio && agendamento.horaFim) {
          const inicio = new Date(agendamento.horaInicio);
          const fim = new Date(agendamento.horaFim);
          if (inicio instanceof Date && !isNaN(inicio) && fim instanceof Date && !isNaN(fim)) {
            const duracaoMinutos = Math.round((fim - inicio) / (1000 * 60));
            servico.duracaoTotal += duracaoMinutos;
          }
        }
        
        // Clientes únicos
        if (agendamento.clienteNome) {
          servico.clientesUnicos.add(agendamento.clienteNome);
        }
      });
      
      // Converter para arrays e ordenar
      const servicosArray = Array.from(servicosMap.values())
        .map(servico => ({
          ...servico,
          clientesUnicos: servico.clientesUnicos.size,
          duracaoMedia: servico.quantidade > 0 ? Math.round(servico.duracaoTotal / servico.quantidade) : 0
        }));
      
      // Ordenar por quantidade (padrão)
      let dadosOrdenados;
      switch (filtro) {
        case 'valor':
          dadosOrdenados = servicosArray.sort((a, b) => b.valorTotal - a.valorTotal);
          break;
        case 'duracao':
          dadosOrdenados = servicosArray.sort((a, b) => b.duracaoMedia - a.duracaoMedia);
          break;
        case 'clientes':
          dadosOrdenados = servicosArray.sort((a, b) => b.clientesUnicos - a.clientesUnicos);
          break;
        default:
          dadosOrdenados = servicosArray.sort((a, b) => b.quantidade - a.quantidade);
      }
      
      // Limitar a 10 itens para melhor visualização
      const dadosTop = dadosOrdenados.slice(0, 10);
      
      // Extrair labels e dados
      const labels = dadosTop.map(servico => servico.nome);
      
      let data;
      switch (filtro) {
        case 'valor':
          data = dadosTop.map(servico => servico.valorTotal);
          break;
        case 'duracao':
          data = dadosTop.map(servico => servico.duracaoMedia);
          break;
        case 'clientes':
          data = dadosTop.map(servico => servico.clientesUnicos);
          break;
        default:
          data = dadosTop.map(servico => servico.quantidade);
      }
      
      return { labels, data };
    } catch (error) {
      console.error('Erro ao processar dados de serviços:', error);
      return { labels: [], data: [] };
    }
  }

  const renderizarGrafico = () => {
    if (isLoading) return <LoadingMessage>Carregando dados...</LoadingMessage>;
    if (error) return <ErrorMessage>{error}</ErrorMessage>;
    
    try {
      // Preparar dados com base no filtro selecionado
      const dadosServicos = processarDadosServicos(agendamentos, filtroSelecionado);
      
      // Verificar se há dados para exibir
      if (!dadosServicos.labels.length || !dadosServicos.data.length) {
        return <ErrorMessage>Não há dados suficientes para gerar estatísticas.</ErrorMessage>;
      }
      
      // Definir cores para cada categoria
      const cores = {
        'Serviço:': 'rgba(75, 192, 192, 0.8)',
        'Profissional:': 'rgba(153, 102, 255, 0.8)',
        'Dia:': 'rgba(255, 159, 64, 0.8)',
        'Mês:': 'rgba(255, 99, 132, 0.8)'
      };
      
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
                  let valor = context.formattedValue;
                  
                  switch (filtroSelecionado) {
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
      const altura = Math.max(400, dadosServicos.labels.length * 30);
      
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
                labels: dadosServicos.labels,
                datasets: [{
                  data: dadosServicos.data,
                  backgroundColor: dadosServicos.labels.map(() => 'rgba(75, 192, 192, 0.8)'),
                  borderColor: dadosServicos.labels.map(() => 'rgba(75, 192, 192, 1)'),
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
