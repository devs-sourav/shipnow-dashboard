"use client";

import StatCard from "./StatCard";
import { invoiceStats } from "@/data/invoices";

export default function StatsCardsOverview() {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
      {invoiceStats.map((item) => (
        <StatCard key={item.id} item={item} />
      ))}
    </section>
  );
}