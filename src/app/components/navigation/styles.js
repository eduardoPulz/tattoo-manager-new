import styled from "styled-components";

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 70px;
  background-color: #2d2d2d;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.3s ease;

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
  font-size: 28px;
  color: var(--primary);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

export const StudioName = styled.span`
  font-family: var(--font-poppins), 'Segoe UI', sans-serif;
  font-size: 24px;
  color: white;
  font-weight: 700;
  letter-spacing: 0.5px;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--primary);
  }
`;

export const AdminSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const PersonIcon = styled.i`
  font-size: 24px;
  color: var(--primary);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

export const AdminText = styled.div`
  font-weight: 600;
  margin-left: 8px;
  transition: all 0.3s ease;
  
  a {
    color: white;
    transition: color 0.3s ease;
    padding: 5px 10px;
    border-radius: 4px;
    
    &:hover {
      color: var(--primary);
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
`;

export const NavItem = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 15px;
  font-weight: 500;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--primary);
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 5px 8px;
    font-size: 0.9rem;
  }
`;