"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { Session, User } from "@supabase/supabase-js";

async function ensureProfile(user: User) {
  const name = user.user_metadata?.name ?? "Usuario";
  const username =
    user.user_metadata?.username ?? user.email?.split("@")[0] ?? "usuario";

  await supabase.from("profiles").upsert(
    {
      id: user.id,
      name,
      username,
      bio: "Aprendiendo a vivir la Palabra del día.",
    },
    { onConflict: "id", ignoreDuplicates: true }
  );
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);

      if (data.session?.user) {
        await ensureProfile(data.session.user);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);

      if (session?.user) {
        await ensureProfile(session.user);
      }
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