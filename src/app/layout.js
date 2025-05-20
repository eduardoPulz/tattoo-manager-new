import { Inter, Roboto_Mono } from "next/font/google";
import { Poppins } from "next/font/google";
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

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
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
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} ${robotoMono.variable} ${poppins.variable}`}>
        <AccessibilityProvider>
          <StyledComponentsRegistry>
            {children}
          </StyledComponentsRegistry>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
