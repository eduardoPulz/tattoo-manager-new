"use client";
import React, { useState, useEffect } from 'react';
import { FormContainer, FormGroup, Label, Input, Select, ErrorMessage, Button, ButtonGroup, DateTimeInput } from './styles';

export const AgendamentoForm = ({ onSubmit, onCancel, initialData = {}, sharedState }) => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    id: initialData.id || null,
    nomeCliente: initialData.nomeCliente || initialData.clienteNome || '',
    clienteTelefone: initialData.clienteTelefone || '',
    funcionarioId: initialData.funcionarioId || '',
    servicoId: initialData.servicoId || '',
    horaInicio: initialData.horaInicio ? new Date(initialData.horaInicio).toISOString().slice(0, 16) : '',
    horaFim: initialData.horaFim ? new Date(initialData.horaFim).toISOString().slice(0, 16) : ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Usar o estado compartilhado se disponível
  useEffect(() => {
    if (sharedState) {
      setFuncionarios(sharedState.funcionarios || []);
      setServicos(sharedState.servicos || []);
      setLoading(false);
      
      // Atualizar formData com os dados iniciais
      if (initialData && initialData.id) {
        setFormData({
          id: initialData.id || null,
          nomeCliente: initialData.nomeCliente || initialData.clienteNome || '',
          clienteTelefone: initialData.clienteTelefone || '',
          funcionarioId: initialData.funcionarioId || '',
          servicoId: initialData.servicoId || '',
          horaInicio: initialData.horaInicio ? new Date(initialData.horaInicio).toISOString().slice(0, 16) : '',
          horaFim: initialData.horaFim ? new Date(initialData.horaFim).toISOString().slice(0, 16) : ''
        });
      }
    } else {
      // Carregar dados da API apenas se não houver estado compartilhado
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

          // Atualizar formData com os dados iniciais após carregar os dados
          if (initialData && initialData.id) {
            setFormData({
              id: initialData.id || null,
              nomeCliente: initialData.nomeCliente || initialData.clienteNome || '',
              clienteTelefone: initialData.clienteTelefone || '',
              funcionarioId: initialData.funcionarioId || '',
              servicoId: initialData.servicoId || '',
              horaInicio: initialData.horaInicio ? new Date(initialData.horaInicio).toISOString().slice(0, 16) : '',
              horaFim: initialData.horaFim ? new Date(initialData.horaFim).toISOString().slice(0, 16) : ''
            });
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
    }
  }, [initialData, sharedState]);

  useEffect(() => {
    if (formData.horaInicio && formData.servicoId) {
      try {
        // Encontrar o serviço selecionado
        const servicoSelecionado = servicos.find(s => s.id === formData.servicoId);
        
        if (servicoSelecionado) {
          // Obter a duração do serviço em minutos
          const duracaoMinutos = parseInt(servicoSelecionado.duracao, 10) || 60;
          
          const horaInicioStr = formData.horaInicio;
          const [dataStr, horaStr] = horaInicioStr.split('T');
          const [hora, minuto] = horaStr.split(':').map(Number);
          
          // Calcular os minutos totais
          let totalMinutos = hora * 60 + minuto + duracaoMinutos;
          
          // Calcular a nova hora e minuto
          let novaHora = Math.floor(totalMinutos / 60);
          let novoMinuto = totalMinutos % 60;
          
          // Se a nova hora for 24 ou mais, ajustar para 23:59 para manter no mesmo dia
          if (novaHora >= 24) {
            novaHora = 23;
            novoMinuto = 59;
          }
          
          // Criar a string da nova data/hora de fim
          const horaFimStr = `${dataStr}T${novaHora.toString().padStart(2, '0')}:${novoMinuto.toString().padStart(2, '0')}`;
          
          setFormData(prev => ({
            ...prev,
            horaFim: horaFimStr
          }));
        }
      } catch (error) {
        console.error('Erro ao calcular hora de fim:', error);
      }
    }
  }, [formData.horaInicio, formData.servicoId, servicos]);

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
    
    if (!formData.clienteTelefone.trim()) {
      newErrors.clienteTelefone = 'Telefone do cliente é obrigatório';
    } else if (!/^\(\d{2}\) \d{5}-\d{4}$/.test(formData.clienteTelefone) && 
               !/^\d{10,11}$/.test(formData.clienteTelefone.replace(/\D/g, ''))) {
      newErrors.clienteTelefone = 'Formato de telefone inválido';
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

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
      if (value.length > 2) {
        value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
      }
      if (value.length > 10) {
        value = `${value.substring(0, 10)}-${value.substring(10)}`;
      }
      
      setFormData(prev => ({
        ...prev,
        clienteTelefone: value
      }));
    }
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
        clienteTelefone: formData.clienteTelefone.trim(),
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
          clienteTelefone: '',
          funcionarioId: '',
          servicoId: '',
          horaInicio: '',
          horaFim: ''
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
        <Label htmlFor="clienteTelefone">Telefone do Cliente</Label>
        <Input
          type="text"
          id="clienteTelefone"
          name="clienteTelefone"
          value={formData.clienteTelefone}
          onChange={handlePhoneChange}
          placeholder="(XX) XXXXX-XXXX"
          data-error={!!errors.clienteTelefone}
        />
        {errors.clienteTelefone && <ErrorMessage>{errors.clienteTelefone}</ErrorMessage>}
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
              {servico.descricao} - {servico.duracao} min - R$ {servico.preco}
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
