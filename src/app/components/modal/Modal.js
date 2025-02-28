"use client";
import React, { useEffect } from 'react';
import { ModalOverlay, ModalContainer, ModalHeader, ModalBody, ModalFooter, CloseButton } from './styles';

export const Modal = ({ isOpen, onClose, title, children, footer }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={handleModalClick}>
        <ModalHeader>
          <h2>{title}</h2>
          <CloseButton onClick={onClose}>
            <i className="ti ti-x" />
          </CloseButton>
        </ModalHeader>
        <ModalBody>
          {children}
        </ModalBody>
        {footer && (
          <ModalFooter>
            {footer}
          </ModalFooter>
        )}
      </ModalContainer>
    </ModalOverlay>
  );
};
