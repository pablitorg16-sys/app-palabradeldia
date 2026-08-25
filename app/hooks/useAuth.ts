"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { Session, User } from "@supabase/supabase-js";

async function ensureProfile(user: User) {
  const name = user.user_metadata?.name ?? "Usuario";
  const username =
    user.user_metadata?.username ?? user.email?.split("@")[0] ?? "usuario";

  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      name,
      username,
      bio: "Aprendiendo a vivir la Palabra del día.",
    },
    { onConflict: "id", ignoreDuplicates: true }
  );

  if (error) throw error;
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const ensuredUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      if (!session?.user) {
        ensuredUserIdRef.current = null;
        return;
      }

      if (ensuredUserIdRef.current === session.user.id) return;
      ensuredUserIdRef.current = session.user.id;

      // Debe ejecutarse fuera del callback de Auth. Hacer otra consulta de
      // Supabase dentro de onAuthStateChange puede bloquear el cliente entero.
      window.setTimeout(() => {
        void ensureProfile(session.user).catch((error) => {
          ensuredUserIdRef.current = null;
          console.error("Error ensuring profile:", error);
        });
      }, 0);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
  }

  return {
    session,
    user: session?.user ?? null,
    isAuthenticated: !!session,
    signOut,
  };
}
