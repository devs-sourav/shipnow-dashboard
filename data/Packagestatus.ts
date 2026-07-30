import { FreightMode } from "@/types/warehouse";
import { PackageItem } from "@/types/packageStatus";

export const PACKAGE_STATUS_DATA: Record<FreightMode, PackageItem[]> = {
  road: [
    { id: "PKG-HK77420", date: "March 20, 2035 - 05:30 PM", status: "Sent" },
    { id: "PKG-A50812", date: "March 21, 2035 - 01:45 PM", status: "Received" },
    { id: "PKG-E10293", date: "March 22, 2035 - 09:00 AM", status: "Expected" },
    { id: "PKG-B33107", date: "March 23, 2035 - 11:20 AM", status: "Expected" },
  ],

  rail: [
    { id: "PKG-RM88213", date: "March 18, 2035 - 02:10 PM", status: "Received" },
    { id: "PKG-RG44190", date: "March 19, 2035 - 07:00 AM", status: "Sent" },
    { id: "PKG-RC70021", date: "March 21, 2035 - 03:45 PM", status: "Expected" },
  ],

  ocean: [
    { id: "PKG-OA65310", date: "March 15, 2035 - 10:00 AM", status: "Sent" },
    { id: "PKG-OB20144", date: "March 17, 2035 - 06:30 PM", status: "Sent" },
    { id: "PKG-OU99871", date: "March 20, 2035 - 12:15 PM", status: "Received" },
    { id: "PKG-OM40562", date: "March 22, 2035 - 08:40 AM", status: "Expected" },
  ],

  air: [
    { id: "PKG-FA10938", date: "March 24, 2035 - 04:00 PM", status: "Received" },
    { id: "PKG-FP55627", date: "March 24, 2035 - 09:15 PM", status: "Sent" },
    { id: "PKG-FO88410", date: "March 25, 2035 - 07:30 AM", status: "Expected" },
  ],
};