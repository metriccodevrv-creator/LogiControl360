"use client";

import {
  Bell,
  BusFront,
  ClipboardList,
  FileBarChart2,
  FileText,
  LayoutDashboard,
  Route,
  Settings2,
  Users2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { LogoMark } from "@/components/brand/logo-mark";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AppUser, Terminal } from "@/types/domain";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/turnos", label: "Turnos", icon: Route },
  { href: "/tareas", label: "Tareas", icon: ClipboardList },
  { href: "/flota", label: "Flota", icon: BusFront },
  {
    href: "/revisiones-tecnicas",
    label: "Revisiones Tecnicas",
    icon: FileText,
  },
  { href: "/notificaciones", label: "Notificaciones", icon: Bell },
  { href: "/informes", label: "Informes", icon: FileBarChart2 },
  { href: "/administracion", label: "Administracion", icon: Settings2 },
];

interface AppShellProps {
  children: ReactNode;
  user: AppUser;
  terminals: Terminal[];
}

export function AppShell({ children, user, terminals }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--color-app-bg)] text-[var(--color-text)]">
      <div className="mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[300px_1fr]">
        <aside className="relative overflow-hidden border-r border-[var(--color-border)] bg-[var(--color-primary)] px-6 py-8 text-white">
          <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,_rgba(8,145,178,0.45),_transparent_60%)]" />
          <div className="relative flex h-full flex-col">
            <LogoMark />
            <div className="mt-8 rounded-[28px] border border-white/10 bg-white/8 p-5 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.24em] text-white/60">
                Sesion activa
              </p>
              <p className="mt-3 text-lg font-semibold">{user.fullName}</p>
              <p className="text-sm text-white/70">{user.email}</p>
              <Badge className="mt-4 bg-white/12 text-white" tone="info">
                Rol: {user.role}
              </Badge>
            </div>

            <nav className="mt-8 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    data-active={isActive ? "true" : "false"}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors duration-150",
                      isActive
                        ? "interactive-pill-active"
                        : "text-white/78 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-current" />
                    <span className="text-current">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto rounded-[28px] border border-white/10 bg-white/8 p-5 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.24em] text-white/60">
                Terminales
              </p>
              <div className="mt-4 space-y-3">
                {terminals.slice(0, 3).map((terminal) => (
                  <div key={terminal.id} className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{terminal.name}</p>
                      <p className="text-xs text-white/65">{terminal.zone}</p>
                    </div>
                    <Users2 className="h-4 w-4 text-white/60" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-white/85 px-6 py-4 backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-soft)]">
                  Centro de control logistico
                </p>
                <h2 className="mt-2 text-xl font-semibold text-[var(--color-primary)]">
                  Operacion multi-terminal en tiempo real
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone="info">Timezone: America/Santiago</Badge>
                <Badge tone="success">RLS listo para habilitar</Badge>
              </div>
            </div>
          </header>

          <main className="flex-1 px-6 py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
