import { FreightMode } from "@/types/warehouse";
import { ActivityEntry } from "@/types/activityLog";

export const ACTIVITY_LOG_DATA: Record<FreightMode, ActivityEntry[]> = {
  road: [
    {
      id: "1",
      actorName: "Leo Fernandez",
      actionText: "confirmed receipt of 40 units of Winter Jacket Series in Section B3 (Apparel)",
      timestamp: "01:45 PM",
      type: "received",
    },
    {
      id: "2",
      actorName: "Ava Martinez",
      actionText: "added 25 units of Smart Router Kit to Section A1 (Electronics)",
      timestamp: "09:15 AM",
      type: "added",
    },
    {
      id: "3",
      actorName: "Oscar Liem",
      actionText: "dispatched 18 units of Stainless Steel Cookware Set from Section C5 (Home & Kitchen)",
      timestamp: "05:30 PM",
      type: "dispatched",
    },
    {
      id: "4",
      actorName: "Dina Choi",
      actionText: "created a shipment entry for Brake Pad Sets in Section D2 (Automotive Parts)",
      timestamp: "04:10 PM",
      type: "created",
    },
  ],

  rail: [
    {
      id: "1",
      actorName: "Marco Silva",
      actionText: "confirmed receipt of 60 units of Steel Coils in Section R12 (Raw Materials)",
      timestamp: "11:20 AM",
      type: "received",
    },
    {
      id: "2",
      actorName: "Priya Nair",
      actionText: "added 35 units of Diesel Engine Parts to Section R24 (Machinery)",
      timestamp: "08:05 AM",
      type: "added",
    },
    {
      id: "3",
      actorName: "Tomas Nowak",
      actionText: "dispatched 22 units of Grain Sacks from Section R31 (Food & Grain)",
      timestamp: "06:45 PM",
      type: "dispatched",
    },
  ],

  ocean: [
    {
      id: "1",
      actorName: "Helena Cruz",
      actionText: "confirmed receipt of 120 units of Container Fittings in Section O9 (Furniture)",
      timestamp: "02:30 PM",
      type: "received",
    },
    {
      id: "2",
      actorName: "Ben Osei",
      actionText: "added 80 units of Marine Electronics to Section O3 (Electronics)",
      timestamp: "10:00 AM",
      type: "added",
    },
    {
      id: "3",
      actorName: "Yuki Tanaka",
      actionText: "dispatched 45 units of Textile Rolls from Section O17 (Apparel)",
      timestamp: "07:15 PM",
      type: "dispatched",
    },
    {
      id: "4",
      actorName: "Carlos Mendez",
      actionText: "created a shipment entry for Industrial Motors in Section O28 (Machinery)",
      timestamp: "03:50 PM",
      type: "created",
    },
  ],

  air: [
    {
      id: "1",
      actorName: "Sara Lindqvist",
      actionText: "confirmed receipt of 15 units of Vaccine Coolers in Section F2 (Pharma)",
      timestamp: "09:40 AM",
      type: "received",
    },
    {
      id: "2",
      actorName: "Ravi Chandran",
      actionText: "added 10 units of Server Modules to Section F1 (Electronics)",
      timestamp: "07:00 AM",
      type: "added",
    },
    {
      id: "3",
      actorName: "Nina Petrov",
      actionText: "dispatched 6 units of Legal Document Cases from Section F21 (Documents)",
      timestamp: "01:10 PM",
      type: "dispatched",
    },
  ],
};