import styled from "styled-components";

export const Header = styled.header`
  background-color: rgba(66, 66, 66, 1);
  width: 100%;
  padding: 14px 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.14);

  @media (max-width: 991px) {
    padding: 14px 40px;
  }

  @media (max-width: 640px) {
    padding: 14px 20px;
  }
`;

export const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  color: #fff;
`;

export const BrushIcon = styled.i`
  font-size: 24px;
`;

export const StudioName = styled.h1`
  text-align: center;
  font-weight: normal;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
  font-size: 32px;
  color: #fff;
  margin: 0;

  @media (max-width: 640px) {
    font-size: 24px;
  }
`;

export const AdminSection = styled.div`
  display: flex;
  align-items: center;
  gap: 23px;
  color: #fff;

  @media (max-width: 640px) {
    display: none;
  }
`;

export const PersonIcon = styled.i`
  font-size: 24px;
`;

export const AdminText = styled.span`
  font-family: "Ubuntu", sans-serif;
  font-size: 15px;
`;