"use client";
import { useEffect, useState } from "react";
import { AgendamentoForm } from "../forms/AgendamentoForm";
import { FuncionarioForm } from "../forms/FuncionarioForm";
import { ServicoForm } from "../forms/ServicoForm";
import { Modal } from "../modal/Modal";
import { ActionButton, EmptyState, ErrorMessage, FaEdit, FaTrash, Loading, TabContent, TabHeader, TabItem, Table, TableContainer, TabsContainer, Title } from "./styles";
import { AddButton } from "../add-button/AddButton";

const TABS = {
  SCHEDULES: {
    id: "schedules",
    label: "Horários",
    addButtonText: "Adicionar",
    columns: ["Nome", "Horário Início", "Horário Fim", "Serviço", "Profissional", "Ações"]
  },
  EMPLOYEES: {
    id: "employees",
    label: "Funcionários",
    addButtonText: "Adicionar",
    columns: ["Nome", "Especialidade", "Telefone", "Ações"]
  },
  SERVICES: {
    id: "services",
    label: "Serviços",
    addButtonText: "Adicionar",
    columns: ["Descrição", "Tempo gasto", "Preço", "Ações"]
  }
};

export const TabsSection = ({ initialTab = "employees" }) => {
  const [activeTab, setActiveTab] = useState(
    initialTab === "schedules" ? TABS.SCHEDULES : 
    initialTab === "services" ? TABS.SERVICES : 
    TABS.EMPLOYEES
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [funcionarios, setFuncionarios] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentFuncionario, setCurrentFuncionario] = useState(null);
  const [currentServico, setCurrentServico] = useState(null);
  const [currentAgendamento, setCurrentAgendamento] = useState(null);
  const [showFuncionarioForm, setShowFuncionarioForm] = useState(false);
  const [showServicoForm, setShowServicoForm] = useState(false);
  const [showAgendamentoForm, setShowAgendamentoForm] = useState(false);

  const handleFetch = async (url, method = 'GET', body = null) => {
    try {
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
      };
      
      if (body) {
        options.body = JSON.stringify(body);
      }
      
      const response = await fetch(url, options);
      
      const data = await response.json().catch(() => ({ 
        success: false, 
        message: 'Erro ao analisar resposta do servidor' 
      }));
      
      if (!response.ok) {
        throw new Error(data.message || `Erro ${response.status}: ${response.statusText}`);
      }
      
      return data;
    } catch (error) {
      console.error(`Erro na requisição para ${url}:`, error);
      throw error;
    }
  };
  
  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    const fetchWithRetry = async (endpoint, setter, emptyFallback = []) => {
      try {
        const result = await handleFetch(endpoint);
        if (result && result.success && Array.isArray(result.data)) {
          setter(result.data);
        } else {
          console.warn(`Resposta inválida de ${endpoint}:`, result);
          setter(emptyFallback);
        }
      } catch (error) {
        console.error(`Erro ao carregar dados de ${endpoint}:`, error);
        setter(emptyFallback);
      }
    };
    
    try {
      await Promise.all([
        fetchWithRetry('/api/funcionarios', setFuncionarios),
        fetchWithRetry('/api/servicos', setServicos),
        fetchWithRetry('/api/agendamentos', setAgendamentos)
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Alguns dados não puderam ser carregados. O sistema continuará funcionando com recursos limitados.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteFuncionario = async (id) => {
    try {
      if (!confirm('Tem certeza que deseja excluir este funcionário?')) {
        return;
      }
      
      setIsLoading(true);
      
      const agendamentosRelacionados = agendamentos.filter(a => a.funcionarioid === id);
      if (agendamentosRelacionados.length > 0) {
        alert('Não é possível excluir este funcionário pois existem agendamentos associados a ele');
        return;
      }
      
      const funcionarioId = typeof id === 'object' ? id.id : id;
      
      console.log("Enviando exclusão para o ID:", funcionarioId);
      
      await handleFetch(`/api/funcionarios?id=${funcionarioId}`, 'DELETE');
      
      setFuncionarios(funcionarios.filter(f => f.id !== id));
      
      alert('Funcionário excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir funcionário:', error);
      alert(`Erro ao excluir funcionário: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleFuncionarioSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await handleFetch('/api/funcionarios', 'POST', data);
      
      if (!response.success) {
        throw new Error('Erro ao salvar funcionário');
      }
      
      const funcionarioSalvo = response.data;
      
      if (data.id) {
        setFuncionarios(prev => prev.map(f => 
          f.id === funcionarioSalvo.id ? funcionarioSalvo : f
        ));
      } else {
        setFuncionarios(prev => [...prev, funcionarioSalvo]);
      }
      
      setShowFuncionarioForm(false);
    } catch (error) {
      console.error('Erro ao salvar funcionário:', error);
      alert('Erro ao salvar funcionário: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleServicoSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await handleFetch('/api/servicos', 'POST', data);
      
      if (!response.success) {
        throw new Error('Erro ao salvar serviço');
      }
      
      const servicoSalvo = response.data;
      
      if (data.id) {
        setServicos(prev => prev.map(s => 
          s.id === servicoSalvo.id ? servicoSalvo : s
        ));
      } else {
        setServicos(prev => [...prev, servicoSalvo]);
      }
      
      setShowServicoForm(false);
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      alert('Erro ao salvar serviço: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgendamentoSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await handleFetch('/api/agendamentos', 'POST', data);
      
      if (!response.success) {
        throw new Error('Erro ao salvar agendamento');
      }
      
      const agendamentoSalvo = response.data;
      
      if (data.id) {
        setAgendamentos(prev => prev.map(a => 
          a.id === agendamentoSalvo.id ? agendamentoSalvo : a
        ));
      } else {
        setAgendamentos(prev => [...prev, agendamentoSalvo]);
      }
      
      setShowAgendamentoForm(false);
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
      alert('Erro ao salvar agendamento: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatFuncionarioRow = (funcionario) => {
    return [
      funcionario.nome,
      funcionario.especialidade,
      funcionario.telefone
    ];
  };

  const formatServicoRow = (servico) => {
    // Garantir que o preço seja um número
    const preco = typeof servico.preco === 'number' ? servico.preco : parseFloat(servico.preco || 0);
    
    return [
      servico.descricao,
      `${servico.duracao} min`,
      `R$ ${preco}`
    ];
  };

  const formatAgendamentoRow = (agendamento) => {
    const formatDate = (date) => {
      const d = new Date(date);
      return d.toLocaleString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };
    
    // Buscar o nome do serviço e do funcionário
    const servico = servicos.find(s => s.id === agendamento.servicoid);
    const funcionario = funcionarios.find(f => f.id === agendamento.funcionarioid);
    
    return [
      agendamento.nomeCliente,
      formatDate(agendamento.horaInicio),
      formatDate(agendamento.horaFim),
      servico ? (servico.nome || servico.descricao) : 'Desconhecido',
      funcionario ? funcionario.nome : 'Desconhecido'
    ];
  };

  const handleEditFuncionario = (funcionario) => {
    setCurrentFuncionario(funcionario);
    setShowFuncionarioForm(true);
  };

  const handleEditServico = (servico) => {
    setCurrentServico(servico);
    setShowServicoForm(true);
  };

  const handleEditAgendamento = (agendamento) => {
    // Buscar o serviço e funcionário completos para o agendamento
    const servico = servicos.find(s => s.id === agendamento.servicoid);
    const funcionario = funcionarios.find(f => f.id === agendamento.funcionarioid);
    
    // Preparar os dados completos para o formulário
    const agendamentoCompleto = {
      ...agendamento,
      servicoNome: servico ? servico.nome : '',
      funcionarioNome: funcionario ? funcionario.nome : ''
    };
    
    setCurrentAgendamento(agendamentoCompleto);
    setShowAgendamentoForm(true);
  };

  const handleDeleteServico = async (id) => {
    if (!id) {
      alert('ID do serviço não fornecido');
      return;
    }
    
    if (!confirm('Tem certeza que deseja excluir este serviço?')) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      const agendamentosRelacionados = agendamentos.filter(a => a.servicoid === id);
      if (agendamentosRelacionados.length > 0) {
        alert('Não é possível excluir este serviço pois existem agendamentos associados a ele');
        return;
      }
      
      const servicoId = typeof id === 'object' ? id.id : id;
      
      await handleFetch(`/api/servicos?id=${servicoId}`, 'DELETE');
      
      setServicos(servicos.filter(s => s.id !== id));
      
      alert('Serviço excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir serviço:', error);
      alert(`Erro ao excluir serviço: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAgendamento = async (id) => {
    if (!id) {
      alert('ID do agendamento não fornecido');
      return;
    }
    
    if (!confirm('Tem certeza que deseja excluir este agendamento?')) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      await handleFetch(`/api/agendamentos?id=${id}`, 'DELETE');
      
      setAgendamentos(agendamentos.filter(a => a.id !== id));
      
      alert('Agendamento excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error);
      alert(`Erro ao excluir agendamento: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAgendamento = () => {
    setCurrentAgendamento(null);
    setShowAgendamentoForm(true);
  };

  const [sharedState, setSharedState] = useState({
    funcionarios: [],
    servicos: []
  });

  useEffect(() => {
    setSharedState({
      funcionarios,
      servicos
    });
  }, [funcionarios, servicos]);

  const renderTabContent = () => {
    switch (activeTab.id) {
      case TABS.EMPLOYEES.id:
        return (
          <TabContent>
            <AddButton text="Adicionar Funcionário" onClick={() => {
              setCurrentFuncionario(null);
              setShowFuncionarioForm(true);
            }} />
            
            {isLoading ? (
              <Loading>Carregando...</Loading>
            ) : error ? (
              <ErrorMessage>{error}</ErrorMessage>
            ) : (
              <>
                {funcionarios.length === 0 ? (
                  <EmptyState>Nenhum funcionário cadastrado</EmptyState>
                ) : (
                  <TableContainer>
                    <Table>
                      <thead>
                        <tr>
                          <th>Nome</th>
                          <th>Especialidade</th>
                          <th>Telefone</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {funcionarios.map(funcionario => (
                          <tr key={funcionario.id}>
                            {formatFuncionarioRow(funcionario).map((cell, i) => (
                              <td key={i}>{cell}</td>
                            ))}
                            <td>
                              <ActionButton onClick={() => handleEditFuncionario(funcionario)}>
                                <FaEdit />
                              </ActionButton>
                              <ActionButton onClick={() => handleDeleteFuncionario(funcionario.id)}>
                                <FaTrash />
                              </ActionButton>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </TableContainer>
                )}
              </>
            )}
            
            {showFuncionarioForm && (
              <Modal isOpen={showFuncionarioForm} onClose={() => setShowFuncionarioForm(false)} title="Funcionário">
                <FuncionarioForm
                  onSubmit={handleFuncionarioSubmit}
                  onCancel={() => setShowFuncionarioForm(false)}
                  initialData={currentFuncionario || {}}
                />
              </Modal>
            )}
          </TabContent>
        );
        
      case TABS.SERVICES.id:
        return (
          <TabContent>
            <AddButton text="Adicionar Serviço" onClick={() => {
              setCurrentServico(null);
              setShowServicoForm(true);
            }} />
            
            {isLoading ? (
              <Loading>Carregando...</Loading>
            ) : error ? (
              <ErrorMessage>{error}</ErrorMessage>
            ) : (
              <>
                {servicos.length === 0 ? (
                  <EmptyState>Nenhum serviço cadastrado</EmptyState>
                ) : (
                  <TableContainer>
                    <Table>
                      <thead>
                        <tr>
                          <th>Descrição</th>
                          <th>Duração</th>
                          <th>Preço</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {servicos.map(servico => (
                          <tr key={servico.id}>
                            {formatServicoRow(servico).map((cell, i) => (
                              <td key={i}>{cell}</td>
                            ))}
                            <td>
                              <ActionButton onClick={() => handleEditServico(servico)}>
                                <FaEdit />
                              </ActionButton>
                              <ActionButton onClick={() => handleDeleteServico(servico.id)}>
                                <FaTrash />
                              </ActionButton>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </TableContainer>
                )}
              </>
            )}
            
            {showServicoForm && (
              <Modal isOpen={showServicoForm} onClose={() => setShowServicoForm(false)} title="Serviço">
                <ServicoForm
                  onSubmit={handleServicoSubmit}
                  onCancel={() => setShowServicoForm(false)}
                  initialData={currentServico || {}}
                />
              </Modal>
            )}
          </TabContent>
        );
        
      case TABS.SCHEDULES.id:
        return (
          <TabContent>
            <AddButton text="Adicionar Agendamento" onClick={handleAddAgendamento} />
            
            {isLoading ? (
              <Loading>Carregando...</Loading>
            ) : error ? (
              <ErrorMessage>{error}</ErrorMessage>
            ) : (
              <>
                {agendamentos.length === 0 ? (
                  <EmptyState>Nenhum agendamento cadastrado</EmptyState>
                ) : (
                  <TableContainer>
                    <Table>
                      <thead>
                        <tr>
                          <th>Cliente</th>
                          <th>Início</th>
                          <th>Fim</th>
                          <th>Serviço</th>
                          <th>Profissional</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {agendamentos.map(agendamento => (
                          <tr key={agendamento.id}>
                            {formatAgendamentoRow(agendamento).map((cell, i) => (
                              <td key={i}>{cell}</td>
                            ))}
                            <td>
                              <ActionButton onClick={() => handleEditAgendamento(agendamento)}>
                                <FaEdit />
                              </ActionButton>
                              <ActionButton onClick={() => handleDeleteAgendamento(agendamento.id)}>
                                <FaTrash />
                              </ActionButton>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </TableContainer>
                )}
              </>
            )}
            
            {showAgendamentoForm && (
              <Modal isOpen={showAgendamentoForm} onClose={() => setShowAgendamentoForm(false)} title="Agendamento">
                <AgendamentoForm
                  onSubmit={handleAgendamentoSubmit}
                  onCancel={() => setShowAgendamentoForm(false)}
                  initialData={currentAgendamento || {}}
                  sharedState={sharedState}
                />
              </Modal>
            )}
          </TabContent>
        );
        
      default:
        return null;
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <TabsContainer>
        {Object.values(TABS).map((tab) => (
          <TabItem
            key={tab.id}
            onClick={() => handleTabClick(tab)}
            className={activeTab.id === tab.id ? "active" : ""}
          >
            {tab.label}
          </TabItem>
        ))}
      </TabsContainer>

      {renderTabContent()}
    </div>
  );
};
