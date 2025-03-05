import styled from "styled-components";

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 70px;
  background-color: rgba(66, 66, 66, 1);
  border-bottom: 1px solid #eee;
  width: 100%;

  @media (max-width: 991px) {
    padding-left: 20px;
    padding-right: 20px;
  }
`;

export const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

export const BrushIcon = styled.i`
  font-size: 24px;
  color: white;
`;

export const StudioName = styled.span`
  font-family: Ubuntu, sans-serif;
  font-size: 24px;
  color: white;
  font-weight: 500;
`;

export const AdminSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

export const PersonIcon = styled.i`
  font-size: 24px;
  color: white;
`;

export const AdminText = styled.div`
  font-weight: 500;
  margin-left: 8px;
  color: white;
  
  a {
    color: inherit;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const NavItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0 15px;
  font-weight: 500;
  color: white;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
  
  @media (max-width: 768px) {
    padding: 0 8px;
    font-size: 0.9rem;
  }
`;