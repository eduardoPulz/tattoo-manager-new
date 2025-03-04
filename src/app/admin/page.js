"use client";

import { useSearchParams } from "next/navigation";
import { Navigation } from "../components/navigation/Navigation";
import { TabsSection } from "../components/tabs-section";
import { DashboardContainer } from "./styles";

const AdminDashboard = () => {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "employees";

  return (
    <DashboardContainer>
      <Navigation />
      <main>
        <TabsSection initialTab={initialTab} />
      </main>
    </DashboardContainer>
  );
};

export default AdminDashboard;
