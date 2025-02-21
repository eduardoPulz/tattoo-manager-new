"use client";
import { Header, LogoSection, BrushIcon, StudioName, AdminSection, PersonIcon, AdminText } from "./styles";
import Link from "next/link";

export const Navigation = () => {
  return (
    <Header>
      <LogoSection>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BrushIcon className="ti ti-brush" />
          <StudioName>Tattoo do JayJay</StudioName>
        </Link>
      </LogoSection>
      <AdminSection>
        <PersonIcon className="ti ti-user" />
        <AdminText>
          <Link href="/admin">Admin</Link>
        </AdminText>
      </AdminSection>
    </Header>
  );
};
