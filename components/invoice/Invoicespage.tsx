"use client";

import { useState } from "react";
import { invoices as mockInvoices } from "@/data/invoices";
import { Invoice } from "@/types/invoice";
import InvoiceTable from "./Invoicetable";
import InvoiceDetails from "./Invoicedetails";
import InvoiceEditModal from "./InvoiceEditModal";
import StatsCardsOverview from "./StatsCardsOverview";
import Toast from "./Toast";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [selected, setSelected] = useState<Invoice | null>(mockInvoices[0] ?? null);
  const [modal, setModal] = useState<{ mode: "edit" | "new"; invoice: Invoice | null } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => setToast(msg);

  const handleSave = (invoice: Invoice) => {
    if (modal?.mode === "new") {
      const nextNum = invoices.length + 1001;
      const newInvoice = { ...invoice, id: `INV-${nextNum}` };
      setInvoices((prev) => [newInvoice, ...prev]);
      setSelected(newInvoice);
      showToast("Invoice created successfully");
    } else {
      setInvoices((prev) => prev.map((inv) => (inv.id === invoice.id ? invoice : inv)));
      setSelected(invoice);
      showToast("Invoice updated successfully");
    }
    setModal(null);
  };

  const handleHold = (invoice: Invoice) => {
    const updated = { ...invoice, status: "Pending" as const };
    setInvoices((prev) => prev.map((inv) => (inv.id === invoice.id ? updated : inv)));
    setSelected(updated);
    showToast(`Invoice ${invoice.id} put on hold`);
  };

  const handleSend = (invoice: Invoice) => {
    const updated = { ...invoice, status: "Unpaid" as const };
    setInvoices((prev) => prev.map((inv) => (inv.id === invoice.id ? updated : inv)));
    setSelected(updated);
    showToast(`Invoice sent to ${invoice.billTo.name}`);
  };

  const handleBulkMarkPaid = (ids: string[]) => {
    setInvoices((prev) => prev.map((inv) => (ids.includes(inv.id) ? { ...inv, status: "Paid" } : inv)));
    showToast(`${ids.length} invoice(s) marked as Paid`);
  };

  const handleBulkDelete = (ids: string[]) => {
    setInvoices((prev) => prev.filter((inv) => !ids.includes(inv.id)));
    if (selected && ids.includes(selected.id)) setSelected(null);
    showToast(`${ids.length} invoice(s) deleted`);
  };

  return (
    <div className="space-y-4">
      <StatsCardsOverview invoices={invoices} />

      <div className="grid grid-cols-12 gap-4">
        <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white col-span-7">
          <InvoiceTable
            invoices={invoices}
            selectedId={selected?.id ?? null}
            onSelect={setSelected}
            onNewInvoice={() => setModal({ mode: "new", invoice: null })}
            onBulkMarkPaid={handleBulkMarkPaid}
            onBulkDelete={handleBulkDelete}
          />
        </div>
        <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white col-span-5">
          <InvoiceDetails
            invoice={selected}
            onEdit={(inv) => setModal({ mode: "edit", invoice: inv })}
            onHold={handleHold}
            onSend={handleSend}
          />
        </div>

        {modal && (
          <InvoiceEditModal
            mode={modal.mode}
            invoice={modal.invoice}
            onClose={() => setModal(null)}
            onSave={handleSave}
          />
        )}

        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </div>
    </div>
  );
}