import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-app-bg)] px-6 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[36px] bg-[linear-gradient(145deg,_#0B1F3A_0%,_#164E78_65%,_#0891B2_100%)] p-8 text-white shadow-[0_30px_90px_rgba(11,31,58,0.24)] lg:p-12">
          <p className="text-sm uppercase tracking-[0.28em] text-white/65">
            LogiControl360
          </p>
          <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-tight lg:text-5xl">
            Controla turnos, flota, evidencias y trazabilidad desde una sola plataforma.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/78">
            La base inicial ya viene preparada para múltiples terminales, Supabase,
            auditoría, RLS y una expansión ordenada por módulos operacionales.
          </p>
        </section>
        <section>{children}</section>
      </div>
    </div>
  );
}
