import { redirect } from "next/navigation";

import { permissionsByRole } from "@/constants/permissions";
import { getCurrentUser } from "@/lib/auth/session";
import type { AppRole, Permission } from "@/types/domain";

export function hasPermission(role: AppRole, permission: Permission) {
  return permissionsByRole[role].includes(permission);
}

export async function requirePermission(permission: Permission) {
  const user = await getCurrentUser();

  if (!hasPermission(user.role, permission)) {
    redirect("/dashboard");
  }

  return user;
}
