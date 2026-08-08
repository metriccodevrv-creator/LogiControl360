import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  return (
    <Card className="rounded-[32px]">
      <CardHeader>
        <CardTitle>Recuperacion no disponible</CardTitle>
        <p className="text-sm leading-6 text-[var(--color-text-soft)]">
          El flujo de recuperacion de acceso tambien quedo oculto mientras el ingreso se
          mantiene en pausa.
        </p>
      </CardHeader>
      <CardContent>
        <div className="rounded-[24px] bg-slate-100 p-5 text-sm leading-6 text-slate-700">
          No hay acciones disponibles en esta vista por ahora.
        </div>
      </CardContent>
    </Card>
  );
}
