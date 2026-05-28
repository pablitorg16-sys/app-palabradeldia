"use client";

import { useCallback, useEffect, useState } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { User } from "../types";
import { supabase } from "../lib/supabaseClient";
import { getAppUserFromSupabaseUser } from "../utils/auth";

export function useUserProfile(authUser: SupabaseUser | null) {
  const [currentUser, setCurrentUser] = useState<User>(
    getAppUserFromSupabaseUser(authUser)
  );

  const refreshProfile = useCallback(async () => {
    if (!authUser) {
      setCurrentUser(getAppUserFromSupabaseUser(null));
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, username, avatar_url, bio")
      .eq("id", authUser.id)
      .single();

    if (error || !data) {
      setCurrentUser(getAppUserFromSupabaseUser(authUser));
      return;
    }

    setCurrentUser({
      id: data.id,
      name: data.name,
      username: data.username,
      avatarUrl: data.avatar_url ?? undefined,
      bio: data.bio ?? undefined,
    });
  }, [authUser]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void refreshProfile();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [refreshProfile]);

  return {
    currentUser,
    refreshProfile,
  };
}