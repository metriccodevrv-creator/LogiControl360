import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getNotificationRows } from "@/features/operations/queries";
import { formatDateTime } from "@/lib/dates/format";
import { requirePermission } from "@/lib/permissions/access";

export default async function NotificationsPage() {
  await requirePermission("notifications.read");
  const notifications = await getNotificationRows();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Centro interno"
        title="Notificaciones"
        description="Lista de eventos operacionales, administrativos y documentales registrados en el sistema."
      />

      <div className="grid gap-5">
        {notifications.length ? (
          notifications.map((notification) => (
            <Card key={notification.id}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>{notification.title}</CardTitle>
                  <Badge tone={notification.severity}>{notification.severity}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-[var(--color-text-soft)]">
                  {notification.description}
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
                  {formatDateTime(notification.createdAt)}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="pt-6 text-sm text-[var(--color-text-soft)]">
              No hay notificaciones registradas.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
