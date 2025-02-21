"use client";

import { Navigation } from "../components/navigation/Navigation";
import { TabsSection } from "../components/tabs-section";
import { AddButton } from "../components/add-button/AddButton";
import { TableHeader } from "../components/table-header/TableHeader";
import { DashboardContainer } from "./styles";


const AdminDashboard = () => {
  return (
    <DashboardContainer>
      <Navigation />
      <main>
        <TabsSection />
        <AddButton />
        <TableHeader />
      </main>
    </DashboardContainer>
  );
};



export default AdminDashboard;
