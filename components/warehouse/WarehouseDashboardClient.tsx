"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Truck, TrainFront, Ship, Plane } from "lucide-react";

import Stats from "@/components/warehouse/StatsCard";
import InventoryCard from "@/components/warehouse/InventoryCard";
import CapacityUsageCard from "@/components/shipment/Capacityusagecard";
import WarehouseStorageTable from "@/components/warehouse/Warehousestoragetable";
import WarehouseMapCard from "@/components/warehouse/Warehousemapcard";
import PackageStatusCard from "@/components/warehouse/Packagestatuscard";
import WarehouseActivityLogCard from "@/components/warehouse/Warehouseactivitylogcard";

export type FreightMode = "road" | "rail" | "ocean" | "air";

const TABS = [
    {
        key: "road",
        label: "Road Freight",
        icon: Truck,
    },
    {
        key: "rail",
        label: "Rail Freight",
        icon: TrainFront,
    },
    {
        key: "ocean",
        label: "Ocean Freight",
        icon: Ship,
    },
    {
        key: "air",
        label: "Air Freight",
        icon: Plane,
    },
] satisfies {
    key: FreightMode;
    label: string;
    icon: React.ElementType;
}[];

export default function WarehouseDashboardClient() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const mode = searchParams.get("mode") as FreightMode | null;

    const activeMode: FreightMode = TABS.some((tab) => tab.key === mode)
        ? (mode as FreightMode)
        : "road";

    const handleTabClick = (mode: FreightMode) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("mode", mode);
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="space-y-4 pt-4">
            {/* Header */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-[24px] font-bold">Warehouse</h1>
                    <nav className="mt-1 flex items-center text-xs lg:text-sm">
                        <Link href="/dashboard" className="text-indigo-600">Dashboard</Link>
                        <span className="mx-2">/</span>
                        <span>Warehouse</span>
                    </nav>
                </div>

                <div className="flex justify-between gap-1 lg:gap-2 rounded-xl bg-white overflow-x-auto">
                    {TABS.map(({ key, label, icon: Icon }) => {
                        const active = activeMode === key;
                        return (
                            <button
                                key={key}
                                onClick={() => handleTabClick(key)}
                                className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-3 text-xs lg:text-sm font-medium transition-colors duration-200 whitespace-nowrap ${active ? "bg-black text-white" : "text-gray-700"
                                    }`}
                            >
                                <Icon size={18} />
                                <span
                                    className={`grid text-xs transition-[grid-template-columns] duration-300 ease-in-out ${active ? "grid-cols-[1fr]" : "grid-cols-[0fr]"
                                        } md:grid-cols-[1fr]`}
                                    style={{ display: "grid" }}
                                >
                                    <span className="overflow-hidden">{label}</span>
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Dashboard */}

            <div className="grid grid-cols-12 gap-4">

                <div className="col-span-12 lg:col-span-3 order-1">
                    <Stats mode={activeMode} />
                </div>

                <div className="col-span-12 lg:col-span-6  rounded-xl order-2">
                    <InventoryCard mode={activeMode} />
                </div>

                <div className="col-span-12 md:col-span-6 lg:col-span-3  rounded-xl  order-3">
                    <CapacityUsageCard mode={activeMode} />
                </div>
                <div className="col-span-12 lg:col-span-9 order-5 lg:order-4">
                    <WarehouseStorageTable mode={activeMode} />
                </div>
                <div className="col-span-12 md:col-span-6 lg:col-span-3  order-4 lg:order-5">

                    <PackageStatusCard mode={activeMode} />

                </div>

                <div className="col-span-12 lg:col-span-9 order-6">
                    <WarehouseMapCard mode={activeMode} />
                </div>

                <div className="col-span-12 lg:col-span-3 order-7">
                    <WarehouseActivityLogCard mode={activeMode} />
                </div>

            </div>
        </div>
    );
}
