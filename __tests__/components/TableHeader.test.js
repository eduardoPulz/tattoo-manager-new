import React from 'react';
import { render, screen } from '@testing-library/react';
import { TableHeader } from '../../src/app/components/table-header/TableHeader';

// Mock para styled-components
jest.mock('../../src/app/components/table-header/styles', () => ({
  HeaderContainer: ({ children }) => <thead data-testid="header-container">{children}</thead>,
  HeaderRow: ({ children }) => <tr data-testid="header-row">{children}</tr>,
  HeaderCell: ({ children }) => <th data-testid="header-cell">{children}</th>,
}));

describe('TableHeader Component', () => {
  test('deve renderizar as células de cabeçalho com os rótulos corretos', () => {
    const mockColumns = [
      'Nome',
      'Especialidade',
      'Telefone',
    ];
    
    render(<TableHeader columns={mockColumns} />);
    
    expect(screen.getByTestId('header-container')).toBeInTheDocument();
    expect(screen.getByTestId('header-row')).toBeInTheDocument();
    expect(screen.getAllByTestId('header-cell')).toHaveLength(3);
    expect(screen.getByText('Nome')).toBeInTheDocument();
    expect(screen.getByText('Especialidade')).toBeInTheDocument();
    expect(screen.getByText('Telefone')).toBeInTheDocument();
  });
  
  test('deve renderizar corretamente com uma única coluna', () => {
    const mockColumns = [
      'Nome',
    ];
    
    render(<TableHeader columns={mockColumns} />);
    
    expect(screen.getByTestId('header-container')).toBeInTheDocument();
    expect(screen.getByTestId('header-row')).toBeInTheDocument();
    expect(screen.getAllByTestId('header-cell')).toHaveLength(1);
    expect(screen.getByText('Nome')).toBeInTheDocument();
  });
  
  test('deve renderizar corretamente quando não há colunas', () => {
    render(<TableHeader columns={[]} />);
    
    expect(screen.getByTestId('header-container')).toBeInTheDocument();
    expect(screen.getByTestId('header-row')).toBeInTheDocument();
    expect(screen.queryAllByTestId('header-cell')).toHaveLength(0);
  });
  
  test('deve renderizar corretamente com colunas personalizadas', () => {
    const mockColumns = [
      'Data',
      'Hora',
      'Cliente',
      'Status',
    ];
    
    render(<TableHeader columns={mockColumns} />);
    
    expect(screen.getAllByTestId('header-cell')).toHaveLength(4);
    expect(screen.getByText('Data')).toBeInTheDocument();
    expect(screen.getByText('Hora')).toBeInTheDocument();
    expect(screen.getByText('Cliente')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });
});
