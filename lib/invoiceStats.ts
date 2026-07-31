import { BadgeCheck, BadgeX, CircleDashed, Clock3 } from "lucide-react";
import { Invoice, StatCardType } from "@/types/invoice";

// Ekhane shob status er jonno icon + color mapping thake. Notun status
// add korle shudhu ei config e entry barale hobe.
const STATUS_CONFIG = {
  Paid: { title: "Paid Invoices", icon: BadgeCheck },
  Unpaid: { title: "Unpaid Invoices", icon: BadgeX },
  Pending: { title: "Pending Invoices", icon: CircleDashed },
  Overdue: { title: "Overdue Invoices", icon: Clock3 },
} as const;

// invoices array theke sob status er total amount + count ber kore.
// Notun invoice add/edit/delete korle just ei function abar call korle
// updated stats paoa jabe — kono hardcoded data lage na.
export function computeInvoiceStats(invoices: Invoice[]): StatCardType[] {
  return (Object.keys(STATUS_CONFIG) as (keyof typeof STATUS_CONFIG)[]).map((status) => {
    const matching = invoices.filter((inv) => inv.status === status);
    const totalAmount = matching.reduce((sum, inv) => sum + inv.amount, 0);

    return {
      id: status.toLowerCase(),
      title: STATUS_CONFIG[status].title,
      amount: `$${totalAmount.toLocaleString()}`,
      invoices: matching.length,
      icon: STATUS_CONFIG[status].icon,
    };
  });
}