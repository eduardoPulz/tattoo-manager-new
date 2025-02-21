"use client";
import { DotsContainer, Dot } from "./styles";

export const ImageSlider = ({ totalDots, activeDot }) => {
  return (
    <DotsContainer>
      {Array.from({ length: totalDots }).map((_, index) => (
        <Dot key={index} $active={index === activeDot} />
      ))}
    </DotsContainer>
  );
};
