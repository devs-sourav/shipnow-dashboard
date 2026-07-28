"use client";

import { MoreHorizontal, ArrowUpRight, FileWarning, MapPinOff, CloudLightning } from "lucide-react";

interface AlertSummary {
  count: number;
  label: string;
}

interface AlertItem {
  id: string;
  title: string;
  code: string;
  category: string;
  date: string;
  icon: "customs" | "address" | "weather";
}

const summaries: AlertSummary[] = [
  { count: 5, label: "Customs Clearance Delay" },
  { count: 4, label: "Incorrect Address Provided" },
  { count: 3, label: "Weather-Related Hold" },
];

const alerts: AlertItem[] = [
  {
    id: "SH8743921",
    title: "Customs Clearance Delay",
    code: "#SH8743921",
    category: "Ocean Freight",
    date: "Mar 20",
    icon: "customs",
  },
  {
    id: "SH8725810",
    title: "Incorrect Address Provided",
    code: "#SH8725810",
    category: "Road Freight",
    date: "Mar 20",
    icon: "address",
  },
  {
    id: "SH8790043",
    title: "Weather-Related Hold",
    code: "#SH8790043",
    category: "Air Freight",
    date: "Mar 19",
    icon: "weather",
  },
  {
    id: "SH8716654",
    title: "Incorrect Address Provided",
    code: "#SH8716654",
    category: "Rail Freight",
    date: "Mar 18",
    icon: "customs",
  },
];

function AlertIcon({ type }: { type: AlertItem["icon"] }) {
  const base = "h-9 w-9 shrink-0 rounded-lg flex items-center justify-center";
  if (type === "address") {
    return (
      <div className={`${base} bg-slate-100 text-slate-500`}>
        <MapPinOff size={16} strokeWidth={2} />
      </div>
    );
  }
  if (type === "weather") {
    return (
      <div className={`${base} bg-slate-100 text-slate-500`}>
        <CloudLightning size={16} strokeWidth={2} />
      </div>
    );
  }
  return (
    <div className={`${base} bg-slate-100 text-slate-500`}>
      <FileWarning size={16} strokeWidth={2} />
    </div>
  );
}

export default function ShipmentAlerts() {
  return (
    <div className="h-[443px] w-full Lg:w-[284.5px] rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-slate-800">Shipment Alerts</h2>
        <button
          type="button"
          aria-label="More options"
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-slate-500 hover:bg-slate-200 transition-colors"
        >
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Big stat */}
      <div className="mt-3 mb-1 flex items-baseline gap-1.5">
        <span className="text-3xl font-bold tracking-tight text-slate-900">12</span>
        <span className="text-[13px] text-slate-500">Delays Detected</span>
      </div>

      {/* Summary chips */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {summaries.map((s) => (
          <div
            key={s.label}
            className="rounded-lg bg-violet-100/80 px-3 py-3 flex flex-col items-center text-center gap-1"
          >
            <span className="text-[24px] font-bold text-[#333333]">{s.count}</span>
            <span className="text-[10px] leading-tight text-[#333333]">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Alert list */}
      <div className="pt-6 flex-1 space-y-3.5 overflow-y-auto">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-center gap-3">
            <AlertIcon type={alert.icon} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-slate-800">{alert.title}</p>
              <p className="truncate text-[11px] text-slate-400">
                <span className="text-violet-500">{alert.code}</span> · {alert.category} · {alert.date}
              </p>
            </div>
            <ArrowUpRight size={15} className="shrink-0 text-slate-300" />
          </div>
        ))}
      </div>
    </div>
  );
}