"use client";

import { useMemo, useState } from "react";
import { MoreHorizontal, Package } from "lucide-react";
import { FreightMode } from "@/types/warehouse";
import { PackageStatus } from "@/types/packageStatus";
import { PACKAGE_STATUS_DATA } from "@/data/Packagestatus";

interface Props {
  mode: FreightMode;
}

const TABS: ("All" | PackageStatus)[] = ["All", "Expected", "Received", "Sent"];

const STATUS_STYLES: Record<PackageStatus, string> = {
  Sent: "bg-[#EDE9FE] text-[#7C5CFC]",
  Received: "bg-[#DCFCE7] text-[#16A34A]",
  Expected: "bg-gray-100 text-gray-500",
};

export default function PackageStatusCard({ mode }: Props) {
  const packages = PACKAGE_STATUS_DATA[mode];
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("All");

  const filteredPackages = useMemo(
    () =>
      activeTab === "All"
        ? packages
        : packages.filter((pkg) => pkg.status === activeTab),
    [packages, activeTab]
  );

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 h-[350px]">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-[#262626]">
          Package Status
        </h3>

        <button className="text-gray-400">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="mt-4 flex items-center gap-1 rounded-full bg-gray-100 ">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-full px-2 py-1.5 text-[12px] font-medium transition-colors ${
              activeTab === tab
                ? "bg-[#1C1C1E] text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-5">
        {filteredPackages.length === 0 ? (
          <div className="flex h-24 items-center justify-center text-sm text-gray-400">
            No packages in this status
          </div>
        ) : (
          filteredPackages.map((pkg) => (
            <div key={pkg.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDE9FE]">
                  <Package size={18} className="text-[#7C5CFC]" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#262626]">
                    {pkg.id}
                  </p>
                  <p className="text-[10px] text-gray-400">{pkg.date}</p>
                </div>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-[11px] font-medium ${STATUS_STYLES[pkg.status]}`}
              >
                {pkg.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}