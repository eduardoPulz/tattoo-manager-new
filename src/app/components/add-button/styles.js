import styled from "styled-components";

export const ButtonContainer = styled.button`
  background-color: rgba(66, 66, 66, 1);
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: Ubuntu, sans-serif;
  font-size: 14px;
  transition: background-color 0.2s ease;
  width: 100%;
  padding: 16px;
  margin: 0;

  &:hover {
    background-color: rgba(45, 45, 45, 1);
  }

  i {
    font-size: 16px;
  }
`;
