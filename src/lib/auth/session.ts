import { cache } from "react";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AppUser } from "@/types/domain";

export const getCurrentUser = cache(async (): Promise<AppUser | null> => {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const role =
    (user.user_metadata?.role as AppUser["role"] | undefined) || "consulta";

  return {
    id: user.id,
    fullName:
      (user.user_metadata?.full_name as string | undefined) ||
      user.email ||
      "Usuario",
    email: user.email || "sin-correo@logicontrol360.local",
    role,
    terminalIds:
      (user.user_metadata?.terminal_ids as string[] | undefined) || [],
    lastAccessAt:
      (user.last_sign_in_at as string | undefined) ||
      new Date().toISOString(),
  };
});
