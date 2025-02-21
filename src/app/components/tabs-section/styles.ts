import styled from "styled-components";

export const TabsContainer = styled.nav`
  background-color: #fff;
  display: flex;
  padding: 16px 70px;
  justify-content: space-between;
  align-items: center;
  margin: 0 11px;
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
`;

export const ActiveTabItem = styled(TabItem)`
  font-weight: bold;
`;
