"use client";
import { useState } from "react";
import { Header, LogoSection, BrushIcon, StudioName, AdminSection, PersonIcon, AdminText, NavItem } from "./styles";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { SchedulingButton } from "../scheduling/SchedulingButton";



const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
  color: #333;

  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }
`;

const ModalBody = styled.div`
  padding: 16px;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

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

export const Navigation = () => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();

  const ADMIN_PASSWORD = 'admin123';

  const handleAdminClick = (e) => {
    e.preventDefault();
    setIsPasswordModalOpen(true);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    if (password === ADMIN_PASSWORD) {
      router.push('/admin');
      setIsPasswordModalOpen(false);
      setPassword('');
      setPasswordError('');
    } else {
      setPasswordError('Senha incorreta. Tente novamente.');
      setPassword('');
    }
  };

  return (
    <Header>
      <LogoSection>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BrushIcon className="ti ti-brush" />
          <StudioName>Tattoo do JayJay</StudioName>
        </Link>
      </LogoSection>
      <AdminSection>
        <PersonIcon className="ti ti-user" />
        <AdminText>
          <a href="#" onClick={handleAdminClick}>Admin</a>
        </AdminText>
        <Link href="/estatisticas">
          <NavItem>Estatísticas</NavItem>
        </Link>
        <Link href="/acessibilidade">
          <NavItem>Acessibilidade</NavItem>
        </Link>
      </AdminSection>

      {isPasswordModalOpen && (
        <ModalOverlay onClick={() => setIsPasswordModalOpen(false)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h2>Acesso Administrativo</h2>
              <CloseButton onClick={() => setIsPasswordModalOpen(false)}>
                <i className="ti ti-x" />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <form onSubmit={handlePasswordSubmit}>
                <label>
                  Digite a senha de administrador:
                  <PasswordInput 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    autoFocus
                  />
                </label>
                {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
                <SubmitButton type="submit">Entrar</SubmitButton>
              </form>
            </ModalBody>
          </ModalContainer>
        </ModalOverlay>
      )}


    </Header>
  );
};
