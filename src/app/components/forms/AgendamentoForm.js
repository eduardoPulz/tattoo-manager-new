"use client";
import React, { useState, useEffect } from 'react';
import { FormContainer, FormGroup, Label, Input, Select, ErrorMessage, Button, ButtonGroup, DateTimeInput } from './styles';

export const AgendamentoForm = ({ onSubmit, onCancel, initialData = {} }) => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    id: initialData.id || null,
    nomeCliente: initialData.nomeCliente || '',
    funcionarioId: initialData.funcionarioId || '',
    servicoId: initialData.servicoId || '',
    horaInicio: initialData.horaInicio ? new Date(initialData.horaInicio).toISOString().slice(0, 16) : '',
    horaFim: initialData.horaFim ? new Date(initialData.horaFim).toISOString().slice(0, 16) : '',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
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
        setErrors({ fetch: 'Erro ao carregar dados. Por favor, recarregue a página.' });
        setFuncionarios([]);
        setServicos([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.servicoId && formData.horaInicio) {
      const servicoSelecionado = servicos.find(s => s.id === formData.servicoId);
      if (servicoSelecionado) {
        const horaInicio = new Date(formData.horaInicio);
        const horaFim = new Date(horaInicio.getTime() + servicoSelecionado.duracao * 60000);
        setFormData(prev => ({
          ...prev,
          horaFim: horaFim.toISOString().slice(0, 16)
        }));
      }
    }
  }, [formData.servicoId, formData.horaInicio, servicos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.nomeCliente.trim()) {
      newErrors.nomeCliente = 'Nome do cliente é obrigatório';
    }
    
    if (!formData.funcionarioId) {
      newErrors.funcionarioId = 'Selecione um funcionário';
    }
    
    if (!formData.servicoId) {
      newErrors.servicoId = 'Selecione um serviço';
    }
    
    if (!formData.horaInicio) {
      newErrors.horaInicio = 'Data e hora de início são obrigatórias';
    }
    
    if (!formData.horaFim) {
      newErrors.horaFim = 'Data e hora de fim são obrigatórias';
    } else if (new Date(formData.horaFim) <= new Date(formData.horaInicio)) {
      newErrors.horaFim = 'A data e hora de fim devem ser posteriores ao início';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Garantir que as datas sejam formatadas corretamente
      const horaInicio = new Date(formData.horaInicio);
      const horaFim = new Date(formData.horaFim);
      
      // Verificar se as datas são válidas antes de enviar
      if (isNaN(horaInicio.getTime()) || isNaN(horaFim.getTime())) {
        throw new Error('Datas inválidas. Verifique o formato.');
      }
      
      const dataToSubmit = {
        id: formData.id,
        nomeCliente: formData.nomeCliente.trim(),
        funcionarioId: formData.funcionarioId,
        servicoId: formData.servicoId,
        horaInicio: horaInicio.toISOString(),
        horaFim: horaFim.toISOString()
      };
      
      await onSubmit(dataToSubmit);
      
      if (!formData.id) {
        setFormData({
          id: null,
          nomeCliente: '',
          funcionarioId: '',
          servicoId: '',
          horaInicio: '',
          horaFim: '',
        });
      }
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
      setErrors({ submit: `Erro ao salvar: ${error.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div>Carregando dados...</div>;
  }

  return (
    <FormContainer onSubmit={handleSubmit}>
      {errors.fetch && <ErrorMessage>{errors.fetch}</ErrorMessage>}
      
      <FormGroup>
        <Label htmlFor="nomeCliente">Nome do Cliente</Label>
        <Input
          type="text"
          id="nomeCliente"
          name="nomeCliente"
          value={formData.nomeCliente}
          onChange={handleChange}
          placeholder="Nome do cliente"
          data-error={!!errors.nomeCliente}
        />
        {errors.nomeCliente && <ErrorMessage>{errors.nomeCliente}</ErrorMessage>}
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="funcionarioId">Profissional</Label>
        <Select
          id="funcionarioId"
          name="funcionarioId"
          value={formData.funcionarioId}
          onChange={handleChange}
          data-error={!!errors.funcionarioId}
        >
          <option value="">Selecione um profissional</option>
          {funcionarios.map(funcionario => (
            <option key={funcionario.id} value={funcionario.id}>
              {funcionario.nome} - {funcionario.especialidade}
            </option>
          ))}
        </Select>
        {errors.funcionarioId && <ErrorMessage>{errors.funcionarioId}</ErrorMessage>}
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="servicoId">Serviço</Label>
        <Select
          id="servicoId"
          name="servicoId"
          value={formData.servicoId}
          onChange={handleChange}
          data-error={!!errors.servicoId}
        >
          <option value="">Selecione um serviço</option>
          {servicos.map(servico => (
            <option key={servico.id} value={servico.id}>
              {servico.descricao} - {servico.duracao} min - R$ {servico.preco.toFixed(2)}
            </option>
          ))}
        </Select>
        {errors.servicoId && <ErrorMessage>{errors.servicoId}</ErrorMessage>}
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="horaInicio">Data e Hora de Início</Label>
        <DateTimeInput
          type="datetime-local"
          id="horaInicio"
          name="horaInicio"
          value={formData.horaInicio}
          onChange={handleChange}
          data-error={!!errors.horaInicio}
        />
        {errors.horaInicio && <ErrorMessage>{errors.horaInicio}</ErrorMessage>}
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="horaFim">Data e Hora de Fim</Label>
        <DateTimeInput
          type="datetime-local"
          id="horaFim"
          name="horaFim"
          value={formData.horaFim}
          onChange={handleChange}
          data-error={!!errors.horaFim}
          readOnly={!!formData.servicoId}
        />
        {errors.horaFim && <ErrorMessage>{errors.horaFim}</ErrorMessage>}
        {formData.servicoId && (
          <small>Calculado automaticamente com base na duração do serviço</small>
        )}
      </FormGroup>
      
      {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}
      
      <ButtonGroup>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : formData.id ? 'Atualizar' : 'Salvar'}
        </Button>
      </ButtonGroup>
    </FormContainer>
  );
};
