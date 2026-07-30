"use client";

import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  createColumnHelper,
  flexRender,
  SortingState,
} from "@tanstack/react-table";
import { ChevronDown, Filter, ArrowUpDown, MoreHorizontal } from "lucide-react";
import { FreightMode } from "@/types/warehouse";
import { StorageRow } from "@/types/storage";
import { STORAGE_DATA } from "@/data/Storage";

interface Props {
  mode: FreightMode;
}

const columnHelper = createColumnHelper<StorageRow>();

const columns = [
  columnHelper.accessor("floor", {
    header: "Floor",
    cell: (info) => <span className="text-[#262626]">{info.getValue()}</span>,
  }),
  columnHelper.accessor("section", {
    header: "Section",
    cell: (info) => <span className="text-[#262626]">{info.getValue()}</span>,
  }),
  columnHelper.accessor("category", {
    header: "Category",
    cell: (info) => <span className="text-[#262626]">{info.getValue()}</span>,
  }),
  // Combined bar + percentage column — this is the ONLY storage column shown
  // on mobile (matches Image 1). On desktop it's hidden in favor of the two
  // separate columns below (matches Image 2).
  columnHelper.accessor("percentage", {
    id: "storageUsedCombined",
    header: "Storage Used",
    cell: (info) => (
      <div className="flex flex-col gap-1.5">
        <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-100 sm:w-36">
          <div
            className="h-full rounded-full bg-[#8B7CF6]"
            style={{ width: `${info.getValue()}%` }}
          />
        </div>
        <span className="text-xs font-medium text-[#262626]">
          {info.getValue()}%{" "}
          <span className="font-normal text-gray-400">
            &middot; {info.row.original.availableSpace}/
            {info.row.original.totalSpace}
          </span>
        </span>
      </div>
    ),
  }),
  // Desktop-only: bar alone
  columnHelper.accessor("percentage", {
    id: "storageUsed",
    header: "Storage Used",
    cell: (info) => (
      <div className="h-2 w-40 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-[#8B7CF6]"
          style={{ width: `${info.getValue()}%` }}
        />
      </div>
    ),
  }),
  // Desktop-only: percentage label
  columnHelper.accessor("percentage", {
    id: "percentageLabel",
    header: "Percentage",
    cell: (info) => (
      <span className="font-medium text-[#262626]">{info.getValue()}%</span>
    ),
  }),
  // Desktop-only: available space
  columnHelper.accessor("availableSpace", {
    id: "availableSpace",
    header: "Available Space",
    cell: (info) => (
      <span>
        <span className="font-semibold text-[#262626]">
          {info.getValue()}
        </span>
        <span className="text-gray-400">/{info.row.original.totalSpace}</span>
      </span>
    ),
  }),
];

// Columns hidden on mobile (desktop only)
const DESKTOP_ONLY_IDS = new Set(["storageUsed", "percentageLabel", "availableSpace"]);
// Column hidden on desktop (mobile only)
const MOBILE_ONLY_IDS = new Set(["storageUsedCombined"]);

export default function WarehouseStorageTable({ mode }: Props) {
  const data = STORAGE_DATA[mode];
  const [sorting, setSorting] = useState<SortingState>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const categories = useMemo(
    () => Array.from(new Set(data.map((row) => row.category))),
    [data]
  );

  const filteredData = useMemo(
    () =>
      categoryFilter === "all"
        ? data
        : data.filter((row) => row.category === categoryFilter),
    [data, categoryFilter]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // "Sort by" is a quick preset that drives the same sorting state as the
  // per-column click handlers, just via a dropdown instead of a header click.
  const sortByColumnId = sorting[0]?.id ?? "section";
  const handleSortByChange = (columnId: string) => {
    setSorting([{ id: columnId, desc: false }]);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 lg:h-87.5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-base font-semibold text-[#262626]">
          Warehouse Storage
        </h3>

        {/* Desktop controls: Filter + Sort by (Image 2) */}
        <div className="hidden items-center gap-3 sm:flex">
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-8 text-sm text-[#262626] outline-none"
            >
              <option value="all">Filter</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <Filter
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Sort by:</span>
            <div className="relative">
              <select
                value={sortByColumnId}
                onChange={(e) => handleSortByChange(e.target.value)}
                className="appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2 pl-3 pr-8 text-sm font-medium text-[#262626] outline-none"
              >
                <option value="floor">Floor</option>
                <option value="section">Section</option>
                <option value="category">Category</option>
                <option value="percentageLabel">Percentage</option>
                <option value="availableSpace">Available Space</option>
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Mobile control: "..." overflow menu (Image 1) */}
        <button
          type="button"
          aria-label="More options"
          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-50 sm:hidden"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-[#E0E0E0]">
                {headerGroup.headers.map((header) => {
                  const isDesktopOnly = DESKTOP_ONLY_IDS.has(header.column.id);
                  const isMobileOnly = MOBILE_ONLY_IDS.has(header.column.id);
                  return (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className={`cursor-pointer select-none py-3 pr-4 text-left text-xs font-medium text-[#757575] ${
                        isDesktopOnly ? "hidden sm:table-cell" : ""
                      } ${isMobileOnly ? "sm:hidden" : ""}`}
                    >
                      <span className="inline-flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <ArrowUpDown
                          size={12}
                          className={
                            header.column.getIsSorted()
                              ? "text-[#8B7CF6]"
                              : "text-gray-300"
                          }
                        />
                      </span>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-[#E0E0E0] last:border-0">
                {row.getVisibleCells().map((cell) => {
                  const isDesktopOnly = DESKTOP_ONLY_IDS.has(cell.column.id);
                  const isMobileOnly = MOBILE_ONLY_IDS.has(cell.column.id);
                  return (
                    <td
                      key={cell.id}
                      className={`py-[12px] pr-4 text-xs lg:text-sm ${
                        isDesktopOnly ? "hidden sm:table-cell" : ""
                      } ${isMobileOnly ? "sm:hidden" : ""}`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            ))}

            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="py-8 text-center text-sm text-gray-400">
                  No storage sections match this filter
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}