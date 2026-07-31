import { LucideIcon } from "lucide-react";

export interface StatCardType {
  id: string;
  title: string;
  amount: string;
  invoices: number;
  icon: LucideIcon;
}

export type InvoiceStatus = "Paid" | "Unpaid" | "Pending" | "Overdue";

export interface InvoiceParty {
  name: string;
  email: string;
  address: string;
  phone: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  shipmentType: string;
  shipmentSubtype: string;
  price: number;
  qty: number;
}

export interface PackageItem {
  id: string;
  description: string;
  shipmentType: string;
  shipmentSubtype: string;
  price: number;
  qty: number;
}

export interface Invoice {
  id: string; // e.g. "INV-1008"
  company: string;
  CompanyLogo:string;
  companyIconColor: string; // tailwind bg color class for the little logo chip
  shippingId: string; // e.g. "SH8893247"
  issueDate: string; // "Mar 16, 2035"
  dueDate: string; // "Mar 23, 2035"
  amount: number;
  status: InvoiceStatus;

  // Detail-panel only fields
  billFrom: {
    name: string;
    email: string;
    address: string;
    phone: string;
  };
  billTo: {
    name: string;
    email: string;
    address: string;
    phone: string;
  };
  items: PackageItem[];
  taxPercent: number;
  fee: number;
  note: string;
}