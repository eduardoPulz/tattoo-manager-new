import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import StyledComponentsRegistry from './registry'
import { AccessibilityProvider } from './contexts/AccessibilityContext';

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Tattoo Manager",
  description: "Sistema de gerenciamento para estúdio de tatuagem",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;700&display=swap"
          rel="stylesheet"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.variable} ${robotoMono.variable}`}>
        <AccessibilityProvider>
          <StyledComponentsRegistry>
            {children}
          </StyledComponentsRegistry>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
