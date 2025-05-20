"use client";
import styled, { css } from 'styled-components';

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  font-family: var(--font-poppins), 'Segoe UI', sans-serif;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

const inputStyles = css`
  background-color: white;
  padding: 12px 14px;
  color: #333;
  border-radius: 6px;
  border: 1px solid ${props => props['data-error'] ? '#e53935' : '#ddd'};
  font-size: 0.95rem;
  transition: all 0.3s ease;
  outline: none;
  width: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  
  &:focus {
    border-color: ${props => props['data-error'] ? '#e53935' : 'var(--primary)'};
    box-shadow: 0 0 0 3px ${props => props['data-error'] ? 'rgba(229, 57, 53, 0.2)' : 'rgba(255, 77, 77, 0.2)'};
  }
  
  &::placeholder {
    color: #aaa;
  }
`;

export const Input = styled.input`
  ${inputStyles}
`;

export const DateTimeInput = styled.input`
  ${inputStyles}
  
  /* Fix para o botão de calendário */
  &::-webkit-calendar-picker-indicator {
    background-color: rgba(0, 0, 0, 0.1);
    padding: 5px;
    border-radius: 3px;
    cursor: pointer;
    margin-right: 2px;
  }
  
  &::-webkit-calendar-picker-indicator:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

export const Select = styled.select`
  ${inputStyles}
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 40px;
  cursor: pointer;
`;

export const Textarea = styled.textarea`
  ${inputStyles}
  min-height: 100px;
  resize: vertical;
  margin-top: 4px;
`;

export const ErrorMessage = styled.div`
  color: #e53935;
  font-size: 0.75rem;
  margin-top: 4px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 20px;
`;

export const Button = styled.button`
  background-color: ${props => props.secondary ? '#f3f4f6' : 'var(--primary)'};
  color: ${props => props.secondary ? '#333' : 'white'};
  border: none;
  border-radius: 6px;
  padding: 12px 20px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: ${props => props.secondary ? '#e5e7eb' : 'var(--primary-dark)'};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    background-color: #d1d5db;
    color: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;
