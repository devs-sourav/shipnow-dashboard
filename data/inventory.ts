import { FreightMode } from "@/types/warehouse";
import { InventoryData } from "@/types/inventory";

export const INVENTORY_DATA: Record<FreightMode, InventoryData> = {
  road: {
    totalPackages: 10000,
    items: [
      { name: "Electronics", percentage: 25, packages: 2500, color: "#7C5CFC" },
      { name: "Apparel", percentage: 20, packages: 2000, color: "#8B6BFF", striped: true },
      { name: "Home & Kitchen", percentage: 18, packages: 1800, color: "#2F2F2F" },
      { name: "Beauty & Health", percentage: 15, packages: 1500, color: "#3A3A3A", striped: true },
      { name: "Automotive Parts", percentage: 12, packages: 1200, color: "#8A8A8A" },
      { name: "Sports Equipment", percentage: 10, packages: 1000, color: "#9B9B9B", striped: true },
    ],
  },

  rail: {
    totalPackages: 12000,
    items: [
      { name: "Machinery", percentage: 28, packages: 3360, color: "#7C5CFC" },
      { name: "Raw Materials", percentage: 24, packages: 2880, color: "#8B6BFF", striped: true },
      { name: "Chemicals", percentage: 17, packages: 2040, color: "#2F2F2F" },
      { name: "Food & Grain", percentage: 14, packages: 1680, color: "#3A3A3A", striped: true },
      { name: "Automotive Parts", percentage: 10, packages: 1200, color: "#8A8A8A" },
      { name: "Furniture", percentage: 7, packages: 840, color: "#9B9B9B", striped: true },
    ],
  },

  ocean: {
    totalPackages: 15000,
    items: [
      { name: "Electronics", percentage: 22, packages: 3300, color: "#7C5CFC" },
      { name: "Apparel", percentage: 20, packages: 3000, color: "#8B6BFF", striped: true },
      { name: "Furniture", percentage: 18, packages: 2700, color: "#2F2F2F" },
      { name: "Machinery", percentage: 16, packages: 2400, color: "#3A3A3A", striped: true },
      { name: "Raw Materials", percentage: 14, packages: 2100, color: "#8A8A8A" },
      { name: "Chemicals", percentage: 10, packages: 1500, color: "#9B9B9B", striped: true },
    ],
  },

  air: {
    totalPackages: 8000,
    items: [
      { name: "Electronics", percentage: 32, packages: 2560, color: "#7C5CFC" },
      { name: "Pharma", percentage: 24, packages: 1920, color: "#8B6BFF", striped: true },
      { name: "Documents", percentage: 16, packages: 1280, color: "#2F2F2F" },
      { name: "Apparel", percentage: 12, packages: 960, color: "#3A3A3A", striped: true },
      { name: "Beauty & Health", percentage: 10, packages: 800, color: "#8A8A8A" },
      { name: "Sports Equipment", percentage: 6, packages: 480, color: "#9B9B9B", striped: true },
    ],
  },
};