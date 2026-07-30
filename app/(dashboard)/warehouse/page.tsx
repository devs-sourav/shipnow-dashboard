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


export default function WarehouseDashboard() {
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

      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Warehouse</h1>

          <nav className="mt-1 flex items-center text-sm">
            <Link href="/dashboard" className="text-indigo-600">
              Dashboard
            </Link>

            <span className="mx-2">/</span>

            <span>Warehouse</span>
          </nav>
        </div>

        <div className="flex gap-2 overflow-x-auto rounded-xl  bg-white ">
          {TABS.map(({ key, label, icon: Icon }) => {
            const active = activeMode === key;

            return (
              <button
                key={key}
                onClick={() => handleTabClick(key)}
                className={`flex items-center gap-2 rounded-lg px-4 py-3 transition ${active
                  ? "bg-black text-white"
                  : "hover:bg-gray-100 text-gray-700"
                  }`}
              >
                <Icon size={18} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Freight Component */}


      {/* Dashboard */}

      <div className="grid grid-cols-12 gap-4">


        <div className="col-span-3">
          <Stats mode={activeMode} />
        </div>

        <div className="col-span-6  rounded-xl ">
          <InventoryCard mode={activeMode} />
        </div>

        <div className="col-span-3  rounded-xl h-72">
          <CapacityUsageCard mode={activeMode} />
        </div>
        <div className="col-span-9">
          <WarehouseStorageTable mode ={activeMode}/>
        </div>
        <div className="col-span-3 h-7">

          <PackageStatusCard  mode={activeMode}/>

        </div>

        <div className="col-span-9 ">
          <WarehouseMapCard mode={activeMode}/>
        </div>

        <div className="col-span-3 ">
          <WarehouseActivityLogCard mode={activeMode}/>
        </div>

      </div>
    </div>
  );
}