"use client";

import { getThemeClasses } from "../utils/theme";

type AuthRequiredCardProps = {
  onOpenAuth: (mode: "signup" | "login") => void;
};

export default function AuthRequiredCard({ onOpenAuth }: AuthRequiredCardProps) {
  const theme = getThemeClasses();

  return (
    <section className={`rounded-[var(--radius-card)] border p-8 shadow-sm ${theme.card}`}>
      <p className={`mb-3 text-sm font-semibold uppercase tracking-[0.1em] ${theme.accentText}`}>
        Comunidad
      </p>
      <h2 className={`text-2xl font-bold ${theme.primaryText}`}>
        Crea una cuenta para participar
      </h2>
      <p className={`mt-4 max-w-xl leading-7 ${theme.bodyText}`}>
        Puedes leer el Evangelio y escribir tu diario en modo local, pero para
        compartir reflexiones, dar likes y guardar publicaciones de otros
        necesitas iniciar sesión.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={() => onOpenAuth("signup")}
          className={`rounded-xl px-6 py-3 text-sm font-semibold transition ${theme.button}`}
        >
          Crear cuenta
        </button>
        <button
          onClick={() => onOpenAuth("login")}
          className="rounded-xl border border-[#5f6f52]/30 bg-white/70 px-6 py-3 text-sm font-semibold text-[#26351f] transition hover:bg-white"
        >
          Iniciar sesión
        </button>
      </div>
    </section>
  );
}
