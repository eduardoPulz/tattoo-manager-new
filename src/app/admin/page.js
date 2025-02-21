"use client";

import { Navigation } from "../components/navigation/Navigation";
import { TabsSection } from "../components/tabs-section";
import { DashboardContainer } from "./styles";


const AdminDashboard = () => {
  return (
    <DashboardContainer>
      <Navigation />
      <main>
        <TabsSection />
      </main>
    </DashboardContainer>
  );
};

export default AdminDashboard;
