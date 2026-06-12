"use client";

import { useEffect, useState } from "react";
import { getThemeClasses } from "../utils/theme";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isStandaloneMode() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (navigator as any).standalone === true
  );
}

export default function InstallAppButton() {
  const theme = getThemeClasses();
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (isStandaloneMode()) {
      setIsStandalone(true);
      return;
    }

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    }
    function handleInstalled() {
      setDeferredPrompt(null);
      setInstalled(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  if (isStandalone || installed) return null;

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    if (outcome === "accepted") setInstalled(true);
  }

  return (
    <section
      className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 shadow-sm backdrop-blur sm:hidden ${theme.card}`}
    >
      <span className="text-xl">📲</span>
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-semibold ${theme.primaryText}`}>
          Instalar PalabradelDía
        </p>
        <p className={`truncate text-xs ${theme.mutedText}`}>
          {deferredPrompt ? "Lista para instalar" : "Safari → Compartir → Añadir a inicio"}
        </p>
      </div>
      {deferredPrompt && (
        <button
          onClick={handleInstall}
          className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold transition active:scale-95 ${theme.button}`}
        >
          Instalar
        </button>
      )}
    </section>
  );
}