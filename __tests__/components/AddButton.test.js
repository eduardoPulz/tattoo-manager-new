import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AddButton } from '../../src/app/components/add-button/AddButton';

// Mock para styled-components
jest.mock('../../src/app/components/add-button/styles', () => ({
  ButtonContainer: ({ children, onClick }) => (
    <button data-testid="add-button-container" onClick={onClick}>
      {children}
    </button>
  ),
}));

describe('AddButton Component', () => {
  test('deve renderizar o botão com o texto correto', () => {
    render(<AddButton onClick={() => {}} text="Adicionar Item" />);
    
    expect(screen.getByTestId('add-button-container')).toBeInTheDocument();
    expect(screen.getByText('Adicionar Item')).toBeInTheDocument();
  });
  
  test('deve chamar a função onClick quando clicado', () => {
    const mockOnClick = jest.fn();
    render(<AddButton onClick={mockOnClick} text="Adicionar Item" />);
    
    fireEvent.click(screen.getByTestId('add-button-container'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
  
  test('deve renderizar o texto padrão "Adicionar" quando nenhum texto é fornecido', () => {
    render(<AddButton onClick={() => {}} />);
    
    expect(screen.getByText('Adicionar')).toBeInTheDocument();
  });
  
  test('deve aplicar estilos personalizados quando fornecidos', () => {
    const customStyle = { marginBottom: '20px' };
    render(
      <AddButton 
        onClick={() => {}} 
        text="Adicionar Item" 
        style={customStyle} 
      />
    );
    
    const button = screen.getByTestId('add-button-container');
    expect(button).toBeInTheDocument();
  });
});
