"use client";
import * as React from "react";
import { ButtonContainer } from "./styles";

export const AddButton = ({ text = "Adicionar" }) => {
  return (
    <ButtonContainer>
      <i className="ti ti-plus" />
      <span>{text}</span>
    </ButtonContainer>
  );
};
