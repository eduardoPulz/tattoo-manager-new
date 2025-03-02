"use client";
import React, { useState } from 'react';
import { FormContainer, FormGroup, Label, Input, ErrorMessage, Button, ButtonGroup } from './styles';

export const ServicoForm = ({ onSubmit, onCancel, initialData = {} }) => {
  const [formData, setFormData] = useState({
    id: initialData.id || null,
    descricao: initialData.descricao || '',
    duracao: initialData.duracao || 60,
    preco: initialData.preco || 0
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

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value)) {
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
    }
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    if (/^\d*\.?\d*$/.test(value)) {
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
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }
    
    if (!formData.duracao) {
      newErrors.duracao = 'Duração é obrigatória';
    } else if (parseInt(formData.duracao) <= 0) {
      newErrors.duracao = 'Duração deve ser maior que zero';
    }
    
    if (!formData.preco) {
      newErrors.preco = 'Preço é obrigatório';
    } else if (parseFloat(formData.preco) <= 0) {
      newErrors.preco = 'Preço deve ser maior que zero';
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
        ...formData,
        duracao: parseInt(formData.duracao),
        preco: parseFloat(formData.preco)
      };
      
      await onSubmit(dataToSubmit);
      
      if (!initialData.id) {
        setFormData({
          descricao: '',
          duracao: '',
          preco: '',
        });
      }
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      setErrors({ submit: 'Erro ao salvar. Por favor, tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="descricao">Descrição</Label>
        <Input
          type="text"
          id="descricao"
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          placeholder="Descrição do serviço"
          data-error={!!errors.descricao}
        />
        {errors.descricao && <ErrorMessage>{errors.descricao}</ErrorMessage>}
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="duracao">Duração (minutos)</Label>
        <Input
          type="text"
          id="duracao"
          name="duracao"
          value={formData.duracao}
          onChange={handleNumberChange}
          placeholder="Ex: 60"
          data-error={!!errors.duracao}
        />
        {errors.duracao && <ErrorMessage>{errors.duracao}</ErrorMessage>}
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="preco">Preço (R$)</Label>
        <Input
          type="text"
          id="preco"
          name="preco"
          value={formData.preco}
          onChange={handlePriceChange}
          placeholder="Ex: 150.00"
          data-error={!!errors.preco}
        />
        {errors.preco && <ErrorMessage>{errors.preco}</ErrorMessage>}
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
