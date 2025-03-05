import styled from "styled-components";

export const SliderContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  border-radius: 8px;
`;

export const SlideImage = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  transition: opacity 0.5s ease-in-out;
`;

export const DotsContainer = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 16px;
`;

export const Dot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: white;
  opacity: ${(props) => (props.$active ? 1 : 0.5)};
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
    transform: scale(1.1);
  }
`;