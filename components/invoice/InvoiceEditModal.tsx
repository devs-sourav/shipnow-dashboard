"use client";

import { useEffect, useState } from "react";
import { FiX, FiPlus, FiTrash2, FiCheckCircle, FiClock, FiAlertCircle, FiXCircle } from "react-icons/fi";
import { Invoice, InvoiceItem, InvoiceParty, InvoiceStatus } from "@/types/invoice";

interface InvoiceEditModalProps {
  mode: "edit" | "new";
  invoice: Invoice | null; // null hobe mode "new" hole
  onClose: () => void;
  onSave: (invoice: Invoice) => void;
}

const emptyParty: InvoiceParty = { name: "", email: "", address: "", phone: "" };

const emptyItem = (): InvoiceItem => ({
  id: crypto.randomUUID(),
  description: "",
  shipmentType: "",
  shipmentSubtype: "",
  price: 0,
  qty: 1,
});

function makeEmptyInvoice(): Invoice {
  return {
    id: "", // parent generate korbe save korar somoy
    company: "",
    CompanyLogo: "/assets/logo/1.svg",
    companyIconColor: "bg-neutral-900",
    shippingId: "",
    issueDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    dueDate: "",
    amount: 0,
    status: "Pending",
    billFrom: { ...emptyParty },
    billTo: { ...emptyParty },
    items: [emptyItem()],
    taxPercent: 8,
    fee: 0,
    note: "",
  };
}

// Status option gula er icon + color ekhane centralized. Notun status add
// korle shudhu ei array te add korle UI automatically update hoye jabe.
const STATUS_CONFIG: Record<InvoiceStatus, { icon: React.ComponentType<{ className?: string }>; activeClass: string }> = {
  Paid: { icon: FiCheckCircle, activeClass: "border-emerald-500 bg-emerald-50 text-emerald-600" },
  Unpaid: { icon: FiXCircle, activeClass: "border-red-500 bg-red-50 text-red-600" },
  Pending: { icon: FiClock, activeClass: "border-amber-500 bg-amber-50 text-amber-600" },
  Overdue: { icon: FiAlertCircle, activeClass: "border-orange-500 bg-orange-50 text-orange-600" },
};

const STATUS_LIST: InvoiceStatus[] = ["Paid", "Unpaid", "Pending", "Overdue"];

export default function InvoiceEditModal({ mode, invoice, onClose, onSave }: InvoiceEditModalProps) {
  const [form, setForm] = useState<Invoice>(invoice ? structuredClone(invoice) : makeEmptyInvoice());
  const [errors, setErrors] = useState<string | null>(null);

  // Animation state — mount hobar por ekta frame wait kore "visible" true kori
  // jate CSS transition trigger hoy. Close korar somoy age animate-out kori,
  // tarpor actual onClose call kori.
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 180);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const updateParty = (which: "billFrom" | "billTo", field: keyof InvoiceParty, value: string) => {
    setForm((prev) => ({ ...prev, [which]: { ...prev[which], [field]: value } }));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const addItem = () => setForm((prev) => ({ ...prev, items: [...prev.items, emptyItem()] }));

  const removeItem = (id: string) =>
    setForm((prev) => ({ ...prev, items: prev.items.filter((item) => item.id !== id) }));

  const subTotal = form.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = (subTotal * form.taxPercent) / 100;
  const total = subTotal + tax + form.fee;

  const handleSubmit = () => {
    if (!form.company.trim() || !form.billTo.name.trim()) {
      setErrors("Company name and Bill To name required");
      return;
    }
    if (form.items.length === 0) {
      setErrors("At least 1 item lagbe");
      return;
    }
    setErrors(null);
    onSave({ ...form, amount: total });
  };

  const showAnimated = visible && !closing;

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px] transition-opacity duration-200 ease-out ${
        showAnimated ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`flex max-h-[90vh] w-[80%] lg:w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl transition-all duration-200 ease-out ${
          showAnimated ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-[0.97] opacity-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-2xl border-b border-neutral-100 bg-white px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">
              {mode === "new" ? "Create New Invoice" : `Edit Invoice`}
            </h2>
            {mode === "edit" && (
              <p className="text-xs text-neutral-400">
                <span className="font-medium text-violet-500">#{form.id}</span>
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-auto px-6 py-5 space-y-6">
          {errors && (
            <div className="flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600 animate-in fade-in slide-in-from-top-1">
              <FiAlertCircle className="h-3.5 w-3.5 shrink-0" />
              {errors}
            </div>
          )}

          {/* Status selector */}
          <div>
            <label className="text-xs font-medium text-neutral-400">Invoice Status</label>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {STATUS_LIST.map((status) => {
                const config = STATUS_CONFIG[status];
                const Icon = config.icon;
                const isActive = form.status === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setForm({ ...form, status })}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-xs font-medium transition-all duration-150 ${
                      isActive
                        ? config.activeClass + " shadow-sm scale-[1.02]"
                        : "border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:bg-neutral-50"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {status}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Company + dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-neutral-400">Company Name</label>
              <input
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none transition-colors focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-400">Shipping ID</label>
              <input
                value={form.shippingId}
                onChange={(e) => setForm({ ...form, shippingId: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none transition-colors focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-400">Issue Date</label>
              <input
                value={form.issueDate}
                onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none transition-colors focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-400">Due Date</label>
              <input
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none transition-colors focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>
          </div>

          {/* Bill from / to */}
          <div className="grid grid-cols-2 gap-4 rounded-xl bg-[#F5F5F5] p-4">
            {(["billFrom", "billTo"] as const).map((which) => (
              <div key={which} className="space-y-2">
                <p className="text-xs font-semibold text-neutral-500">
                  {which === "billFrom" ? "Bill From" : "Bill To"}
                </p>
                <input
                  placeholder="Name"
                  value={form[which].name}
                  onChange={(e) => updateParty(which, "name", e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs outline-none transition-colors focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
                <input
                  placeholder="Email"
                  value={form[which].email}
                  onChange={(e) => updateParty(which, "email", e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs outline-none transition-colors focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
                <input
                  placeholder="Address"
                  value={form[which].address}
                  onChange={(e) => updateParty(which, "address", e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs outline-none transition-colors focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
                <input
                  placeholder="Phone"
                  value={form[which].phone}
                  onChange={(e) => updateParty(which, "phone", e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs outline-none transition-colors focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
              </div>
            ))}
          </div>

          {/* Items */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-neutral-900">Items</p>
              <button
                onClick={addItem}
                className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                <FiPlus className="h-3 w-3" /> Add Item
              </button>
            </div>
            <div className="space-y-2">
              {form.items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 items-center gap-2 rounded-lg border border-neutral-100 p-2 transition-colors hover:border-neutral-200"
                >
                  <input
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    className="col-span-4 rounded-md border border-neutral-200 px-2 py-1.5 text-xs outline-none focus:border-violet-400"
                  />
                  <input
                    placeholder="Shipment Type"
                    value={item.shipmentType}
                    onChange={(e) => updateItem(item.id, "shipmentType", e.target.value)}
                    className="col-span-3 rounded-md border border-neutral-200 px-2 py-1.5 text-xs outline-none focus:border-violet-400"
                  />
                  <input
                    placeholder="Subtype"
                    value={item.shipmentSubtype}
                    onChange={(e) => updateItem(item.id, "shipmentSubtype", e.target.value)}
                    className="col-span-2 rounded-md border border-neutral-200 px-2 py-1.5 text-xs outline-none focus:border-violet-400"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) => updateItem(item.id, "price", Number(e.target.value))}
                    className="col-span-1 rounded-md border border-neutral-200 px-2 py-1.5 text-xs outline-none focus:border-violet-400"
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    value={item.qty}
                    onChange={(e) => updateItem(item.id, "qty", Number(e.target.value))}
                    className="col-span-1 rounded-md border border-neutral-200 px-2 py-1.5 text-xs outline-none focus:border-violet-400"
                  />
                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={form.items.length === 1}
                    className="col-span-1 flex justify-center text-neutral-400 transition-colors hover:text-red-500 disabled:opacity-30"
                  >
                    <FiTrash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tax / Fee / Note */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-neutral-400">Tax %</label>
              <input
                type="number"
                value={form.taxPercent}
                onChange={(e) => setForm({ ...form, taxPercent: Number(e.target.value) })}
                className="mt-1.5 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-400">Fee</label>
              <input
                type="number"
                value={form.fee}
                onChange={(e) => setForm({ ...form, fee: Number(e.target.value) })}
                className="mt-1.5 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>
            <div className="flex flex-col justify-end rounded-lg bg-neutral-50 px-3 py-2 text-right text-xs text-neutral-500">
              <span>Subtotal: ${subTotal.toFixed(2)}</span>
              <span>Tax: ${tax.toFixed(2)}</span>
              <span className="font-semibold text-neutral-900">Total: ${total.toFixed(2)}</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-400">Note</label>
            <textarea
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              rows={2}
              className="mt-1.5 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 rounded-b-2xl border-t border-neutral-100 bg-white px-6 py-4">
          <button
            onClick={handleClose}
            className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 active:scale-[0.98]"
          >
            {mode === "new" ? "Create Invoice" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}