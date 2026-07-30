import { FreightMode } from "@/types/warehouse";
import { CapacityData } from "@/types/capacity";

export const CAPACITY_DATA: Record<FreightMode, CapacityData> = {
  road: { loadedShelves: 40, emptyShelves: 24 },
  rail: { loadedShelves: 58, emptyShelves: 22 },
  ocean: { loadedShelves: 76, emptyShelves: 44 },
  air: { loadedShelves: 21, emptyShelves: 9 },
};