"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type AuthMode = "signup" | "login";

type AuthModalProps = {
  mode: AuthMode;
  theme: {
    card: string;
    button: string;
    accentText: string;
    primaryText: string;
    bodyText: string;
  };
  onModeChange: (mode: AuthMode) => void;
  onClose: () => void;
};

export default function AuthModal({
  mode,
  theme,
  onModeChange,
  onClose,
}: AuthModalProps) {
  const isSignup = mode === "signup";
  const title = isSignup ? "Crear cuenta" : "Iniciar sesión";

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [authMessage, setAuthMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  function normalizeUsername(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9._]/g, "");
  }

  async function usernameExists(cleanUsername: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", cleanUsername)
      .maybeSingle();

    if (error) {
      setAuthMessage(error.message);
      return true;
    }

    return !!data;
  }

  async function handleSubmit() {
    setAuthMessage("");

    const cleanName = name.trim();
    const cleanUsername = normalizeUsername(username);

    if (isSignup && (!cleanName || !cleanUsername)) {
      setAuthMessage("Introduce nombre y usuario.");
      return;
    }

    if (!email.trim() || !password.trim()) {
      setAuthMessage("Introduce email y contraseña.");
      return;
    }

    if (isSignup && cleanUsername.length < 3) {
      setAuthMessage("El usuario debe tener al menos 3 caracteres.");
      return;
    }

    setIsLoading(true);

    if (isSignup) {
      const exists = await usernameExists(cleanUsername);

      if (exists) {
        setIsLoading(false);
        setAuthMessage("Ese usuario ya está en uso.");
        return;
      }
    }

    const result = isSignup
      ? await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: cleanName,
              username: cleanUsername,
            },
          },
        })
      : await supabase.auth.signInWithPassword({
          email,
          password,
        });

    setIsLoading(false);

    if (result.error) {
      setAuthMessage(result.error.message);
      return;
    }

    if (isSignup) {
      setAuthMessage(
        "Cuenta creada. Revisa tu email para confirmar el registro."
      );
      return;
    }

    onClose();
  }
  async function handleGoogleAuth() {
  setAuthMessage("");

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin,
    },
  });

  if (error) {
    setAuthMessage(error.message);
  }
}

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/50 px-4 backdrop-blur-sm"
    >
      <section
        onClick={(event) => event.stopPropagation()}
        className={`w-full max-w-md rounded-3xl border p-6 shadow-2xl ${theme.card}`}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p
              className={`mb-2 text-sm font-semibold uppercase tracking-[0.25em] ${theme.accentText}`}
            >
              PalabradelDía
            </p>

            <h2 className={`text-2xl font-bold ${theme.primaryText}`}>
              {title}
            </h2>

            <p className={`mt-2 leading-7 ${theme.bodyText}`}>
              {isSignup
                ? "Crea una cuenta para sincronizar tu diario y participar en comunidad."
                : "Accede a tu cuenta para recuperar tu diario y tus reflexiones."}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-white/70 px-3 py-1 text-sm font-bold text-[#26351f] hover:bg-white"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <button
  onClick={handleGoogleAuth}
  className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#5f6f52]/25 bg-white/80 px-5 py-3 text-sm font-semibold text-[#26351f] transition hover:bg-white"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    className="h-5 w-5"
  >
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303C33.659 32.657 29.262 36 24 36c-6.627 0-12-5.373-12-12S17.373 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.27 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 16.108 18.961 13 24 13c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.27 4 24 4c-7.682 0-14.347 4.337-17.694 10.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.238 0-9.617-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.084 5.571h.003l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
    />
  </svg>

  Continuar con Google
</button>

        </div>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#5f6f52]/25" />
          <span
            className={`text-xs font-semibold uppercase tracking-[0.2em] ${theme.accentText}`}
          >
            o
          </span>
          <div className="h-px flex-1 bg-[#5f6f52]/25" />
        </div>

        <div className="space-y-3">
          {isSignup && (
            <>
              <input
                type="text"
                placeholder="Nombre visible"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-xl border border-[#5f6f52]/25 bg-white/85 px-4 py-3 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-[#26351f]"
              />

              <input
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(event) =>
                  setUsername(normalizeUsername(event.target.value))
                }
                className="w-full rounded-xl border border-[#5f6f52]/25 bg-white/85 px-4 py-3 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-[#26351f]"
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-[#5f6f52]/25 bg-white/85 px-4 py-3 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-[#26351f]"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-[#5f6f52]/25 bg-white/85 px-4 py-3 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-[#26351f]"
          />

          {authMessage && (
            <p className={`rounded-xl bg-white/60 p-3 text-sm ${theme.bodyText}`}>
              {authMessage}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full rounded-xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${theme.button}`}
          >
            {isLoading ? "Procesando..." : title}
          </button>
        </div>

        <div className={`mt-5 text-center text-sm ${theme.bodyText}`}>
          {isSignup ? (
            <p>
              ¿Ya tienes cuenta?{" "}
              <button
                onClick={() => onModeChange("login")}
                className={`font-semibold ${theme.primaryText}`}
              >
                Inicia sesión
              </button>
            </p>
          ) : (
            <p>
              ¿No tienes cuenta?{" "}
              <button
                onClick={() => onModeChange("signup")}
                className={`font-semibold ${theme.primaryText}`}
              >
                Crea una cuenta
              </button>
            </p>
          )}
        </div>
      </section>
    </div>
  );
}