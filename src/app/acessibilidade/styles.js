import styled from 'styled-components';

export const AccessibilityContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f7f9fc;
`;

export const AccessibilityContent = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const AccessibilityHeader = styled.h1`
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
`;

export const SectionTitle = styled.h2`
  color: #333;
  margin: 1.5rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
`;

export const OptionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

export const OptionTitle = styled.h3`
  color: #333;
  margin: 0 0 0.5rem;
`;

export const OptionDescription = styled.p`
  color: #666;
  margin: 0;
  max-width: 400px;
`;

export const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
    
    &:checked + span {
      background-color: #6366f1;
    }
    
    &:checked + span:before {
      transform: translateX(26px);
    }
    
    &:focus + span {
      box-shadow: 0 0 1px #6366f1;
    }
  }
`;

export const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
  
  &:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
`;

export const ResetButton = styled.button`
  display: block;
  margin: 2rem auto;
  padding: 0.75rem 1.5rem;
  background-color: #e53e3e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #c53030;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.5);
  }
`;
