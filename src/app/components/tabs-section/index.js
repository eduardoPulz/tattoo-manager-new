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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [funcionariosRes, servicosRes, agendamentosRes] = await Promise.all([
          fetch('/api/funcionarios').then(res => res.json()),
          fetch('/api/servicos').then(res => res.json()),
          fetch('/api/agendamentos').then(res => res.json())
        ]);
        
        setFuncionarios(funcionariosRes);
        setServicos(servicosRes);
        setAgendamentos(agendamentosRes);
        setError(null);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Falha ao carregar dados. Por favor, recarregue a página.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
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
      const response = await fetch('/api/funcionarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Erro ao salvar funcionário');
      }
      
      const novoFuncionario = await response.json();
      setFuncionarios(prev => [...prev, novoFuncionario]);
      closeModal();
    } catch (error) {
      console.error('Erro ao salvar funcionário:', error);
      throw error;
    }
  };

  const handleServicoSubmit = async (data) => {
    try {
      const response = await fetch('/api/servicos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Erro ao salvar serviço');
      }
      
      const novoServico = await response.json();
      setServicos(prev => [...prev, novoServico]);
      closeModal();
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      throw error;
    }
  };

  const handleAgendamentoSubmit = async (data) => {
    try {
      const response = await fetch('/api/agendamentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Erro ao salvar agendamento');
      }
      
      const novoAgendamento = await response.json();
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

  const handleDeleteFuncionario = async (funcionario) => {
    if (window.confirm(`Deseja realmente excluir o funcionário ${funcionario.nome}?`)) {
      try {
        const response = await fetch(`/api/funcionarios?id=${funcionario.id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Erro ao excluir funcionário');
        }
        
        setFuncionarios(prev => prev.filter(f => f.id !== funcionario.id));
      } catch (error) {
        console.error('Erro ao excluir funcionário:', error);
        alert('Erro ao excluir funcionário');
      }
    }
  };

  const handleEditServico = (servico) => {
    console.log('Editar serviço:', servico);
  };

  const handleDeleteServico = async (servico) => {
    if (window.confirm(`Deseja realmente excluir o serviço ${servico.descricao}?`)) {
      try {
        const response = await fetch(`/api/servicos?id=${servico.id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Erro ao excluir serviço');
        }
        
        setServicos(prev => prev.filter(s => s.id !== servico.id));
      } catch (error) {
        console.error('Erro ao excluir serviço:', error);
        alert('Erro ao excluir serviço');
      }
    }
  };

  const handleEditAgendamento = (agendamento) => {
    console.log('Editar agendamento:', agendamento);
  };

  const handleDeleteAgendamento = async (agendamento) => {
    if (window.confirm(`Deseja realmente excluir este agendamento?`)) {
      try {
        const response = await fetch(`/api/agendamentos?id=${agendamento.id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Erro ao excluir agendamento');
        }
        
        setAgendamentos(prev => prev.filter(a => a.id !== agendamento.id));
      } catch (error) {
        console.error('Erro ao excluir agendamento:', error);
        alert('Erro ao excluir agendamento');
      }
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
                onDelete={handleDeleteAgendamento}
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
                onDelete={handleDeleteFuncionario}
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
                onDelete={handleDeleteServico}
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
