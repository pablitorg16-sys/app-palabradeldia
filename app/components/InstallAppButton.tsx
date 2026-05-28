"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

type InstallTheme = {
  card: string;
  innerCard: string;
  button: string;
  accentText: string;
  primaryText: string;
  bodyText: string;
  mutedText: string;
};

type InstallAppButtonProps = {
  theme: InstallTheme;
};

export default function InstallAppButton({ theme }: InstallAppButtonProps) {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [message, setMessage] = useState(
    "En Android, abre esta app en Chrome y usa el botón cuando el navegador permita instalarla."
  );

  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setMessage("La app ya está lista para instalarse en este dispositivo.");
    }

    function handleInstalled() {
      setDeferredPrompt(null);
      setMessage("PalabradelDía ya está instalada en este dispositivo.");
    }

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  async function installAndroid() {
    if (!deferredPrompt) {
      setMessage(
        "Chrome todavía no ofrece la instalación. Comprueba que estás en Android/Chrome, que la página está servida por HTTPS o localhost y prueba desde el menú ⋮ → Instalar aplicación."
      );
      return;
    }

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setDeferredPrompt(null);

    setMessage(
      choice.outcome === "accepted"
        ? "Instalación iniciada."
        : "Instalación cancelada. También puedes usar Chrome → menú ⋮ → Instalar aplicación."
    );
  }

  return (
    <section className={`w-full rounded-3xl border p-4 shadow-sm backdrop-blur sm:hidden ${theme.card}`}>
      <p className={`mb-3 text-sm font-semibold uppercase tracking-[0.2em] ${theme.accentText}`}>
        Instalar aplicación
      </p>

      <div className="grid grid-cols-1 gap-3">
        <button
          onClick={installAndroid}
          className={`w-full rounded-2xl px-5 py-3 text-sm font-semibold transition ${theme.button}`}
        >
          Instalar en Android
        </button>

        <div className={`rounded-2xl border px-5 py-3 text-sm leading-6 ${theme.innerCard} ${theme.primaryText}`}>
          <p>{message}</p>

          <p className="mt-3 font-semibold">En iPhone</p>

          <p className={`mt-1 text-xs ${theme.mutedText}`}>
            Safari → Compartir → Añadir a pantalla de inicio
          </p>
        </div>
      </div>
    </section>
  );
}
