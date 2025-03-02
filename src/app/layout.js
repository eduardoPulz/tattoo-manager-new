import "./globals.css";

export const metadata = {
  title: "Tattoo Manager",
  description: "Sistema de gerenciamento para estúdio de tatuagem",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}
