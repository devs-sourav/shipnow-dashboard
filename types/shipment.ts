export type Status = "In Transit" | "Out for Delivery" | "Delivered" | "Processing";
export type Mode = "air" | "truck" | "ship" | "train";

export interface Shipment {
  id: string;
  status: Status;
  mode: Mode;
  company: string;
  category: string;
  logoColor: string;
  logoImage:string;
  originCity: string;
  originDate: string;
  destinationCity: string;
  destinationDate: string;
  progress: number;
  carrier: string;
}