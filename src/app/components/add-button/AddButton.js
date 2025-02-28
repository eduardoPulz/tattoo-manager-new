"use client";
import * as React from "react";
import { ButtonContainer } from "./styles";

export const AddButton = ({ text = "Adicionar", onClick }) => {
  return (
    <ButtonContainer onClick={onClick}>
      <i className="ti ti-plus" />
      <span>{text}</span>
    </ButtonContainer>
  );
};
