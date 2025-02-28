"use client";
import React, { useState } from 'react';
import { FormContainer, FormGroup, Label, Input, ErrorMessage, Button, ButtonGroup } from './styles';

export const FuncionarioForm = ({ onSubmit, onCancel, initialData = {} }) => {
  const [formData, setFormData] = useState({
    nome: initialData.nome || '',
    especialidade: initialData.especialidade || '',
    telefone: initialData.telefone || '',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    
    if (!formData.especialidade.trim()) {
      newErrors.especialidade = 'Especialidade é obrigatória';
    }
    
    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    } else if (!/^\(\d{2}\) \d{5}-\d{4}$/.test(formData.telefone) && 
               !/^\d{10,11}$/.test(formData.telefone.replace(/\D/g, ''))) {
      newErrors.telefone = 'Formato de telefone inválido';
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
      await onSubmit(formData);
      if (!initialData.id) {
        setFormData({
          nome: '',
          especialidade: '',
          telefone: '',
        });
      }
    } catch (error) {
      console.error('Erro ao salvar funcionário:', error);
      setErrors({ submit: 'Erro ao salvar. Por favor, tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
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
        telefone: value
      }));
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="nome">Nome</Label>
        <Input
          type="text"
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          placeholder="Nome do funcionário"
          data-error={!!errors.nome}
        />
        {errors.nome && <ErrorMessage>{errors.nome}</ErrorMessage>}
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="especialidade">Especialidade</Label>
        <Input
          type="text"
          id="especialidade"
          name="especialidade"
          value={formData.especialidade}
          onChange={handleChange}
          placeholder="Ex: Tatuador, Piercer, etc."
          data-error={!!errors.especialidade}
        />
        {errors.especialidade && <ErrorMessage>{errors.especialidade}</ErrorMessage>}
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="telefone">Telefone</Label>
        <Input
          type="text"
          id="telefone"
          name="telefone"
          value={formData.telefone}
          onChange={handlePhoneChange}
          placeholder="(XX) XXXXX-XXXX"
          data-error={!!errors.telefone}
        />
        {errors.telefone && <ErrorMessage>{errors.telefone}</ErrorMessage>}
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
