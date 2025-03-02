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

export const TabsSection = () => {
  const [activeTab, setActiveTab] = useState(TABS.EMPLOYEES);
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

  // Função para lidar com erros de forma mais robusta
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
      
      // Analisar a resposta
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
      
      const agendamentosRelacionados = agendamentos.filter(a => a.funcionarioId === id);
      if (agendamentosRelacionados.length > 0) {
        alert('Não é possível excluir este funcionário pois existem agendamentos associados a ele');
        return;
      }
      
      // Verificar se o ID é um objeto e convertê-lo para string se necessário
      const funcionarioId = typeof id === 'object' ? id.id : id;
      
      console.log("Enviando exclusão para o ID:", funcionarioId);
      
      // Fazer a exclusão
      await handleFetch(`/api/funcionarios?id=${funcionarioId}`, 'DELETE');
      
      // Atualizar a lista
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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFuncionarioSubmit = async (data) => {
    try {
      const response = await handleFetch('/api/funcionarios', 'POST', data);
      
      if (!response.success) {
        throw new Error('Erro ao salvar funcionário');
      }
      
      const novoFuncionario = response.data;
      setFuncionarios(prev => [...prev, novoFuncionario]);
      closeModal();
    } catch (error) {
      console.error('Erro ao salvar funcionário:', error);
      throw error;
    }
  };

  const handleServicoSubmit = async (data) => {
    try {
      const response = await handleFetch('/api/servicos', 'POST', data);
      
      if (!response.success) {
        throw new Error('Erro ao salvar serviço');
      }
      
      const novoServico = response.data;
      setServicos(prev => [...prev, novoServico]);
      closeModal();
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      throw error;
    }
  };

  const handleAgendamentoSubmit = async (data) => {
    try {
      const response = await handleFetch('/api/agendamentos', 'POST', data);
      
      if (!response.success) {
        throw new Error('Erro ao salvar agendamento');
      }
      
      const novoAgendamento = response.data;
      setAgendamentos(prev => [...prev, novoAgendamento]);
      closeModal();
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
      throw error;
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
    return [
      servico.descricao,
      `${servico.duracao} min`,
      `R$ ${servico.preco.toFixed(2)}`
    ];
  };

  const formatAgendamentoRow = (agendamento) => {
    const funcionario = funcionarios.find(f => f.id === agendamento.funcionarioId);
    const servico = servicos.find(s => s.id === agendamento.servicoId);
    
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
    
    return [
      agendamento.nomeCliente,
      formatDate(agendamento.horaInicio),
      formatDate(agendamento.horaFim),
      servico ? servico.descricao : 'Serviço não encontrado',
      funcionario ? funcionario.nome : 'Funcionário não encontrado'
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
    setCurrentAgendamento(agendamento);
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
      
      // Fazer a exclusão
      await handleFetch(`/api/servicos?id=${id}`, 'DELETE');
      
      // Atualizar a lista
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
      
      // Fazer a exclusão
      await handleFetch(`/api/agendamentos?id=${id}`, 'DELETE');
      
      // Atualizar a lista
      setAgendamentos(agendamentos.filter(a => a.id !== id));
      
      alert('Agendamento excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error);
      alert(`Erro ao excluir agendamento: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

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
              <Modal onClose={() => setShowFuncionarioForm(false)}>
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
              <Modal onClose={() => setShowServicoForm(false)}>
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
            <AddButton text="Adicionar Agendamento" onClick={() => {
              setCurrentAgendamento(null);
              setShowAgendamentoForm(true);
            }} />
            
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
              <Modal onClose={() => setShowAgendamentoForm(false)}>
                <AgendamentoForm
                  onSubmit={handleAgendamentoSubmit}
                  onCancel={() => setShowAgendamentoForm(false)}
                  initialData={currentAgendamento || {}}
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
    <>
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
    </>
  );
};
