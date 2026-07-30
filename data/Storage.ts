import { FreightMode } from "@/types/warehouse";
import { StorageRow } from "@/types/storage";

export const STORAGE_DATA: Record<FreightMode, StorageRow[]> = {
  road: [
    { floor: 1, section: "A1 - A10", category: "Electronics", percentage: 80, availableSpace: 20, totalSpace: 100 },
    { floor: 2, section: "B1 - B10", category: "Apparel", percentage: 60, availableSpace: 40, totalSpace: 100 },
    { floor: 1, section: "C1 - C10", category: "Home & Kitchen", percentage: 90, availableSpace: 10, totalSpace: 100 },
    { floor: 3, section: "D1 - D10", category: "Automotive Parts", percentage: 50, availableSpace: 50, totalSpace: 100 },
    { floor: 2, section: "E1 - E10", category: "Beauty & Health", percentage: 70, availableSpace: 30, totalSpace: 100 },
  ],

  rail: [
    { floor: 1, section: "R1 - R10", category: "Machinery", percentage: 85, availableSpace: 15, totalSpace: 100 },
    { floor: 2, section: "R11 - R20", category: "Raw Materials", percentage: 65, availableSpace: 35, totalSpace: 100 },
    { floor: 1, section: "R21 - R30", category: "Chemicals", percentage: 55, availableSpace: 45, totalSpace: 100 },
    { floor: 3, section: "R31 - R40", category: "Food & Grain", percentage: 75, availableSpace: 25, totalSpace: 100 },
    { floor: 2, section: "R41 - R50", category: "Furniture", percentage: 40, availableSpace: 60, totalSpace: 100 },
  ],

  ocean: [
    { floor: 1, section: "O1 - O10", category: "Electronics", percentage: 72, availableSpace: 28, totalSpace: 100 },
    { floor: 2, section: "O11 - O20", category: "Apparel", percentage: 68, availableSpace: 32, totalSpace: 100 },
    { floor: 1, section: "O21 - O30", category: "Furniture", percentage: 84, availableSpace: 16, totalSpace: 100 },
    { floor: 3, section: "O31 - O40", category: "Machinery", percentage: 58, availableSpace: 42, totalSpace: 100 },
    { floor: 2, section: "O41 - O50", category: "Raw Materials", percentage: 46, availableSpace: 54, totalSpace: 100 },
  ],

  air: [
    { floor: 1, section: "F1 - F10", category: "Electronics", percentage: 92, availableSpace: 8, totalSpace: 100 },
    { floor: 2, section: "F11 - F20", category: "Pharma", percentage: 88, availableSpace: 12, totalSpace: 100 },
    { floor: 1, section: "F21 - F30", category: "Documents", percentage: 64, availableSpace: 36, totalSpace: 100 },
    { floor: 3, section: "F31 - F40", category: "Apparel", percentage: 50, availableSpace: 50, totalSpace: 100 },
    { floor: 2, section: "F41 - F50", category: "Beauty & Health", percentage: 42, availableSpace: 58, totalSpace: 100 },
  ],
};