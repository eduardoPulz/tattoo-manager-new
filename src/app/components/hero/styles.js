import styled from "styled-components";

export const MainHeading = styled.h2`
  color: black;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
  font-size: 44px;
  font-weight: normal;
  text-align: center;
  margin: 35px 0 18px 0;
  width: 100%;

  @media (max-width: 640px) {
    font-size: 32px;
  }
`;

export const HeroSection = styled.div`
  position: relative;
  width: 1280px;
  max-width: 100%;
  height: 650px;
  margin: 0 auto;
  overflow: hidden;

  @media (max-width: 640px) {
    height: 400px;
    width: 100%;
  }
`;

export const SlideContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  transition: transform 0.8s ease-in-out;
  transform: translateX(${props => props.$offset}px);
`;

export const Slide = styled.div`
  min-width: 100%;
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0,0,0,0) 70%, rgba(0,0,0,0.5) 100%);
    pointer-events: none;
  }
`;

export const HeroImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
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