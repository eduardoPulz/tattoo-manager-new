"use client";

import * as React from "react";
import styled from "styled-components";

export const AddButton = () => {
  return (
    <ButtonContainer>
      <i className="ti ti-user-plus" />
    </ButtonContainer>
  );
};

const ButtonContainer = styled.button`
  background-color: rgba(66, 66, 66, 1);
  color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.14);
  margin: 0 11px;
  padding: 12px 70px;
  text-align: center;
  font-size: 20px;
  border: none;
  cursor: pointer;
  width: 100%;
  @media (max-width: 991px) {
    padding-left: 20px;
    padding-right: 20px;
  }
`;
