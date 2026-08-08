import { cache } from "react";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AppUser } from "@/types/domain";

const localOperationalUser: AppUser = {
  id: "00000000-0000-0000-0000-000000000001",
  fullName: "Operacion local",
  email: "modo-local@logicontrol360.local",
  role: "admin",
  terminalIds: [],
  lastAccessAt: new Date("2026-08-08T09:00:00-04:00").toISOString(),
};

export const getCurrentUser = cache(async (): Promise<AppUser> => {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return localOperationalUser;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return localOperationalUser;
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
