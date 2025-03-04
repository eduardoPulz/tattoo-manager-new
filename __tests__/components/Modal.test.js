import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { Modal } from '../../src/app/components/modal/Modal';

jest.mock('../../src/app/components/modal/styles', () => ({
  ModalOverlay: ({ children, onClick }) => (
    <div data-testid="modal-overlay" onClick={onClick}>
      {children}
    </div>
  ),
  ModalContainer: ({ children, onClick }) => (
    <div data-testid="modal-container" onClick={onClick}>
      {children}
    </div>
  ),
  ModalHeader: ({ children }) => <div data-testid="modal-header">{children}</div>,
  ModalBody: ({ children }) => <div data-testid="modal-body">{children}</div>,
  ModalFooter: ({ children }) => <div data-testid="modal-footer">{children}</div>,
  CloseButton: ({ children, onClick }) => (
    <button data-testid="close-button" onClick={onClick}>
      {children}
    </button>
  ),
}));

describe('Modal Component', () => {
  const mockOnClose = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('deve renderizar corretamente quando aberto', async () => {
    await act(async () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Teste">
          <p>Conteúdo do modal</p>
        </Modal>
      );
    });
    
    expect(screen.getByTestId('modal-overlay')).toBeInTheDocument();
    expect(screen.getByTestId('modal-header')).toBeInTheDocument();
    expect(screen.getByText('Teste')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo do modal')).toBeInTheDocument();
  });
  
  test('deve chamar onClose quando o botão de fechar é clicado', async () => {
    await act(async () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Teste">
          <p>Conteúdo do modal</p>
        </Modal>
      );
    });
    
    await act(async () => {
      fireEvent.click(screen.getByTestId('close-button'));
    });
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
