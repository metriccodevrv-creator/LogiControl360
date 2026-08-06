import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { getTerminalRows } from "@/features/operations/queries";
import { getCurrentUser } from "@/lib/auth/session";

export default async function ApplicationLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();
  const terminals = await getTerminalRows();

  if (!user) {
    redirect("/login");
  }

  return (
    <AppShell
      user={user}
      terminals={terminals.filter((terminal) =>
        user.terminalIds.length ? user.terminalIds.includes(terminal.id) : true,
      )}
    >
      {children}
    </AppShell>
  );
}
