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
      <CardHeader>
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
          Ruta base operativa y lista para conectarse al módulo transaccional correspondiente.
        </p>
      </CardContent>
    </Card>
  );
}
