"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { FiSearch, FiSliders, FiPlus, FiFileText, FiChevronUp, FiChevronDown, FiChevronsUp, FiCheckCircle, FiTrash2, FiX } from "react-icons/fi";
import { Invoice, InvoiceStatus } from "@/types/invoice";
import StatusBadge from "./StatusBadge";
import Image from "next/image";

const columnHelper = createColumnHelper<Invoice>();

interface InvoiceTableProps {
  invoices: Invoice[];
  selectedId: string | null;
  onSelect: (invoice: Invoice) => void;
  onNewInvoice?: () => void;
  onBulkMarkPaid?: (ids: string[]) => void;
  onBulkDelete?: (ids: string[]) => void;
}

const STATUS_OPTIONS: InvoiceStatus[] = ["Paid", "Unpaid", "Pending", "Overdue"];

// Sort arrow: notun column add korle SortIcon ta reuse kora jabe, alada kore
// kichu likhte hobe na.
function SortIcon({ sorted }: { sorted: false | "asc" | "desc" }) {
  if (sorted === "asc") return <FiChevronUp className="h-3 w-3" />;
  if (sorted === "desc") return <FiChevronDown className="h-3 w-3" />;
  return <FiChevronsUp className="h-3 w-3 opacity-30" />;
}

export default function InvoiceTable({
  invoices,
  selectedId,
  onSelect,
  onNewInvoice,
  onBulkMarkPaid,
  onBulkDelete,
}: InvoiceTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const activeStatusFilter = (columnFilters.find((f) => f.id === "status")?.value as string) ?? null;

  // Filter dropdown er baire click korle bondho hoye jabe
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const applyStatusFilter = (status: InvoiceStatus | null) => {
    setColumnFilters(status ? [{ id: "status", value: status }] : []);
    setIsFilterOpen(false);
  };

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-neutral-300 accent-violet-600"
            checked={table.getIsAllRowsSelected()}
            ref={(el) => {
              if (el) el.indeterminate = table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected();
            }}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-neutral-300 accent-violet-600"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            onClick={(e) => e.stopPropagation()}
          />
        ),
      }),
      columnHelper.accessor("id", {
        header: "Invoice ID",
        cell: (info) => (
          <span className="inline-flex items-center gap-1.5 font-medium  text-[#856DF3]">
            {info.getValue()}
            <span className="bg-[#F0F0F0] w-5 h-5 flex items-center justify-center text-[#333] rounded-lg"><FiFileText className="h-3 w-3" /></span>

          </span>
        ),
      }),
      columnHelper.accessor("company", {
        header: "Company",
        cell: (info) => {
          const invoice = info.row.original;
          return (
            <span className="inline-flex justify-center items-center gap-2">
              <Image
                src={invoice.CompanyLogo}
                alt={invoice.company}
                width={40}
                height={40}
              />
              <span>{invoice.company}</span>
            </span>
          );
        },
      }),
      columnHelper.accessor("shippingId", {
        header: "Shipping ID",
        cell: (info) => <span className="text-neutral-500">#{info.getValue()}</span>,
      }),
      columnHelper.accessor("issueDate", {
        header: "Date",
        cell: (info) => {
          const invoice = info.row.original;
          return (
            <span className="text-neutral-500">
              {invoice.issueDate} <span className="text-neutral-400">(Issued)</span>
              <br />
              {invoice.dueDate} <span className="text-neutral-400">(Due)</span>
            </span>
          );
        },
      }),
      columnHelper.accessor("amount", {
        header: "Amount",
        cell: (info) => <span className="font-medium text-neutral-800">${info.getValue().toLocaleString()}.00</span>,
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => <StatusBadge status={info.getValue()} />,
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true;
          return row.getValue(columnId) === filterValue;
        },
      }),
    ],
    []
  );

  const table = useReactTable({
    data: invoices,
    columns,
    state: { sorting, globalFilter, rowSelection, columnFilters },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const selectedIds = Object.keys(rowSelection).filter((id) => rowSelection[id]);

  return (
    <div className="flex h-full flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 border-b border-neutral-100 px-5 py-4">
        <h2 className="text-lg font-semibold text-neutral-900">Invoices</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search invoices"
              className="w-48 rounded-lg border border-neutral-200 bg-neutral-50 py-2 pl-9 pr-3 text-sm text-neutral-700 outline-none focus:border-violet-400 focus:bg-white"
            />
          </div>

          {/* Filter dropdown */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen((prev) => !prev)}
              className={`relative rounded-lg border p-2 ${
                activeStatusFilter
                  ? "border-violet-300 bg-violet-50 text-violet-600"
                  : "border-neutral-200 text-neutral-500 hover:bg-neutral-50"
              }`}
            >
              <FiSliders className="h-4 w-4" />
              {activeStatusFilter && (
                <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-violet-500" />
              )}
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 top-full z-10 mt-2 w-44 rounded-xl border border-neutral-100 bg-white p-1.5 shadow-lg">
                <p className="px-2 py-1.5 text-[11px] font-medium uppercase tracking-wide text-neutral-400">
                  Filter by Status
                </p>
                <button
                  onClick={() => applyStatusFilter(null)}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-sm ${
                    !activeStatusFilter ? "bg-neutral-100 font-medium text-neutral-900" : "text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  All
                </button>
                {STATUS_OPTIONS.map((status) => (
                  <button
                    key={status}
                    onClick={() => applyStatusFilter(status)}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-sm ${
                      activeStatusFilter === status
                        ? "bg-neutral-100 font-medium text-neutral-900"
                        : "text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onNewInvoice}
            className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            <FiPlus className="h-4 w-4" />
            New Invoice
          </button>
        </div>
      </div>

      {/* Active filter chip */}
      {activeStatusFilter && (
        <div className="flex items-center gap-2 border-b border-neutral-100 px-5 py-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-600">
            Status: {activeStatusFilter}
            <button onClick={() => applyStatusFilter(null)} className="hover:text-violet-800">
              <FiX className="h-3 w-3" />
            </button>
          </span>
        </div>
      )}

      {/* Bulk action bar — jokhon 1+ row select kora hoy tokhon dekhabe, na hole render e jabe na */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between border-b border-violet-100 bg-[#F4F2FC] px-5 py-2.5 text-sm">
          <span className="font-medium text-neutral-700">{selectedIds.length} selected</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onBulkMarkPaid?.(selectedIds);
                setRowSelection({});
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
            >
              <FiCheckCircle className="h-3.5 w-3.5" />
              Mark as Paid
            </button>
            <button
              onClick={() => {
                onBulkDelete?.(selectedIds);
                setRowSelection({});
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
            >
              <FiTrash2 className="h-3.5 w-3.5" />
              Delete
            </button>
            <button
              onClick={() => setRowSelection({})}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-neutral-400 hover:text-neutral-600"
            >
              <FiX className="h-3.5 w-3.5" />
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 bg-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-neutral-100">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-2 py-2 text-left text-xs font-medium text-neutral-400 first:pl-5 last:pr-5"
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <button
                        className="inline-flex items-center gap-1 hover:text-neutral-600"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <SortIcon sorted={header.column.getIsSorted()} />
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              const isSelected = row.original.id === selectedId;
              return (
                <tr
                  key={row.id}
                  onClick={() => onSelect(row.original)}
                  className={`cursor-pointer  transition-colors ${isSelected ? "bg-[#F4F2FC] border border-[#E0E0E0]" : "hover:bg-neutral-50 border-b border-neutral-50"
                    }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-3 text-[10px] align-top first:pl-5 last:pr-5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              );
            })}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-5 py-10 text-center text-sm text-neutral-400">
                  No invoices match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}