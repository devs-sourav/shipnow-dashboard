"use client";

import { FiEdit2, FiPause, FiSend, FiChevronUp, FiChevronDown, FiChevronLeft } from "react-icons/fi";
import { Invoice } from "@/types/invoice";
import StatusBadge from "./StatusBadge";

interface InvoiceDetailsProps {
  invoice: Invoice | null;
  onEdit?: (invoice: Invoice) => void;
  onHold?: (invoice: Invoice) => void;
  onSend?: (invoice: Invoice) => void;
  onBack?: () => void; // mobile e list e ferot jaoar jonno (back chevron)
}

// Shob calculation ekhane centralized. Item add/remove korle ei function
// automatically notun total dibe, alada kore kothao update korte hobe na.
function calculateTotals(invoice: Invoice) {
  const subTotal = invoice.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = (subTotal * invoice.taxPercent) / 100;
  const total = subTotal + tax + invoice.fee;
  return { subTotal, tax, total };
}

// Header er pashe static sort icon (design-match korar jonno). Kono sorting
// logic attach kora hoyni ekhane — InvoiceTable e already ache oitar jonno.
function SortIcon() {
  return (
    <span className="inline-flex flex-col -space-y-1 text-neutral-300">
      <FiChevronUp className="h-3 w-3" />
      <FiChevronDown className="h-3 w-3" />
    </span>
  );
}

export default function InvoiceDetails({ invoice, onEdit, onHold, onSend, onBack }: InvoiceDetailsProps) {
  if (!invoice) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-neutral-400">
        Select an invoice to see details
      </div>
    );
  }

  const { subTotal, tax, total } = calculateTotals(invoice);

  return (
    <div className="flex h-full flex-col">
      {/* Header — mobile e back chevron + title, action button gulo bottom bar e move kora */}
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="-ml-1 rounded-lg p-1 text-neutral-600 hover:bg-neutral-50 sm:hidden"
            aria-label="Back"
          >
            <FiChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-semibold text-neutral-900">Invoice Details</h2>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <button
            onClick={() => onEdit?.(invoice)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            <FiEdit2 className="h-3.5 w-3.5" />
            Edit
          </button>
          <button
            onClick={() => onHold?.(invoice)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            <FiPause className="h-3.5 w-3.5" />
            Hold
          </button>
          <button
            onClick={() => onSend?.(invoice)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            <FiSend className="h-3.5 w-3.5" />
            Send Invoice
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-4 py-5 sm:px-6">
        {/* Invoice number + dates */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-neutral-400">
              Invoice <span className="font-semibold text-violet-500">#{invoice.id}</span>
            </p>
            <div className="mt-2">
              <StatusBadge status={invoice.status} />
            </div>
          </div>
          <div className="text-right text-sm text-neutral-500">
            <p>
              Issue Date <span className="ml-1 font-medium text-neutral-800">{invoice.issueDate}</span>
            </p>
            <p className="mt-0.5">
              Due Date <span className="ml-1 font-medium text-neutral-800">{invoice.dueDate}</span>
            </p>
          </div>
        </div>

        {/* Bill from / to — mobile e ek column e stack, sm+ e 2 column grid */}
        <div className="mt-5 grid grid-cols-1 gap-4 rounded-xl bg-[#F5F5F5] p-5 sm:grid-cols-2">
          <div>
            <p className="text-xs text-neutral-400">Bill From</p>
            <p className="mt-1.5 font-semibold text-base text-neutral-900">{invoice.billFrom.name}</p>
            <p className="text-[12px] text-[#757575]">{invoice.billFrom.email}</p>
            <p className="mt-1.5 text-[12px] leading-5  text-[#757575]">{invoice.billFrom.address}</p>
            <p className="text-xs text-[11px] text-[#757575]">{invoice.billFrom.phone}</p>
          </div>

          {/* Mobile-only divider — sm+ e grid nijei column split kore dey, tai eta lage na */}
          <div className="border-t border-neutral-200 sm:hidden" />

          <div className="sm:text-right">
            <p className="text-xs text-neutral-400">Bill To</p>
            <p className="mt-1.5 font-semibold text-base text-neutral-900 sm:text-sm sm:font-normal">{invoice.billTo.name}</p>
            <p className="text-[12px] text-[#757575] sm:text-sm sm:text-neutral-500">{invoice.billTo.email}</p>
            <p className="mt-1.5 text-[12px] leading-5 text-[#757575]">{invoice.billTo.address}</p>
            <p className="text-xs text-[11px] text-[#757575]">{invoice.billTo.phone}</p>
          </div>
        </div>

            <h3 className="text-sm font-semibold text-neutral-900 mt-6">Package Summary</h3>
        {/* Package summary */}
        <div className="border mt-3 border-[#E0E0E0] rounded-2xl">
          <div className="" >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E0E0E0] rouneded-2xl bg-[#F0F0F0] rounded-2xl text-left text-xs text-[#333333]">
                    <th className="py-2.5 pl-3 font-medium">
                      <span className="inline-flex items-center gap-1">
                        Description
                        <SortIcon />
                      </span>
                    </th>
                    <th className="py-2.5 font-medium">
                      <span className="inline-flex items-center gap-1">
                        Shipment Type
                        <SortIcon />
                      </span>
                    </th>
                    {/* Price o Qty column mobile e hide kore Description er niche merge kora hoyeche */}
                    <th className="hidden py-2.5 text-right font-medium sm:table-cell">
                      <span className="inline-flex items-center gap-1">
                        Price
                        <SortIcon />
                      </span>
                    </th>
                    <th className="hidden py-2.5 text-right font-medium sm:table-cell">
                      <span className="inline-flex items-center gap-1">
                        Qty
                        <SortIcon />
                      </span>
                    </th>
                    <th className="py-2.5 pr-3 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id} className="border-b border-b-[#E0E0E0] text-[11px]">
                      <td className="py-3 pl-3 text-neutral-800">
                        {item.description}
                        {/* Mobile e price x qty ekhanei dekhabe, alada column lagbe na */}
                        <p className="mt-0.5 text-[10px] text-violet-500 sm:hidden">
                          ${item.price.toFixed(2)} x {item.qty}
                        </p>
                      </td>
                      <td className="py-3">
                        <p className="font-medium text-neutral-800">{item.shipmentType}</p>
                        <p className="text-[10px] text-neutral-400">{item.shipmentSubtype}</p>
                      </td>
                      <td className="hidden py-3 text-right text-neutral-500 sm:table-cell">${item.price.toFixed(2)}</td>
                      <td className="hidden py-3 text-right text-neutral-500 sm:table-cell">{item.qty}</td>
                      <td className="py-3 pr-3 text-right font-medium text-neutral-800">
                        ${(item.price * item.qty).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals — mobile e full width, sm+ e right-aligned fixed width */}
            <div className="ml-auto mt-4 w-full px-3 space-y-2 text-xs pb-4 sm:w-60 sm:pr-3">
              <div className="flex justify-between text-neutral-500">
                <span>Sub Total</span>
                <span>${subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Tax ({invoice.taxPercent}%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Fee</span>
                <span>${invoice.fee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-[#E0E0E0] pt-2 font-semibold text-neutral-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Note */}
      <div className="border-t border-[#E0E0E0] px-4 py-4 sm:px-6">
        <p className="text-xs font-medium text-neutral-400">Note</p>
        <p className="mt-1 text-sm text-neutral-500">{invoice.note}</p>
      </div>

      {/* Bottom action bar — mobile e only, desktop e header e already ache */}
      <div className="flex items-center gap-2 border-t border-neutral-100 px-4 py-3 sm:hidden">
        <button
          onClick={() => onEdit?.(invoice)}
          className="flex-1 rounded-lg bg-neutral-100 px-3 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-200"
        >
          Edit
        </button>
        <button
          onClick={() => onHold?.(invoice)}
          className="flex-1 rounded-lg bg-neutral-100 px-3 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-200"
        >
          Hold
        </button>
        <button
          onClick={() => onSend?.(invoice)}
          className="flex-[1.6] inline-flex items-center justify-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-3 text-sm font-medium text-white hover:bg-neutral-800"
        >
          <FiSend className="h-3.5 w-3.5 hidden sm:inline-block" />
          Send Invoice
        </button>
      </div>
    </div>
  );
}