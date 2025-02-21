"use client";
import { ActiveTabItem, TabItem, TabsContainer } from "./styles";

export const TabsSection = () => {
  return (
    <TabsContainer>
      <TabItem>Horários</TabItem>
      <ActiveTabItem>Funcionários</ActiveTabItem>
      <TabItem>Serviços</TabItem>
    </TabsContainer>
  );
};

