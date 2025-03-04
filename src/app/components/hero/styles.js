import styled from "styled-components";

export const MainHeading = styled.h2`
  color: black;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
  font-size: 44px;
  font-weight: normal;
  text-align: center;
  margin: 35px 0 18px 0;

  @media (max-width: 640px) {
    font-size: 32px;
  }
`;

export const HeroSection = styled.div`
  position: relative;
  width: 100%;
  max-width: 1280px;
  height: 650px;

  @media (max-width: 640px) {
    height: 400px;
  }
`;

export const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const OverlayContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
`;

export const AgendarButton = styled.button`
  background-color: #ff4d4d;
  color: white;
  font-size: 18px;
  font-weight: bold;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ff3333;
  }

  @media (max-width: 640px) {
    font-size: 16px;
    padding: 10px 20px;
  }
`;