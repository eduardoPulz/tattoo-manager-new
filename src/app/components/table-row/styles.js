import styled from "styled-components";

export const RowContainer = styled.div`
  display: grid;
  grid-template-columns: ${props => `repeat(${props.columns - 1}, 1fr) 120px`};
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
  gap: 16px;
  align-items: center;
  
  &:hover {
    background-color: #f9f9f9;
  }
`;

export const RowCell = styled.div`
  font-family: Ubuntu, sans-serif;
  font-size: 14px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ActionContainer = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

export const ActionButton = styled.button`
  background-color: ${props => props.type === 'edit' ? '#4CAF50' : '#f44336'};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${props => props.type === 'edit' ? '#3e8e41' : '#d32f2f'};
  }
`;
