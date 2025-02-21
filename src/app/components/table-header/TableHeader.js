"use client";

import * as React from "react";
import styled from "styled-components";

export const TableHeader = () => {
  return (
    <HeaderContainer>
      <HeaderRow>
        <HeaderCell>Nome</HeaderCell>
        <HeaderCell>Especialidade</HeaderCell>
        <HeaderCell>Telefone</HeaderCell>
        <HeaderCell>Ações</HeaderCell>
      </HeaderRow>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.div`
  display: flex;
  margin: 0 11px;
  padding: 17px 70px;
  font-family: Ubuntu, sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #000;
  @media (max-width: 991px) {
    padding-left: 20px;
    padding-right: 20px;
  }
  @media (max-width: 640px) {
    display: none;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 1594px;
`;

const HeaderCell = styled.div`
  flex: 1;
  text-align: left;
`;
