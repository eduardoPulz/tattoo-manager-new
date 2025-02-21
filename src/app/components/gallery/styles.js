import styled from "styled-components";

export const GalleryGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  max-width: 1280px;
  padding: 20px 0;

  @media (max-width: 991px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

export const GalleryImage = styled.img`
  width: 100%;
  aspect-ratio: 1.07;
  object-fit: cover;
  border-radius: 4px;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.02);
  }
`;
