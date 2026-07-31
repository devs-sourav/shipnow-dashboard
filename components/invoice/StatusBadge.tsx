import { InvoiceStatus } from "@/types/invoice";

// Notun status add korte hole shudhu ei map e ekta entry add korle e hobe,
// baki kothao kichu change korte hobe na.
const STATUS_STYLES: Record<InvoiceStatus, string> = {
  Paid: "bg-emerald-100 text-black",
  Unpaid: "bg-violet-100 text-black",
  Overdue: "bg-red-50 text-black",
  Pending:"bg-yellow-50 text-black"
};

export default function StatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}