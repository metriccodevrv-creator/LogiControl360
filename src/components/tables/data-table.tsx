import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (item: T) => ReactNode;
}

interface DataTableProps<T extends { id: string }> {
  title: string;
  description: string;
  columns: Column<T>[];
  data: T[];
}

export function DataTable<T extends { id: string }>({
  title,
  description,
  columns,
  data,
}: DataTableProps<T>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-[var(--color-text-soft)]">{description}</p>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-3">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="px-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-soft)]"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="rounded-2xl bg-[var(--color-surface)]">
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className="px-4 py-3 text-sm text-[var(--color-text)] first:rounded-l-2xl last:rounded-r-2xl"
                  >
                    {column.render
                      ? column.render(item)
                      : String(item[column.key] ?? "-")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
