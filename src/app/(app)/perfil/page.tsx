import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { getCurrentUser } from "@/lib/auth/session";
import { formatDateTime } from "@/lib/dates/format";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Perfil"
        title="Sesion y contexto operativo"
        description="Resumen del usuario activo, rol visible y alcance operativo actual."
      />

      <Card>
        <CardHeader>
          <CardTitle>{user.fullName}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>Correo: {user.email}</p>
          <p>Ultimo acceso: {formatDateTime(user.lastAccessAt)}</p>
          <Badge tone="info">Rol: {user.role}</Badge>
        </CardContent>
      </Card>
    </div>
  );
}
