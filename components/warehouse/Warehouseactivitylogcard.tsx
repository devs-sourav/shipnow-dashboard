"use client";

import { MoreHorizontal, ClipboardCheck, Boxes, Truck, FileText } from "lucide-react";
import { FreightMode } from "@/types/warehouse";
import { ActivityType } from "@/types/activityLog";
import { ACTIVITY_LOG_DATA } from "@/data/activityLog";

interface Props {
  mode: FreightMode;
}

const TYPE_STYLES: Record<ActivityType, { bg: string; iconColor: string; icon: typeof ClipboardCheck }> = {
  received: { bg: "bg-[#1C1C1E]", iconColor: "text-white", icon: ClipboardCheck },
  added: { bg: "bg-[#8B7CF6]", iconColor: "text-white", icon: Boxes },
  dispatched: { bg: "bg-[#1C1C1E]", iconColor: "text-white", icon: Truck },
  created: { bg: "bg-[#8B7CF6]", iconColor: "text-white", icon: FileText },
};

export default function WarehouseActivityLogCard({ mode }: Props) {
  const entries = ACTIVITY_LOG_DATA[mode];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white px-4 pt-4 h-[443px] pb-2">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-[#262626]">
          Warehouse Activity Log
        </h3>

        <button className="text-gray-400">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="mt-5 flex flex-col">
        {entries.map((entry, index) => {
          const { bg, iconColor, icon: Icon } = TYPE_STYLES[entry.type];
          const isLast = index === entries.length - 1;

          return (
            <div
              key={entry.id}
              className={`flex gap-3`}
            >
              <div
                className={`flex h-8 w-8 mt-2.5 shrink-0 items-center justify-center rounded-full ${bg}`}
              >
                <Icon size={12} className={iconColor} />
              </div>

              <div className={`py-2.5 ${!isLast ? "border-b border-[#E0E0E0]" : ""}`}>
                <p className="text-[12px]  text-[#262626]">
                  <span className="font-medium text-[#7C5CFC]">
                    {entry.actorName}
                  </span>{" "}
                  {entry.actionText}
                </p>
                <p className="mt-1.5 text-[10px] text-gray-400">
                  {entry.timestamp}
                </p>
              </div>
            </div>
          );
        })}

        {entries.length === 0 && (
          <div className="flex h-24 items-center justify-center text-sm text-gray-400">
            No activity recorded yet
          </div>
        )}
      </div>
    </div>
  );
}