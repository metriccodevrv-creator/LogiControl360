import Image from "next/image";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requirePermission } from "@/lib/permissions/access";

const logoVariants = [
  {
    title: "Horizontal",
    src: "/brand/logo-logicontrol360-horizontal.svg",
    bg: "bg-white",
  },
  {
    title: "Vertical",
    src: "/brand/logo-logicontrol360-vertical.svg",
    bg: "bg-white",
  },
  {
    title: "Blanco",
    src: "/brand/logo-logicontrol360-blanco.svg",
    bg: "bg-[var(--color-primary)]",
  },
  {
    title: "Monocromo",
    src: "/brand/logo-logicontrol360-monocromo.svg",
    bg: "bg-slate-100",
  },
];

export default async function BrandPage() {
  await requirePermission("brand.read");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Identidad"
        title="Guía de marca LogiControl360"
        description="Sistema visual corporativo orientado a logística, control, conectividad y lectura clara en ambientes operacionales."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        {logoVariants.map((variant) => (
          <Card key={variant.title}>
            <CardHeader>
              <CardTitle>{variant.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`rounded-[28px] p-8 ${variant.bg}`}>
                <Image src={variant.src} alt={variant.title} width={260} height={140} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Paleta y uso</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {[
            ["Azul corporativo", "#0B1F3A"],
            ["Turquesa operativo", "#0891B2"],
            ["Verde cumplimiento", "#16A34A"],
            ["Ámbar advertencia", "#D97706"],
            ["Rojo alerta", "#DC2626"],
            ["Gris apoyo", "#475569"],
          ].map(([label, color]) => (
            <div key={label} className="rounded-3xl border border-[var(--color-border)] p-4">
              <div
                className="mb-3 h-16 rounded-2xl"
                style={{ backgroundColor: color }}
              />
              <p className="font-semibold text-[var(--color-primary)]">{label}</p>
              <p className="text-sm text-[var(--color-text-soft)]">{color}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
