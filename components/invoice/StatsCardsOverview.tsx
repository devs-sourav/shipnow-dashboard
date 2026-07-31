"use client";

import { useMemo } from "react";
import { BadgeCheck, BadgeX, CircleDashed, Clock3 } from "lucide-react";
import StatCard from "./StatCard";
import { Invoice, InvoiceStatus, StatCardType } from "@/types/invoice";

interface Props {
  invoices: Invoice[];
}

// Status er shathe title + icon mapping. Notun status add korle
// shudhu ei config e entry add korle e hobe.
const STATUS_CONFIG: Record<InvoiceStatus, { title: string; icon: StatCardType["icon"] }> = {
  Paid: { title: "Paid Invoices", icon: BadgeCheck },
  Unpaid: { title: "Unpaid Invoices", icon: BadgeX },
  Pending: { title: "Pending Invoices", icon: CircleDashed },
  Overdue: { title: "Overdue Invoices", icon: Clock3 },
};

const formatAmount = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export default function StatsCardsOverview({ invoices }: Props) {
  const stats: StatCardType[] = useMemo(() => {
    const totals: Record<InvoiceStatus, { amount: number; count: number }> = {
      Paid: { amount: 0, count: 0 },
      Unpaid: { amount: 0, count: 0 },
      Pending: { amount: 0, count: 0 },
      Overdue: { amount: 0, count: 0 },
    };

    invoices.forEach((inv) => {
      totals[inv.status].amount += inv.amount;
      totals[inv.status].count += 1;
    });

    return (Object.keys(STATUS_CONFIG) as InvoiceStatus[]).map((status) => ({
      id: status.toLowerCase(),
      title: STATUS_CONFIG[status].title,
      amount: formatAmount(totals[status].amount),
      invoices: totals[status].count,
      icon: STATUS_CONFIG[status].icon,
    }));
  }, [invoices]);

  return (
    <section className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <StatCard key={item.id} item={item} />
      ))}
    </section>
  );
}