import { redirect } from "next/navigation";

import { requirePermission } from "@/lib/permissions/access";

export default async function RTGPage() {
  await requirePermission("rtg.read");
  redirect("/revisiones-tecnicas");
}
