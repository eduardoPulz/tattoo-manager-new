import styled from "styled-components";

export const TabsContainer = styled.nav`
  background-color: #fff;
  display: flex;
  padding: 16px 70px;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  
  @media (max-width: 991px) {
    padding-left: 20px;
    padding-right: 20px;
  }
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }
`;

export const TabItem = styled.button`
  font-family: Ubuntu, sans-serif;
  font-size: 14px;
  color: #010000;
  text-transform: uppercase;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  opacity: 0.6;
  transition: opacity 0.2s ease;

  &.active {
    font-weight: bold;
    opacity: 1;
  }

  &:hover {
    opacity: 1;
  }
`;

export const TabContent = styled.div`
  margin-top: 24px;
`;
