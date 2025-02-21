"use client";
import { useState } from "react";
import { TabItem, TabsContainer, TabContent } from "./styles";
import { TableHeader } from "../table-header/TableHeader";
import { AddButton } from "../add-button/AddButton";

const TABS = {
  SCHEDULES: {
    id: "schedules",
    label: "Horários",
    addButtonText: "Adicionar",
    columns: ["Nome", "Horário Início", "Horário Fim", "Serviço", "Profissional", "Ações"]
  },
  EMPLOYEES: {
    id: "employees",
    label: "Funcionários",
    addButtonText: "Adicionar",
    columns: ["Nome", "Especialidade", "Telefone", "Ações"]
  },
  SERVICES: {
    id: "services",
    label: "Serviços",
    addButtonText: "Adicionar",
    columns: ["Descrição", "Tempo gasto", "Preço", "Ações"]
  }
};

export const TabsSection = () => {
  const [activeTab, setActiveTab] = useState(TABS.EMPLOYEES);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <TabsContainer>
        {Object.values(TABS).map((tab) => (
          <TabItem
            key={tab.id}
            onClick={() => handleTabClick(tab)}
            className={activeTab.id === tab.id ? "active" : ""}
          >
            {tab.label}
          </TabItem>
        ))}
      </TabsContainer>

      <AddButton text={activeTab.addButtonText} />

      {activeTab.id === TABS.SCHEDULES.id && (
        <TableHeader columns={TABS.SCHEDULES.columns} />
      )}

      {activeTab.id === TABS.EMPLOYEES.id && (
        <TableHeader columns={TABS.EMPLOYEES.columns} />
      )}

      {activeTab.id === TABS.SERVICES.id && (
        <TableHeader columns={TABS.SERVICES.columns} />
      )}
    </>
  );
};
