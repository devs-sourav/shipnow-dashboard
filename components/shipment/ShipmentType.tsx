"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { MoreHorizontal } from "lucide-react";

const data = [
  {
    name: "Road Freight",
    value: 46,
    shipment: 1150,
    color: "#7C5CFA",
  },
  {
    name: "Ocean Freight",
    value: 17,
    shipment: 425,
    color: "#7B7B7B",
  },
  {
    name: "Air Freight",
    value: 28,
    shipment: 700,
    color: "#2F2F2F",
  },
  {
    name: "Rail Freight",
    value: 9,
    shipment: 225,
    color: "#ECECEC",
  },
];

export default function ShipmentType() {
  return (
    <div className="rounded-3xl bg-white p-4 flex justify-between  flex-col h-full">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[16px] font-semibold text-[#2D2D2D]">
          Shipment Type
        </h3>

        <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5F5F5]">
          <MoreHorizontal size={18} className="text-gray-500" />
        </button>
      </div>

      {/* Donut */}
      <div className="mx-auto h-[195px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={73}
              outerRadius={91}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              {data.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>

            {/* Center Label */}
            <text
              x="50%"
              y="47%"
              textAnchor="middle"
              fill="#8C8C8C"
              fontSize="14"
            >
              Total Shipment
            </text>

            <text
              x="50%"
              y="60%"
              textAnchor="middle"
              fill="#2D2D2D"
              fontSize="26"
              fontWeight="700"
            >
              2,500
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-between items-center w-full">
        <div className="mt-3 grid grid-cols-2 items-center gap-x-3 gap-y-4 pt-6  mx-auto">
          {data.map((item) => (
            <div key={item.name} className="flex items-start gap-1">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-sm text-[10px] font-bold text-white"
                style={{
                  background: item.color,
                  color: item.color === "#ECECEC" ? "#2D2D2D" : "#fff",
                }}
              >
                {item.value}%
              </div>

              <div>
                <h4 className="text-[10px] font-medium text-[#2D2D2D]">
                  {item.name}
                </h4>

                <p className="text-[10px] text-[#9B9B9B]">
                  {item.shipment.toLocaleString()} shipment
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
