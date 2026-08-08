import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <Card className="rounded-[32px]">
      <CardHeader>
        <CardTitle>Acceso temporalmente pausado</CardTitle>
        <p className="text-sm leading-6 text-[var(--color-text-soft)]">
          El ingreso a la plataforma se encuentra oculto por el momento mientras se
          completa la configuracion operativa.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-[24px] bg-amber-50 p-5 text-sm leading-6 text-amber-800">
          El formulario de inicio de sesion y la recuperacion de contrasena quedaron
          deshabilitados temporalmente.
        </div>
        <p className="text-sm text-[var(--color-text-soft)]">
          Cuando el acceso vuelva a habilitarse, esta pantalla mostrara nuevamente el flujo
          de autenticacion.
        </p>
      </CardContent>
    </Card>
  );
}
