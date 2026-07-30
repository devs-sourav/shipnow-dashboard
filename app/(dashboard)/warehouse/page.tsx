import React, { Suspense } from "react";
import WarehouseDashboardClient from "@/components/warehouse/WarehouseDashboardClient";

export default function WarehousePage() {
  return (
    <Suspense fallback={<div />}> 
      <WarehouseDashboardClient />
    </Suspense>
  );
}