"use client";

import * as React from "react";
import { BodyContainer } from "./styles";
import { TableRow } from "../table-row/TableRow";

export const TableBody = ({ items, columns, formatRow, onEdit, onDelete }) => {
  if (!items || items.length === 0) {
    return (
      <BodyContainer>
        <p className="empty-message">Nenhum item encontrado</p>
      </BodyContainer>
    );
  }

  return (
    <BodyContainer>
      {items.map((item) => (
        <TableRow
          key={item.id}
          data={formatRow(item)}
          columns={columns}
          onEdit={() => onEdit && onEdit(item)}
          onDelete={() => onDelete && onDelete(item)}
        />
      ))}
    </BodyContainer>
  );
};
