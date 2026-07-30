export type PackageStatus = "Expected" | "Received" | "Sent";

export interface PackageItem {
  id: string;
  date: string;
  status: PackageStatus;
}