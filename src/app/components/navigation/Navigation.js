"use client";
import { Header, LogoSection, BrushIcon, StudioName, AdminSection, PersonIcon, AdminText } from "./styles";

export const Navigation = () => {
  return (
    <Header>
      <LogoSection>
        <BrushIcon className="ti ti-brush" />
        <StudioName>Tattoo do JayJay</StudioName>
      </LogoSection>
      <AdminSection>
        <PersonIcon className="ti ti-user" />
        <AdminText>
          <a href="/admin">Admin</a>
        </AdminText>
      </AdminSection>
    </Header>
  );
};
