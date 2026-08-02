import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import { Cormorant_Garamond, EB_Garamond, DM_Sans } from "next/font/google";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const body = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500"],
});

const ui = DM_Sans({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const viewport: Viewport = {
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "PalabradelDía",
  description: "Comunidad católica para reflexionar y compartir el Evangelio diario.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PalabradelDía",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning className={`${display.variable} ${body.variable} ${ui.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}