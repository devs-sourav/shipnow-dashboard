"use client";

import { FreightMode } from "@/types/warehouse";
import { STATS_DATA } from "@/data/warehouse";
import StatCardItem from "./StatCardItem";

interface Props {
  mode: FreightMode;
}

export default function StatsCard({ mode }: Props) {
  const stats = STATS_DATA[mode];

  return (
    <div className="grid grid-cols-1 gap-4">
      {stats.map((item) => (
        <StatCardItem key={item.id} item={item} />
      ))}
    </div>
  );
}