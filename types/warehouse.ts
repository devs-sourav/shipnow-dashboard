export type FreightMode = "road" | "rail" | "ocean" | "air";

export interface StatItem {
  id: number;
  title: string;
  value: string;
  suffix?: string;
  growth: string;
}