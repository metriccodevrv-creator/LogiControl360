"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { CompliancePoint } from "@/types/domain";

export function OperationalOverviewChart({
  data,
}: {
  data: CompliancePoint[];
}) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="4 4" stroke="#dbe4ef" vertical={false} />
          <XAxis dataKey="day" stroke="#64748b" tickLine={false} axisLine={false} />
          <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ fill: "rgba(8,145,178,0.08)" }}
            contentStyle={{
              borderRadius: 18,
              border: "1px solid #dbe4ef",
            }}
          />
          <Bar dataKey="cumplimiento" fill="#0891B2" radius={[12, 12, 0, 0]} />
          <Bar dataKey="tareasCriticas" fill="#D97706" radius={[12, 12, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
