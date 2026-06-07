import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";

export const metadata: Metadata = {
  title: "PalabradelDía",
  description: "Comunidad católica para reflexionar y compartir el Evangelio diario.",
};

const themeScript = `
  (function() {
    try {
      var pref = localStorage.getItem('palabradeldia_theme_preference');
      var validPrefs = ['sunrise', 'day', 'sunset', 'night'];
      if (pref && validPrefs.includes(pref)) {
        document.documentElement.setAttribute('data-theme', pref);
        return;
      }
      var hour = new Date().getHours();
      var theme = 'day';
      if (hour >= 6  && hour < 9)  theme = 'sunrise';
      if (hour >= 18 && hour < 21) theme = 'sunset';
      if (hour >= 21 || hour < 6)  theme = 'night';
      document.documentElement.setAttribute('data-theme', theme);
    } catch(e) {}
  })();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}