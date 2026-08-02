"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import { getThemeClasses } from "../utils/theme";

type LinkState = "checking" | "valid" | "invalid";

export default function NuevaContrasenaPage() {
  const theme = getThemeClasses();
  const router = useRouter();

  const [linkState, setLinkState] = useState<LinkState>("checking");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setLinkState("valid");
      }
    });

    // Si al cargar la página ya hay una sesión de recuperación activa
    // (el evento puede haberse disparado antes de montar el listener).
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setLinkState((current) => (current === "checking" ? "valid" : current));
      } else {
        setLinkState((current) => (current === "checking" ? "invalid" : current));
      }
    });

    const timeout = window.setTimeout(() => {
      setLinkState((current) => (current === "checking" ? "invalid" : current));
    }, 4000);

    return () => {
      listener.subscription.unsubscribe();
      window.clearTimeout(timeout);
    };
  }, []);

  async function handleSubmit() {
    setErrorMessage("");

    if (password.length < 6) {
      setErrorMessage("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setSuccess(true);
    window.setTimeout(() => {
      router.push("/");
    }, 2000);
  }

  return (
    <main className={`min-h-screen px-4 py-12 sm:px-6 sm:py-16 ${theme.page}`}>
      <article className="mx-auto max-w-md">
        <header className="mb-10">
          <a
            href="/"
            className={`mb-8 inline-block text-sm font-semibold transition hover:opacity-70 ${theme.accentText}`}
          >
            ← Volver a la app
          </a>
          <h1
            className={`mt-6 text-3xl font-medium italic sm:text-4xl ${theme.primaryText}`}
            style={{ fontFamily: "var(--font-display, Georgia, serif)" }}
          >
            Nueva contraseña
          </h1>
        </header>

        {linkState === "checking" && (
          <div className={`rounded-2xl border p-5 text-sm ${theme.innerCard} ${theme.bodyText}`}>
            Comprobando tu enlace de recuperación...
          </div>
        )}

        {linkState === "invalid" && (
          <div className={`space-y-4 rounded-2xl border p-5 ${theme.innerCard}`}>
            <p className={`text-sm leading-relaxed ${theme.bodyText}`}>
              Este enlace de recuperación no es válido o ha caducado. Los enlaces de recuperación
              solo funcionan una vez y expiran pasado un tiempo.
            </p>
            <a
              href="/"
              className={`inline-block text-sm font-semibold transition hover:opacity-70 ${theme.accentText}`}
            >
              Volver a la app y solicitar uno nuevo →
            </a>
          </div>
        )}

        {linkState === "valid" && !success && (
          <div className="space-y-3">
            <p className={`mb-2 text-sm leading-relaxed ${theme.bodyText}`}>
              Escribe tu nueva contraseña. Debe tener al menos 6 caracteres.
            </p>
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[#5f6f52]/25 bg-white/85 px-4 py-3 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-[#26351f]"
            />
            <input
              type="password"
              placeholder="Repite la contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-[#5f6f52]/25 bg-white/85 px-4 py-3 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-[#26351f]"
            />
            {errorMessage && (
              <p className={`rounded-xl bg-white/60 p-3 text-sm ${theme.bodyText}`}>{errorMessage}</p>
            )}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full rounded-xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${theme.button}`}
            >
              {isLoading ? "Guardando..." : "Guardar nueva contraseña"}
            </button>
          </div>
        )}

        {success && (
          <div className={`rounded-2xl border p-5 text-sm leading-relaxed ${theme.innerCard} ${theme.bodyText}`}>
            Tu contraseña se ha actualizado correctamente. Te llevamos a la app...
          </div>
        )}
      </article>
    </main>
  );
}
