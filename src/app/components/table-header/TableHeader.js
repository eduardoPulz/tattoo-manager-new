"use client";

import * as React from "react";
import { HeaderContainer, HeaderRow, HeaderCell } from "./styles";

export const TableHeader = ({ columns = [] }) => {
  return (
    <HeaderContainer>
      <HeaderRow columns={columns.length}>
        {columns.map((column, index) => (
          <HeaderCell key={index}>{column}</HeaderCell>
        ))}
      </HeaderRow>
    </HeaderContainer>
  );
};
