import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { getCurrentUser } from "@/lib/auth/session";
import { formatDateTime } from "@/lib/dates/format";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Perfil"
        title="Sesión y contexto operativo"
        description="Resumen del usuario autenticado, rol activo y alcance operativo actual."
      />

      <Card>
        <CardHeader>
          <CardTitle>{user.fullName}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>Correo: {user.email}</p>
          <p>Último acceso: {formatDateTime(user.lastAccessAt)}</p>
          <Badge tone="info">Rol: {user.role}</Badge>
        </CardContent>
      </Card>
    </div>
  );
}
