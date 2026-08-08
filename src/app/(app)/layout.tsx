import type { ReactNode } from "react";

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
