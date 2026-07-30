export type SectionStatus = "available" | "full";

export interface MapSection {
  code: string;
  status: SectionStatus;
}

export interface MapCategoryBlock {
  category: string;
  sections: MapSection[];
  availableSpace: number;
  totalSpace: number;
}