import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RoutePlaceholderProps {
  title: string;
  description: string;
  nextStep: string;
}

export function RoutePlaceholder({
  title,
  description,
  nextStep,
}: RoutePlaceholderProps) {
  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
          Modulo en implementacion
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-[var(--color-text-soft)]">
          {description}
        </p>
        <div className="rounded-3xl bg-[var(--color-surface)] p-4 text-sm text-[var(--color-text)]">
          {nextStep}
        </div>
        <p className="text-sm font-semibold text-[var(--color-operational)]">
          La ruta ya esta conectada a navegacion y permisos; falta enlazar su flujo operativo.
        </p>
      </CardContent>
    </Card>
  );
}
