import { FreightMode } from "@/types/warehouse";
import { MapCategoryBlock, MapSection } from "@/types/warehouseMap";

const sections = (prefix: string, count: number, fullIndexes: number[] = []): MapSection[] =>
  Array.from({ length: count }, (_, i) => ({
    code: `${prefix}${i + 1}`,
    status: fullIndexes.includes(i + 1) ? "full" : "available",
  }));

export const WAREHOUSE_MAP_DATA: Record<FreightMode, Record<number, MapCategoryBlock[]>> = {
  road: {
    1: [
      { category: "Electronics", sections: sections("A", 3), availableSpace: 20, totalSpace: 100 },
      { category: "Home & Kitchen", sections: sections("C", 3, [2]), availableSpace: 10, totalSpace: 100 },
      { category: "Automotive Parts", sections: sections("D", 3), availableSpace: 50, totalSpace: 100 },
      { category: "Sports Equipment", sections: sections("F", 3), availableSpace: 45, totalSpace: 100 },
      { category: "Apparel", sections: sections("B", 10, [4, 8]), availableSpace: 20, totalSpace: 100 },
      { category: "Beauty & Health", sections: sections("E", 4), availableSpace: 30, totalSpace: 100 },
    ],
    2: [
      { category: "Electronics", sections: sections("A", 4, [1]), availableSpace: 35, totalSpace: 100 },
      { category: "Apparel", sections: sections("B", 6), availableSpace: 55, totalSpace: 100 },
      { category: "Beauty & Health", sections: sections("E", 3), availableSpace: 40, totalSpace: 100 },
    ],
    3: [
      { category: "Automotive Parts", sections: sections("D", 5, [3, 4]), availableSpace: 15, totalSpace: 100 },
      { category: "Sports Equipment", sections: sections("F", 4), availableSpace: 60, totalSpace: 100 },
    ],
  },

  rail: {
    1: [
      { category: "Machinery", sections: sections("M", 4), availableSpace: 15, totalSpace: 100 },
      { category: "Raw Materials", sections: sections("R", 6, [2]), availableSpace: 35, totalSpace: 100 },
      { category: "Chemicals", sections: sections("C", 3), availableSpace: 45, totalSpace: 100 },
    ],
    2: [
      { category: "Food & Grain", sections: sections("G", 8, [5, 6]), availableSpace: 25, totalSpace: 100 },
      { category: "Furniture", sections: sections("U", 4), availableSpace: 60, totalSpace: 100 },
    ],
    3: [
      { category: "Machinery", sections: sections("M", 3, [1]), availableSpace: 30, totalSpace: 100 },
    ],
  },

  ocean: {
    1: [
      { category: "Electronics", sections: sections("A", 5), availableSpace: 28, totalSpace: 100 },
      { category: "Apparel", sections: sections("B", 7, [3]), availableSpace: 32, totalSpace: 100 },
      { category: "Furniture", sections: sections("U", 4), availableSpace: 16, totalSpace: 100 },
    ],
    2: [
      { category: "Machinery", sections: sections("M", 5, [2, 3]), availableSpace: 42, totalSpace: 100 },
      { category: "Raw Materials", sections: sections("R", 6), availableSpace: 54, totalSpace: 100 },
    ],
    3: [
      { category: "Electronics", sections: sections("A", 3), availableSpace: 20, totalSpace: 100 },
    ],
  },

  air: {
    1: [
      { category: "Electronics", sections: sections("A", 3, [2]), availableSpace: 8, totalSpace: 100 },
      { category: "Pharma", sections: sections("P", 4), availableSpace: 12, totalSpace: 100 },
      { category: "Documents", sections: sections("O", 3), availableSpace: 36, totalSpace: 100 },
    ],
    2: [
      { category: "Apparel", sections: sections("B", 5, [1]), availableSpace: 50, totalSpace: 100 },
      { category: "Beauty & Health", sections: sections("E", 4), availableSpace: 58, totalSpace: 100 },
    ],
    3: [
      { category: "Pharma", sections: sections("P", 3), availableSpace: 20, totalSpace: 100 },
    ],
  },
};