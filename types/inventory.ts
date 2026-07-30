export interface InventoryItem {
  name: string;
  percentage: number;
  packages: number;
  color: string;
  striped?: boolean;
}

export interface InventoryData {
  totalPackages: number;
  items: InventoryItem[];
}