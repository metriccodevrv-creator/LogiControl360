import Link from "next/link";

import { LoginForm } from "@/components/forms/login-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <Card className="rounded-[32px]">
      <CardHeader>
        <CardTitle>Ingreso seguro</CardTitle>
        <p className="text-sm leading-6 text-[var(--color-text-soft)]">
          Acceso para supervisores, inspectores, planilleros y administradores.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <LoginForm />
        <div className="flex items-center justify-between text-sm text-[var(--color-text-soft)]">
          <span>Sin registro público habilitado.</span>
          <Link
            href="/recuperar-contrasena"
            className="font-semibold text-[var(--color-operational)]"
          >
            Recuperar contraseña
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
