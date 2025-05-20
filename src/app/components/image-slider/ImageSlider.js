"use client";
import { useState, useEffect } from "react";
import { DotsContainer, Dot } from "./styles";

export const ImageSlider = ({ totalDots, onDotClick, activeDot = 0 }) => {
  const [internalActiveDot, setInternalActiveDot] = useState(activeDot);
  
  useEffect(() => {
    setInternalActiveDot(activeDot);
  }, [activeDot]);

  const handleDotClick = (index) => {
    console.log("Dot clicked:", index);
    setInternalActiveDot(index);
    if (onDotClick) {
      onDotClick(index);
    }
  };

  return (
    <DotsContainer>
      {Array.from({ length: totalDots }).map((_, index) => (
        <Dot 
          key={index} 
          $active={index === internalActiveDot} 
          onClick={() => handleDotClick(index)}
        />
      ))}
    </DotsContainer>
  );
};
