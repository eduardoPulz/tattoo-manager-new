"use client";
import * as React from "react";
import { ButtonContainer } from "./styles";

export const AddButton = ({ text = "Adicionar", onClick }) => {
  return (
    <ButtonContainer onClick={onClick}>
      <span>{text}</span>
    </ButtonContainer>
  );
};
