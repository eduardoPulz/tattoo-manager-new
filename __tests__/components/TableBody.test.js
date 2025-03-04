import React from 'react';
import { render, screen } from '@testing-library/react';
import { TableBody } from '../../src/app/components/table-body/TableBody';

// Mock para o componente TableRow
jest.mock('../../src/app/components/table-row/TableRow', () => ({
  TableRow: ({ data, columns, onEdit, onDelete }) => (
    <tr data-testid="mocked-table-row">
      <td>{data.id}</td>
      {columns.map((col, index) => (
        <td key={index}>{data[col]}</td>
      ))}
      <td>
        <button onClick={() => onEdit()}>Edit</button>
        <button onClick={() => onDelete()}>Delete</button>
      </td>
    </tr>
  ),
}));

// Mock para styled-components
jest.mock('../../src/app/components/table-body/styles', () => ({
  BodyContainer: ({ children }) => <tbody data-testid="body-container">{children}</tbody>,
}));

describe('TableBody Component', () => {
  const mockColumns = [
    'nome',
    'especialidade',
    'telefone',
  ];
  
  const mockItems = [
    {
      id: '1',
      nome: 'João Silva',
      especialidade: 'Tatuador',
      telefone: '(11) 98765-4321',
    },
    {
      id: '2',
      nome: 'Maria Oliveira',
      especialidade: 'Piercer',
      telefone: '(11) 12345-6789',
    },
  ];
  
  const mockFormatRow = (item) => ({
    id: item.id,
    nome: item.nome,
    especialidade: item.especialidade,
    telefone: item.telefone,
  });
  
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('deve renderizar linhas para cada item de dados', () => {
    render(
      <TableBody 
        items={mockItems} 
        columns={mockColumns} 
        formatRow={mockFormatRow}
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );
    
    expect(screen.getByTestId('body-container')).toBeInTheDocument();
    expect(screen.getAllByTestId('mocked-table-row')).toHaveLength(2);
  });
  
  test('deve renderizar mensagem vazia quando não há dados', () => {
    render(
      <TableBody 
        items={[]} 
        columns={mockColumns} 
        formatRow={mockFormatRow}
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );
    
    expect(screen.getByTestId('body-container')).toBeInTheDocument();
    expect(screen.queryByTestId('mocked-table-row')).not.toBeInTheDocument();
    expect(screen.getByText('Nenhum item encontrado')).toBeInTheDocument();
  });
  
  test('deve lidar com dados undefined ou null', () => {
    render(
      <TableBody 
        items={null} 
        columns={mockColumns} 
        formatRow={mockFormatRow}
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );
    
    expect(screen.getByTestId('body-container')).toBeInTheDocument();
    expect(screen.queryByTestId('mocked-table-row')).not.toBeInTheDocument();
    expect(screen.getByText('Nenhum item encontrado')).toBeInTheDocument();
  });
});
