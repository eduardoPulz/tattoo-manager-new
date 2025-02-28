"use client";

import * as React from "react";
import { RowContainer, RowCell, ActionButton, ActionContainer } from "./styles";

export const TableRow = ({ data, columns, onEdit, onDelete }) => {
  return (
    <RowContainer columns={columns.length}>
      {data.map((cell, index) => (
        <RowCell key={index}>{cell}</RowCell>
      ))}
      <ActionContainer>
        {onEdit && (
          <ActionButton onClick={onEdit} type="edit">
            Editar
          </ActionButton>
        )}
        {onDelete && (
          <ActionButton onClick={onDelete} type="delete">
            Excluir
          </ActionButton>
        )}
      </ActionContainer>
    </RowContainer>
  );
};
