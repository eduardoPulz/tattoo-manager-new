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
  margin-top: 36px;
`;

export const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: white;
  opacity: ${(props) => (props.$active ? 1 : 0.5)};
  transition: opacity 0.2s ease;
`;