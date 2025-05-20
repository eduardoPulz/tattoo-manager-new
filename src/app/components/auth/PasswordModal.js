"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ModalOverlay, ModalContainer, ModalHeader, ModalBody, CloseButton } from '../modal/styles';
import styled from 'styled-components';

const PasswordInput = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const SubmitButton = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
  
  &:hover {
    background-color: #357ae8;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 5px;
`;

function PasswordModal({ isOpen, onClose }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Senha simples para acesso
  const ADMIN_PASSWORD = 'admin123';

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password === ADMIN_PASSWORD) {
      router.push('/admin');
      onClose();
    } else {
      setError('Senha incorreta. Tente novamente.');
    }
  };

  if (!isOpen) return null;

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={handleModalClick}>
        <ModalHeader>
          <h2>Acesso Administrativo</h2>
          <CloseButton onClick={onClose}>
            <i className="ti ti-x" />
          </CloseButton>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <label>
              Digite a senha de administrador:
              <PasswordInput 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </label>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <SubmitButton type="submit">Entrar</SubmitButton>
          </form>
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
}

export default PasswordModal;
export { PasswordModal };
