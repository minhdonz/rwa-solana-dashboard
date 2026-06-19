"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { VENUE_COLORS, type VenueSlice } from "@/lib/snapshot";

/** Pie of where a token's supply is held / used, by venue bucket. */
export default function VenueChart({ venues }: { venues: VenueSlice[] }) {
  const data = venues.filter((v) => v.pct > 0);
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="pct"
            nameKey="bucket"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={1}
            stroke="#ffffff"
            strokeWidth={1.5}
          >
            {data.map((v) => (
              <Cell key={v.bucket} fill={VENUE_COLORS[v.bucket]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 2,
              fontSize: 12,
              color: "#0f172a",
            }}
            formatter={(value: number, name: string) => [`${value}%`, name]}
          />
          <Legend
            wrapperStyle={{ fontSize: 12 }}
            formatter={(value) => <span className="text-slate-600">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
