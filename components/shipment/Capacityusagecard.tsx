"use client";

import { MoreHorizontal } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { FreightMode } from "@/types/warehouse";
import { CAPACITY_DATA } from "@/data/Capacity ";

interface Props {
  mode: FreightMode;
}

const PURPLE = "#8B7CF6";
const EMPTY_COLOR = "#F4F4F5";

export default function CapacityUsageCard({ mode }: Props) {
  const { loadedShelves, emptyShelves } = CAPACITY_DATA[mode];
  const totalShelves = loadedShelves + emptyShelves;
  const usagePercent = totalShelves ? (loadedShelves / totalShelves) * 100 : 0;

  const chartData = [
    { name: "Loaded", value: loadedShelves, color: PURPLE },
    { name: "Empty", value: emptyShelves, color: EMPTY_COLOR },
  ];

  return (
    <div className="rounded-3xl bg-[#1C1C1E] p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[16px] font-medium text-white">
          Capacity Usage
        </h3>

        <button className="text-gray-500">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="relative mx-auto mt-4 h-[150px] w-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart key={mode}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              startAngle={90}
              endAngle={-270}
              innerRadius="76%"
              outerRadius="100%"
            //   cornerRadius={6}
              stroke="none"
              isAnimationActive
              animationDuration={900}
              animationEasing="ease-out"
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Centered "Total Usage" label, overlaid on top of the donut hole */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-[12px] text-gray-400">Total Usage</p>
          <p className="text-[26px] font-bold text-white">
            {usagePercent % 1 === 0 ? usagePercent.toFixed(0) : usagePercent.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between px-2">
        <div className="text-center">
          <p className="text-[12px] text-gray-400">Loaded</p>
          <p className="mt-1 text-[14px] font-semibold text-white">
            {loadedShelves} shelves
          </p>
        </div>

        <div className="text-center">
          <p className="text-[12px] text-gray-400">Empty</p>
          <p className="mt-1 text-[14px] font-semibold text-white">
            {emptyShelves} shelves
          </p>
        </div>
      </div>
    </div>
  );
}