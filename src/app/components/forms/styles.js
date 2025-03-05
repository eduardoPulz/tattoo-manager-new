"use client";
import styled, { css } from 'styled-components';

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #333;
`;

const inputStyles = css`
  background-color: white;
  padding: 10px 12px;
  color: #333;
  border-radius: 6px;
  border: 1px solid ${props => props['data-error'] ? '#e53935' : '#ddd'};
  font-size: 0.875rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
  width: 100%;
  
  &:focus {
    border-color: ${props => props['data-error'] ? '#e53935' : '#6366f1'};
    box-shadow: 0 0 0 2px ${props => props['data-error'] ? 'rgba(229, 57, 53, 0.2)' : 'rgba(99, 102, 241, 0.2)'};
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
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 40px;
`;

export const Textarea = styled.textarea`
  ${inputStyles}
  min-height: 100px;
  resize: vertical;
`;

export const ErrorMessage = styled.div`
  color: #e53935;
  font-size: 0.75rem;
  margin-top: 4px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
`;

export const Button = styled.button`
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  ${props => props.variant === 'secondary' 
    ? css`
        background-color: #f5f5f5;
        color: #333;
        border: 1px solid #ddd;
        
        &:hover:not(:disabled) {
          background-color: #e0e0e0;
        }
      `
    : css`
        background-color: #6366f1;
        color: white;
        border: none;
        
        &:hover:not(:disabled) {
          background-color: #4f46e5;
        }
      `
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
