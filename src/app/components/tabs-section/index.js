"use client";
import { useState, useEffect } from "react";
import { TabItem, TabsContainer, TabContent } from "./styles";
import { TableHeader } from "../table-header/TableHeader";
import { TableBody } from "../table-body/TableBody";
import { AddButton } from "../add-button/AddButton";
import { Modal } from "../modal/Modal";
import { FuncionarioForm } from "../forms/FuncionarioForm";
import { ServicoForm } from "../forms/ServicoForm";
import { AgendamentoForm } from "../forms/AgendamentoForm";

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
      
      // Mesmo se não for OK, tentamos analisar a resposta para entender o erro
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
  
  // Função para carregar dados com fallback
  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    // Função para carregar com tentativas
    const fetchWithRetry = async (endpoint, setter, emptyFallback = []) => {
      try {
        const result = await handleFetch(endpoint);
        if (result && result.success && Array.isArray(result.data)) {
          setter(result.data);
        } else {
          console.warn(`Resposta inválida de ${endpoint}:`, result);
          setter(emptyFallback); // Fallback para array vazio
        }
      } catch (error) {
        console.error(`Erro ao carregar dados de ${endpoint}:`, error);
        setter(emptyFallback); // Fallback para array vazio em caso de erro
      }
    };
    
    try {
      // Carregar dados de cada endpoint separadamente e com fallback para arrays vazios
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
  
  // Função para excluir funcionário com validação extra
  const handleDeleteFuncionario = async (id) => {
    try {
      if (!confirm('Tem certeza que deseja excluir este funcionário?')) {
        return;
      }
      
      setIsLoading(true);
      
      // Verificar se há agendamentos para este funcionário
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
    console.log('Editar funcionário:', funcionario);
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

  const handleEditServico = (servico) => {
    console.log('Editar serviço:', servico);
  };

  const handleEditAgendamento = (agendamento) => {
    console.log('Editar agendamento:', agendamento);
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

  const renderForm = () => {
    switch (activeTab.id) {
      case TABS.EMPLOYEES.id:
        return (
          <FuncionarioForm
            onSubmit={handleFuncionarioSubmit}
            onCancel={closeModal}
          />
        );
      case TABS.SERVICES.id:
        return (
          <ServicoForm
            onSubmit={handleServicoSubmit}
            onCancel={closeModal}
          />
        );
      case TABS.SCHEDULES.id:
        return (
          <AgendamentoForm
            onSubmit={handleAgendamentoSubmit}
            onCancel={closeModal}
          />
        );
      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (activeTab.id) {
      case TABS.EMPLOYEES.id:
        return "Adicionar Funcionário";
      case TABS.SERVICES.id:
        return "Adicionar Serviço";
      case TABS.SCHEDULES.id:
        return "Adicionar Agendamento";
      default:
        return "Adicionar";
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

      <AddButton text={activeTab.addButtonText} onClick={openModal} />

      {isLoading ? (
        <p>Carregando dados...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          {activeTab.id === TABS.SCHEDULES.id && (
            <>
              <TableHeader columns={TABS.SCHEDULES.columns} />
              <TableBody 
                items={agendamentos}
                columns={TABS.SCHEDULES.columns}
                formatRow={formatAgendamentoRow}
                onEdit={handleEditAgendamento}
                onDelete={(id) => handleDeleteAgendamento(String(id))}
              />
            </>
          )}

          {activeTab.id === TABS.EMPLOYEES.id && (
            <>
              <TableHeader columns={TABS.EMPLOYEES.columns} />
              <TableBody 
                items={funcionarios}
                columns={TABS.EMPLOYEES.columns}
                formatRow={formatFuncionarioRow}
                onEdit={handleEditFuncionario}
                onDelete={(id) => handleDeleteFuncionario(String(id))}
              />
            </>
          )}

          {activeTab.id === TABS.SERVICES.id && (
            <>
              <TableHeader columns={TABS.SERVICES.columns} />
              <TableBody 
                items={servicos}
                columns={TABS.SERVICES.columns}
                formatRow={formatServicoRow}
                onEdit={handleEditServico}
                onDelete={(id) => handleDeleteServico(String(id))}
              />
            </>
          )}
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={getModalTitle()}
      >
        {renderForm()}
      </Modal>
    </>
  );
};
