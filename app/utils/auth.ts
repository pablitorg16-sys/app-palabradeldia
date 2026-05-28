import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { User } from "../types";

export function getAppUserFromSupabaseUser(
  supabaseUser: SupabaseUser | null
): User {
  if (!supabaseUser) {
    return {
      id: "guest-user",
      name: "Invitado",
      username: "invitado",
      bio: "Usando PalabradelDía en modo local.",
    };
  }

  const emailName = supabaseUser.email?.split("@")[0] ?? "usuario";

  return {
    id: supabaseUser.id,
    name: supabaseUser.user_metadata?.name ?? emailName,
    username: supabaseUser.user_metadata?.username ?? emailName,
    bio: "Aprendiendo a vivir la Palabra del día.",
  };
}