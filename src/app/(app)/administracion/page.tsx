import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requirePermission } from "@/lib/permissions/access";

const adminLinks = [
  {
    href: "/administracion/terminales",
    title: "Terminales",
    description: "Gobierno multi-terminal, configuraciones base y supervisor responsable.",
  },
  {
    href: "/administracion/flota",
    title: "Base maestra de flota",
    description: "Control de buses, estado operacional y documentación crítica.",
  },
  {
    href: "/administracion/personal",
    title: "Personal",
    description: "Estructura de personas, roles y asignaciones por terminal.",
  },
  {
    href: "/marca",
    title: "Identidad de marca",
    description: "Guía visual interna, variantes SVG y criterios de uso.",
  },
];

export default async function AdministrationPage() {
  await requirePermission("administration.read");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Gobierno"
        title="Centro de administración"
        description="Consola base para usuarios, terminales, flota, personal, catálogos, auditoría e importaciones."
      />

      <section className="grid gap-5 md:grid-cols-2">
        {adminLinks.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="h-full transition hover:-translate-y-0.5">
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-[var(--color-text-soft)]">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}
