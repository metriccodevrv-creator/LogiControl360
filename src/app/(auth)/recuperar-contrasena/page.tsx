import Link from "next/link";

import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  return (
    <Card className="rounded-[32px]">
      <CardHeader>
        <CardTitle>Recuperar acceso</CardTitle>
        <p className="text-sm leading-6 text-[var(--color-text-soft)]">
          Envía el enlace de recuperación usando Supabase Auth y vuelve a ingresar
          con credenciales seguras.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <ForgotPasswordForm />
        <Link href="/login" className="text-sm font-semibold text-[var(--color-operational)]">
          Volver al inicio de sesión
        </Link>
      </CardContent>
    </Card>
  );
}
