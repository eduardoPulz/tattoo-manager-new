"use client";
import React, { useState, useEffect } from 'react';
import { FormContainer, FormGroup, Label, Input, Select, ErrorMessage, Button, ButtonGroup, DateTimeInput } from './styles';

export const AgendamentoForm = ({ onSubmit, onCancel, initialData = {} }) => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    nomeCliente: initialData.nomeCliente || '',
    funcionarioId: initialData.funcionarioId || '',
    servicoId: initialData.servicoId || '',
    dataInicio: initialData.horaInicio ? new Date(initialData.horaInicio).toISOString().slice(0, 16) : '',
    dataFim: initialData.horaFim ? new Date(initialData.horaFim).toISOString().slice(0, 16) : '',
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
        
        // Verificar se as respostas contêm os dados no formato esperado
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
    if (formData.servicoId && formData.dataInicio) {
      const servicoSelecionado = servicos.find(s => s.id === formData.servicoId);
      if (servicoSelecionado) {
        const dataInicio = new Date(formData.dataInicio);
        const dataFim = new Date(dataInicio.getTime() + servicoSelecionado.duracao * 60000);
        setFormData(prev => ({
          ...prev,
          dataFim: dataFim.toISOString().slice(0, 16)
        }));
      }
    }
  }, [formData.servicoId, formData.dataInicio, servicos]);

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
    
    if (!formData.dataInicio) {
      newErrors.dataInicio = 'Data e hora de início são obrigatórias';
    }
    
    if (!formData.dataFim) {
      newErrors.dataFim = 'Data e hora de fim são obrigatórias';
    } else if (new Date(formData.dataFim) <= new Date(formData.dataInicio)) {
      newErrors.dataFim = 'A data e hora de fim devem ser posteriores ao início';
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
      const dataToSubmit = {
        nomeCliente: formData.nomeCliente,
        funcionarioId: formData.funcionarioId,
        servicoId: formData.servicoId,
        horaInicio: new Date(formData.dataInicio).toISOString(),
        horaFim: new Date(formData.dataFim).toISOString(),
      };
      
      if (initialData.id) {
        dataToSubmit.id = initialData.id;
      }
      
      await onSubmit(dataToSubmit);
      
      if (!initialData.id) {
        setFormData({
          nomeCliente: '',
          funcionarioId: '',
          servicoId: '',
          dataInicio: '',
          dataFim: '',
        });
      }
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
      setErrors({ submit: 'Erro ao salvar. Por favor, tente novamente.' });
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
        <Label htmlFor="dataInicio">Data e Hora de Início</Label>
        <DateTimeInput
          type="datetime-local"
          id="dataInicio"
          name="dataInicio"
          value={formData.dataInicio}
          onChange={handleChange}
          data-error={!!errors.dataInicio}
        />
        {errors.dataInicio && <ErrorMessage>{errors.dataInicio}</ErrorMessage>}
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="dataFim">Data e Hora de Fim</Label>
        <DateTimeInput
          type="datetime-local"
          id="dataFim"
          name="dataFim"
          value={formData.dataFim}
          onChange={handleChange}
          data-error={!!errors.dataFim}
          readOnly={!!formData.servicoId} // Somente leitura se um serviço for selecionado
        />
        {errors.dataFim && <ErrorMessage>{errors.dataFim}</ErrorMessage>}
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
          {isSubmitting ? 'Salvando...' : initialData.id ? 'Atualizar' : 'Salvar'}
        </Button>
      </ButtonGroup>
    </FormContainer>
  );
};
