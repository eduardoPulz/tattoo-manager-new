"use client";
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Modal } from '../modal/Modal';
import { AgendamentoForm } from '../forms/AgendamentoForm';

const Button = styled.button`
  background-color: #ff4d4d;
  color: white;
  font-size: 18px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const CalendarIcon = styled.i`
  font-size: 16px;
`;

function SchedulingButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [funcionarios, setFuncionarios] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      loadData();
    }
  }, [isModalOpen]);

  const loadData = async () => {
    setLoading(true);
    
    try {
      const [funcionariosRes, servicosRes] = await Promise.all([
        fetch('/api/funcionarios').then(res => res.json()),
        fetch('/api/servicos').then(res => res.json())
      ]);
      
      if (funcionariosRes.success && Array.isArray(funcionariosRes.data)) {
        setFuncionarios(funcionariosRes.data);
      } else {
        console.error('Resposta inválida de funcionários:', funcionariosRes);
        setFuncionarios([]);
      }
      
      if (servicosRes.success && Array.isArray(servicosRes.data)) {
        setServicos(servicosRes.data);
      } else {
        console.error('Resposta inválida de serviços:', servicosRes);
        setServicos([]);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setFuncionarios([]);
      setServicos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAgendamentoSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await fetch('/api/agendamentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error('Erro ao salvar agendamento');
      }
      
      alert('Agendamento realizado com sucesso!');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
      alert('Erro ao salvar agendamento: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>
        Agendar
      </Button>
      
      {isModalOpen && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          title="Novo Agendamento"
        >
          <AgendamentoForm
            onSubmit={handleAgendamentoSubmit}
            onCancel={() => setIsModalOpen(false)}
            initialData={{}}
            sharedState={{ funcionarios, servicos }}
          />
        </Modal>
      )}
    </>
  );
}

export default SchedulingButton;
export { SchedulingButton };
