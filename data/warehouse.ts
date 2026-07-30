import { FreightMode, StatItem } from "@/types/warehouse";

export const STATS_DATA: Record<FreightMode, StatItem[]> = {
  road: [
    {
      id: 1,
      title: "Total SKU",
      value: "285",
      growth: "+2.58%",
    },
    {
      id: 2,
      title: "Quantity on Hand",
      value: "12,450",
      suffix: "units",
      growth: "+4.37%",
    },
    {
      id: 3,
      title: "Capacity Usage",
      value: "62.5%",
      suffix: "Full",
      growth: "+1.54%",
    },
  ],

  rail: [
    {
      id: 1,
      title: "Rail Containers",
      value: "198",
      growth: "+3.12%",
    },
    {
      id: 2,
      title: "Cargo Weight",
      value: "8,920",
      suffix: "tons",
      growth: "+1.86%",
    },
    {
      id: 3,
      title: "Platform Usage",
      value: "74%",
      suffix: "Full",
      growth: "+2.41%",
    },
  ],

  ocean: [
    {
      id: 1,
      title: "Containers",
      value: "1,240",
      growth: "+5.84%",
    },
    {
      id: 2,
      title: "Stored Cargo",
      value: "24,800",
      suffix: "CBM",
      growth: "+2.91%",
    },
    {
      id: 3,
      title: "Dock Usage",
      value: "81%",
      suffix: "Occupied",
      growth: "+3.44%",
    },
  ],

  air: [
    {
      id: 1,
      title: "Air Shipments",
      value: "436",
      growth: "+6.13%",
    },
    {
      id: 2,
      title: "Cargo Weight",
      value: "3,860",
      suffix: "kg",
      growth: "+2.22%",
    },
    {
      id: 3,
      title: "Warehouse Usage",
      value: "58%",
      suffix: "Full",
      growth: "+1.83%",
    },
  ],
};