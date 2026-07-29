"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Check,
  ArrowUpDown,
  Plus,
  LayoutGrid,
  List,
  Plane,
  Truck,
  Ship as ShipIcon,
  TrainFront,
  Package,
  Clock,
  CheckSquare,
  MoreHorizontal,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & data                                                      */
/* ------------------------------------------------------------------ */

import type { Status, Mode } from "@/types/shipment";
import { SHIPMENTS } from "@/data/shipments";
import ShipmentCard from "./Shipmentcard";
import Image from "next/image";

const TABS: Array<"All" | Status> = [
  "All",
  "Delivered",
  "In Transit",
  "Processing",
  "Out for Delivery",
];

const SORT_OPTIONS = [
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
  { key: "company-az", label: "Company (A-Z)" },
  { key: "company-za", label: "Company (Z-A)" },
  { key: "progress-high", label: "Progress (High-Low)" },
  { key: "progress-low", label: "Progress (Low-High)" },
] as const;

// Extra keys usable only from table column headers (not shown in the
// Sort-by dropdown, but fully wired into the sort switch below).
type ExtraSortKey =
  | "id-az"
  | "id-za"
  | "carrier-az"
  | "carrier-za"
  | "category-az"
  | "category-za"
  | "route-az"
  | "route-za";

type SortKey = (typeof SORT_OPTIONS)[number]["key"] | ExtraSortKey;
type ViewMode = "grid" | "table";

const MODES: Mode[] = ["air", "truck", "ship", "train"];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

// "Mar 20, 2025 – 10:00 AM" -> Date
function parseDate(value: string): number {
  const cleaned = value.replace("–", "").replace(/\s+/g, " ").trim();
  const t = new Date(cleaned).getTime();
  return Number.isNaN(t) ? 0 : t;
}

const MODE_ICON: Record<Mode, typeof Plane> = {
  air: Plane,
  truck: Truck,
  ship: ShipIcon,
  train: TrainFront,
};

const MODE_LABEL: Record<Mode, string> = {
  air: "Air Freight",
  truck: "Road Freight",
  ship: "Ocean Freight",
  train: "Rail Freight",
};

const STATUS_STYLES: Record<Status, { dot: string; text: string; bg: string }> = {
  Delivered: { dot: "bg-emerald-500", text: "text-emerald-600", bg: "bg-emerald-50" },
  "In Transit": { dot: "bg-violet-500", text: "text-violet-600", bg: "bg-violet-50" },
  Processing: { dot: "bg-gray-400", text: "text-gray-600", bg: "bg-gray-100" },
  "Out for Delivery": { dot: "bg-amber-500", text: "text-amber-600", bg: "bg-amber-50" },
};

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

export default function ShipmentDashboard() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCarriers, setSelectedCarriers] = useState<string[]>([]);
  const [selectedModes, setSelectedModes] = useState<Mode[]>([]);

  // Row selection (table view only)
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Controls the click-to-reveal search box on tablet (md) sizes
  const [tabSearchOpen, setTabSearchOpen] = useState(false);

  const sortRefMobile = useRef<HTMLDivElement>(null);
  const sortRefDesktop = useRef<HTMLDivElement>(null);
  const filterRefMobile = useRef<HTMLDivElement>(null);
  const filterRefDesktop = useRef<HTMLDivElement>(null);
  const tabSearchRef = useRef<HTMLDivElement>(null);
  const tabSearchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;

      const insideSort =
        (sortRefMobile.current && sortRefMobile.current.contains(target)) ||
        (sortRefDesktop.current && sortRefDesktop.current.contains(target));
      if (!insideSort) setSortOpen(false);

      const insideFilter =
        (filterRefMobile.current && filterRefMobile.current.contains(target)) ||
        (filterRefDesktop.current && filterRefDesktop.current.contains(target));
      if (!insideFilter) setFilterOpen(false);

      const insideTabSearch =
        tabSearchRef.current && tabSearchRef.current.contains(target);
      if (!insideTabSearch) setTabSearchOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus the tablet search input smoothly once the box has expanded
  useEffect(() => {
    if (tabSearchOpen) {
      const t = setTimeout(() => tabSearchInputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [tabSearchOpen]);

  const allCarriers = useMemo(
    () => Array.from(new Set(SHIPMENTS.map((s) => s.carrier))).sort(),
    []
  );

  const toggleCarrier = (carrier: string) => {
    setSelectedCarriers((prev) =>
      prev.includes(carrier)
        ? prev.filter((c) => c !== carrier)
        : [...prev, carrier]
    );
    setPage(1);
  };

  const toggleMode = (mode: Mode) => {
    setSelectedModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
    );
    setPage(1);
  };

  const clearFilters = () => {
    setSelectedCarriers([]);
    setSelectedModes([]);
    setPage(1);
  };

  const activeFilterCount = selectedCarriers.length + selectedModes.length;

  const handleSort = (key: SortKey) => {
    setSortKey(key);
    setPage(1);
  };

  /* -------------------------- filter + sort -------------------------- */

  const filtered = useMemo(() => {
    const list = SHIPMENTS.filter((s) => {
      const matchesTab = activeTab === "All" ? true : s.status === activeTab;
      const matchesQuery =
        query.trim() === ""
          ? true
          : s.id.toLowerCase().includes(query.toLowerCase()) ||
            s.company.toLowerCase().includes(query.toLowerCase());
      const matchesCarrier =
        selectedCarriers.length === 0 || selectedCarriers.includes(s.carrier);
      const matchesMode =
        selectedModes.length === 0 || selectedModes.includes(s.mode);
      return matchesTab && matchesQuery && matchesCarrier && matchesMode;
    });

    const sorted = [...list].sort((a, b) => {
      switch (sortKey) {
        case "newest":
          return parseDate(b.originDate) - parseDate(a.originDate);
        case "oldest":
          return parseDate(a.originDate) - parseDate(b.originDate);
        case "company-az":
          return a.company.localeCompare(b.company);
        case "company-za":
          return b.company.localeCompare(a.company);
        case "progress-high":
          return b.progress - a.progress;
        case "progress-low":
          return a.progress - b.progress;
        case "id-az":
          return a.id.localeCompare(b.id);
        case "id-za":
          return b.id.localeCompare(a.id);
        case "carrier-az":
          return a.carrier.localeCompare(b.carrier);
        case "carrier-za":
          return b.carrier.localeCompare(a.carrier);
        case "category-az":
          return a.category.localeCompare(b.category);
        case "category-za":
          return b.category.localeCompare(a.category);
        case "route-az":
          return a.destinationCity.localeCompare(b.destinationCity);
        case "route-za":
          return b.destinationCity.localeCompare(a.destinationCity);
        default:
          return 0;
      }
    });

    return sorted;
  }, [activeTab, query, selectedCarriers, selectedModes, sortKey]);

  /* ------------------------------ paging ------------------------------ */

  const totalResults = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));
  const safePage = Math.min(page, totalPages);

  const paginated = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage, pageSize]);

  type PageItem = number | "ellipsis-left" | "ellipsis-right";

  const pageItems: PageItem[] = useMemo(() => {
    const items: PageItem[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) items.push(i);
      return items;
    }

    const siblings = 1;
    const left = Math.max(2, safePage - siblings);
    const right = Math.min(totalPages - 1, safePage + siblings);

    items.push(1);
    if (left > 2) items.push("ellipsis-left");

    for (let i = left; i <= right; i++) items.push(i);

    if (right < totalPages - 1) items.push("ellipsis-right");
    items.push(totalPages);

    return items;
  }, [totalPages, safePage]);

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.key === sortKey)?.label ?? "Custom";

  const allVisibleSelected =
    paginated.length > 0 && paginated.every((s) => selectedRows.includes(s.id));

  const toggleSelectAllVisible = () => {
    if (allVisibleSelected) {
      setSelectedRows((prev) =>
        prev.filter((id) => !paginated.some((s) => s.id === id))
      );
    } else {
      setSelectedRows((prev) => [
        ...prev,
        ...paginated.filter((s) => !prev.includes(s.id)).map((s) => s.id),
      ]);
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full max-w-full min-w-0">
      {/* Top bar of Desktop and Tablet */}
      <div className="mb-4 w-full hidden sm:flex max-w-full flex-col gap-3 sm:mb-4 sm:gap-4">
        {/* Status select + view toggle + desktop search/filter/sort */}
        <div className="order-2 flex w-full max-w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-2 lg:gap-3">
          <div className="flex items-center gap-2">
            <StatusSelect
              activeTab={activeTab}
              onChange={(tab) => {
                setActiveTab(tab);
                setPage(1);
              }}
            />
            <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
          </div>

          {/* Row: search + filter + sort — sm and up (full labels) */}
          <div className="hidden items-center gap-1 sm:gap-2 sm:flex">
            {/* Search — full box on mobile-ish sm, icon-only that expands on tablet (md), full box again on lg+ */}
            <div className="relative" ref={tabSearchRef}>
              {/* Below md: always full search box */}
              <div className="flex md:hidden items-center gap-1 lg:gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search Shipment"
                  className="w-60 text-sm text-gray-600 placeholder-gray-400 outline-none"
                />
              </div>

              {/* md to lg (tablet): icon button; search box overlays and grows */}
              <div className="hidden md:flex lg:hidden relative h-9.5 w-9.5">
                <button
                  onClick={() => setTabSearchOpen(true)}
                  className={`flex h-9.5 w-9.5 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-opacity duration-200 ${
                    tabSearchOpen ? "opacity-0 pointer-events-none" : "opacity-100"
                  }`}
                >
                  <Search className="h-4 w-4" />
                </button>

                <div
                  className={`absolute right-0 top-0 z-20 flex h-13 origin-right items-center gap-2 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg transition-all duration-300 ease-out ${
                    tabSearchOpen
                      ? "w-96 scale-100 px-3 py-2.5 opacity-100"
                      : "w-9.5 scale-95 opacity-0 pointer-events-none"
                  }`}
                >
                  <Search className="h-4 w-4 shrink-0 text-gray-400" />
                  <input
                    ref={tabSearchInputRef}
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search Shipment"
                    className={`w-full bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none transition-opacity duration-200 ${
                      tabSearchOpen ? "opacity-100 delay-100" : "opacity-0"
                    }`}
                  />
                </div>
              </div>

              {/* lg and up: always full search box */}
              <div className="hidden lg:flex items-center gap-1 lg:gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search Shipment"
                  className="w-60 text-sm text-gray-600 placeholder-gray-400 outline-none"
                />
              </div>
            </div>

            {/* Filter */}
            <div className="relative" ref={filterRefDesktop}>
              <button
                onClick={() => {
                  setFilterOpen((o) => !o);
                  setSortOpen(false);
                }}
                className="flex items-center gap-2 h-9.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden lg:block">Filter</span>

                {activeFilterCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[10px] font-semibold text-white">
                    {activeFilterCount}
                  </span>
                )}
                <ChevronDown className="h-4 w-4" />
              </button>

              {filterOpen && (
                <div className="absolute right-0 z-20 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                  <FilterPanelContent
                    allCarriers={allCarriers}
                    selectedCarriers={selectedCarriers}
                    selectedModes={selectedModes}
                    toggleCarrier={toggleCarrier}
                    toggleMode={toggleMode}
                    clearFilters={clearFilters}
                    onApply={() => setFilterOpen(false)}
                  />
                </div>
              )}
            </div>

            {/* Sort by */}
            <div className="relative" ref={sortRefDesktop}>
              <button
                onClick={() => {
                  setSortOpen((o) => !o);
                  setFilterOpen(false);
                }}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600"
              >
                Sort by:{" "}
                <span className="font-medium text-gray-900">
                  {currentSortLabel}
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {sortOpen && (
                <div className="absolute right-0 z-20 mt-2 w-48 rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
                  <SortMenuContent
                    sortKey={sortKey}
                    setSortKey={(k) => {
                      handleSort(k);
                      setSortOpen(false);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Top bar of Mobile */}
      <div className="mb-4 flex w-full sm:hidden max-w-full flex-col gap-2.5 px-3 py-3 sm:mb-6 sm:gap-4 rounded-lg shadow-sm bg-white">
        {/* Row 1: search + add */}
        <div className="order-1 flex items-center gap-2 sm:hidden">
          <div className="flex flex-1 min-w-0 items-center gap-2 rounded-lg h-11 border border-gray-200 bg-white px-3">
            <Search className="h-4 w-4 shrink-0 text-gray-400" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search id, company, etc"
              className="w-full min-w-0 text-sm h-full text-gray-600 placeholder-gray-400 outline-none bg-transparent"
            />
          </div>

          {/* Add button (mobile) */}
          <button
            onClick={() => {
              // TODO: wire up "add shipment" action
            }}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#333] text-white"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Row 2: status select + view toggle (left) — filter + sort grouped (right) */}
        <div className="order-2 flex w-full max-w-full items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <StatusSelect
              activeTab={activeTab}
              onChange={(tab) => {
                setActiveTab(tab);
                setPage(1);
              }}
            />
            <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
          </div>

          <div className="flex items-center gap-1.5">
            {/* Filter (mobile, icon only) */}
            <div className="relative shrink-0" ref={filterRefMobile}>
              <button
                onClick={() => {
                  setFilterOpen((o) => !o);
                  setSortOpen(false);
                }}
                className="relative flex h-9.5 w-9.5 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600"
              >
                <SlidersHorizontal className="h-4 w-4" />
                {activeFilterCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[10px] font-semibold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {filterOpen && (
                <div className="absolute right-0 z-20 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                  <FilterPanelContent
                    allCarriers={allCarriers}
                    selectedCarriers={selectedCarriers}
                    selectedModes={selectedModes}
                    toggleCarrier={toggleCarrier}
                    toggleMode={toggleMode}
                    clearFilters={clearFilters}
                    onApply={() => setFilterOpen(false)}
                  />
                </div>
              )}
            </div>

            {/* Sort (mobile, icon only) */}
            <div className="relative shrink-0" ref={sortRefMobile}>
              <button
                onClick={() => {
                  setSortOpen((o) => !o);
                  setFilterOpen(false);
                }}
                className="flex h-9.5 w-9.5 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600"
              >
                <ArrowUpDown className="h-4 w-4" />
              </button>

              {sortOpen && (
                <div className="absolute right-0 z-20 mt-2 w-48 rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
                  <SortMenuContent
                    sortKey={sortKey}
                    setSortKey={(k) => {
                      handleSort(k);
                      setSortOpen(false);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overview stat cards — shown above the table only in table view */}
      {viewMode === "table" && <StatsOverview shipments={SHIPMENTS} />}

      {/* Selection bar — table view only, shown when rows are selected */}
      {viewMode === "table" && selectedRows.length > 0 && (
        <div className="mb-3 flex items-center justify-between rounded-lg border border-violet-200 bg-violet-50 px-4 py-2 text-sm text-violet-700">
          <span>{selectedRows.length} selected</span>
          <button
            onClick={() => setSelectedRows([])}
            className="font-medium underline hover:no-underline"
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Grid / Table */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {paginated.map((s) => (
            <ShipmentCard key={s.id} s={s} />
          ))}
        </div>
      ) : (
        <div className="w-full min-w-0 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="w-10 px-4 py-3">
                  <Checkbox
                    checked={allVisibleSelected}
                    onChange={toggleSelectAllVisible}
                  />
                </th>
                <th className="whitespace-nowrap px-3 py-3">
                  <HeaderLabel
                    ascKey="id-az"
                    descKey="id-za"
                    sortKey={sortKey}
                    onSort={handleSort}
                  >
                    Shipping ID
                  </HeaderLabel>
                </th>
                <th className="whitespace-nowrap px-3 py-3">
                  <HeaderLabel
                    ascKey="company-az"
                    descKey="company-za"
                    sortKey={sortKey}
                    onSort={handleSort}
                  >
                    Company
                  </HeaderLabel>
                </th>
                <th className="whitespace-nowrap px-3 py-3">
                  <HeaderLabel
                    ascKey="carrier-az"
                    descKey="carrier-za"
                    sortKey={sortKey}
                    onSort={handleSort}
                  >
                    Carrier
                  </HeaderLabel>
                </th>
                <th className="whitespace-nowrap px-3 py-3">
                  <HeaderLabel
                    ascKey="category-az"
                    descKey="category-za"
                    sortKey={sortKey}
                    onSort={handleSort}
                  >
                    Category
                  </HeaderLabel>
                </th>
                <th className="whitespace-nowrap px-3 py-3">
                  <HeaderLabel
                    ascKey="route-az"
                    descKey="route-za"
                    sortKey={sortKey}
                    onSort={handleSort}
                  >
                    Route
                  </HeaderLabel>
                </th>
                <th className="whitespace-nowrap px-3 py-3">
                  <HeaderLabel
                    ascKey="oldest"
                    descKey="newest"
                    sortKey={sortKey}
                    onSort={handleSort}
                  >
                    Date
                  </HeaderLabel>
                </th>
                <th className="whitespace-nowrap px-3 py-3">
                  <HeaderLabel
                    ascKey="progress-low"
                    descKey="progress-high"
                    sortKey={sortKey}
                    onSort={handleSort}
                  >
                    Progress
                  </HeaderLabel>
                </th>
                <th className="whitespace-nowrap px-3 py-3">
                  <StaticHeaderLabel>Status</StaticHeaderLabel>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginated.map((s) => {
                const ModeIcon = MODE_ICON[s.mode];
                const statusStyle = STATUS_STYLES[s.status];
                const checked = selectedRows.includes(s.id);
                return (
                  <tr key={s.id} className="align-top text-[11px] hover:bg-gray-50/70">
                    <td className="px-4 py-4">
                      <Checkbox
                        checked={checked}
                        onChange={() => toggleSelectRow(s.id)}
                      />
                    </td>

                    {/* Shipping ID + mode */}
                    <td className="whitespace-nowrap px-3 py-4">
                      <div className="font-semibold text-violet-600">
                        #{s.id}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                        <ModeIcon className="h-3.5 w-3.5" />
                        {MODE_LABEL[s.mode]}
                      </div>
                    </td>

                    {/* Company + category */}
                    <td className="whitespace-nowrap px-3 py-4">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white">
                          <Image width={32} height={32} src={s.logoImage} alt="SFDF" />
                        </span>
                        <div>
                          <div className="font-medium text-gray-900">
                            {s.company}
                          </div>
                          <div className="text-xs text-gray-400">
                            {s.category}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Carrier */}
                    <td className="whitespace-nowrap px-3 py-4 text-gray-600">
                      {s.carrier}
                    </td>

                    {/* Category */}
                    <td className="whitespace-nowrap px-3 py-4 text-gray-600">
                      {s.category}
                    </td>

                    {/* Route */}
                    <td className="whitespace-nowrap px-3 py-4">
                      <div className="text-gray-700">
                        {s.originCity}{" "}
                        <span className="text-gray-400">(Origin)</span>
                      </div>
                      <div className="mt-0.5 text-violet-600">
                        {s.destinationCity}{" "}
                        <span className="text-gray-400">(Destination)</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="whitespace-nowrap px-3 py-4">
                      <div className="text-gray-700">
                        {s.originDate}{" "}
                        <span className="text-gray-400">(ATD)</span>
                      </div>
                      <div className="mt-0.5 text-violet-600">
                        {s.destinationDate}{" "}
                        <span className="text-gray-400">(ETA)</span>
                      </div>
                    </td>

                    {/* Progress */}
                    <td className="whitespace-nowrap px-3 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-violet-600"
                            style={{ width: `${s.progress}%` }}
                          />
                        </div>
                        <span className="text-gray-600">{s.progress}%</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="whitespace-nowrap px-3 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`}
                        />
                        {s.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length === 0 && (
        <p className="mt-10 text-center text-sm text-gray-400">
          No shipments match your search.
        </p>
      )}

      {/* Footer / pagination */}
      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          Show
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="rounded-md border border-gray-200 bg-white px-2 py-1 text-gray-700 outline-none"
          >
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={48}>48</option>
          </select>
          of {totalResults} results
        </div>

        <div className="flex flex-wrap items-center justify-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {pageItems.map((item, idx) =>
            item === "ellipsis-left" || item === "ellipsis-right" ? (
              <span key={`${item}-${idx}`} className="px-1 text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={`page-${item}`}
                onClick={() => setPage(item)}
                className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium ${
                  safePage === item
                    ? "bg-violet-600 text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {item}
              </button>
            )
          )}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Overview stat cards (Total / Pending / Delivery / Completed)       */
/* ------------------------------------------------------------------ */

const STAT_TREND_SAMPLE: Record<"total" | "pending" | "delivery" | "completed", { direction: "up" | "down"; pct: string; note: string }> = {
  total: { direction: "up", pct: "4.6%", note: "this week" },
  pending: { direction: "up", pct: "8.7%", note: "this week" },
  delivery: { direction: "down", pct: "4.2%", note: "last week" },
  completed: { direction: "up", pct: "3.9%", note: "this week" },
};

function StatsOverview({ shipments }: { shipments: typeof SHIPMENTS }) {
  const stats = useMemo(() => {
    const total = shipments.length;
    const pending = shipments.filter((s) => s.status === "Processing").length;
    const delivery = shipments.filter(
      (s) => s.status === "In Transit" || s.status === "Out for Delivery"
    ).length;
    const completed = shipments.filter((s) => s.status === "Delivered").length;

    return [
      { key: "total" as const, title: "Total Shipments", value: total, icon: Package },
      { key: "pending" as const, title: "Pending", value: pending, icon: Clock },
      { key: "delivery" as const, title: "Delivery", value: delivery, icon: Truck },
      { key: "completed" as const, title: "Completed", value: completed, icon: CheckSquare },
    ];
  }, [shipments]);

  return (
    <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {stats.map((s) => {
        const Icon = s.icon;
        const trend = STAT_TREND_SAMPLE[s.key];
        const isUp = trend.direction === "up";
        return (
          <div key={s.key} className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                  <Icon className="h-3 w-3" />
                </span>
                <span className="text-xs  lg:text-base text-gray-500">{s.title}</span>
              </div>
              <button
                type="button"
                className="text-gray-300 hover:text-gray-500"
                aria-label="More options"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <span className="text-2xl font-semibold text-[#333]">
                {s.value.toLocaleString()}
              </span>
              <div className="flex gap-1 text-xs text-gray-400">
                {isUp ? (
                  <ChevronUp className="h-3 sm:h-4.5 w-3 sm:w-4.5 shrink-0 bg-[#D9F9E7] rounded-full text-xs text-[#007837]" />
                ) : (
                  <ChevronDown size={12} className="h-3 sm:h-4.5 w-3 sm:w-4.5 shrink-0 text-xs rounded-full bg-[#F4F2FC] text-[#2A1298]" />
                )}
                <span className="whitespace-nowrap text-[10px] sm:text-xs">
                  {isUp ? "Up by" : "Down"}{" "}
                  <span
                    className={`rounded px-1 py-0.5 font-medium ${
                      isUp ? "bg-gray-100 text-emerald-600" : "bg-gray-100 text-rose-600"
                    }`}
                  >
                    {trend.pct}
                  </span>{" "}
                  <span className="sm:block">{trend.note}</span>
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Status select (replaces the tab row)                               */
/* ------------------------------------------------------------------ */

function StatusSelect({
  activeTab,
  onChange,
  className = "",
}: {
  activeTab: (typeof TABS)[number];
  onChange: (tab: (typeof TABS)[number]) => void;
  className?: string;
}) {
  return (
    <div
      className={`relative flex h-9.5 items-center rounded-lg border border-gray-200 bg-white ${className}`}
    >
      <select
        value={activeTab}
        onChange={(e) => onChange(e.target.value as (typeof TABS)[number])}
        className="h-full w-full appearance-none rounded-lg bg-transparent px-3 pr-8 text-sm font-medium text-gray-700 outline-none"
      >
        {TABS.map((tab) => (
          <option key={tab} value={tab}>
            {tab}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 h-4 w-4 text-gray-400" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Grid / table view toggle                                           */
/* ------------------------------------------------------------------ */

function ViewToggle({
  viewMode,
  setViewMode,
}: {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}) {
  return (
    <div className="flex h-9.5 shrink-0 items-center gap-0.5 rounded-lg border border-gray-200 bg-white p-0.5">
      <button
        type="button"
        onClick={() => setViewMode("grid")}
        aria-label="Grid view"
        aria-pressed={viewMode === "grid"}
        className={`flex h-full w-8 items-center justify-center rounded-md transition-colors ${
          viewMode === "grid" ? "bg-[#333] text-white" : "text-gray-500 hover:bg-gray-50"
        }`}
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => setViewMode("table")}
        aria-label="Table view"
        aria-pressed={viewMode === "table"}
        className={`flex h-full w-8 items-center justify-center rounded-md transition-colors ${
          viewMode === "table" ? "bg-[#333] text-white" : "text-gray-500 hover:bg-gray-50"
        }`}
      >
        <List className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Small shared bits for the table                                    */
/* ------------------------------------------------------------------ */

function HeaderLabel({
  children,
  ascKey,
  descKey,
  sortKey,
  onSort,
}: {
  children: React.ReactNode;
  ascKey: SortKey;
  descKey: SortKey;
  sortKey: SortKey;
  onSort: (key: SortKey) => void;
}) {
  const isAsc = sortKey === ascKey;
  const isDesc = sortKey === descKey;
  const active = isAsc || isDesc;

  return (
    <button
      type="button"
      onClick={() => onSort(isAsc ? descKey : ascKey)}
      className={`flex items-center gap-1 hover:text-gray-700 ${
        active ? "text-violet-600" : "text-gray-500"
      }`}
    >
      {children}
      {isAsc ? (
        <ChevronUp className="h-3 w-3" />
      ) : isDesc ? (
        <ChevronDown className="h-3 w-3" />
      ) : (
        <ChevronsUpDown className="h-3 w-3 opacity-50" />
      )}
    </button>
  );
}

// Non-sortable header label — used for columns like Status that
// shouldn't trigger any sorting when clicked.
function StaticHeaderLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1 text-gray-500">
      {children}
    </span>
  );
}

function Checkbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={checked}
      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
        checked ? "border-violet-600 bg-violet-600" : "border-gray-300 bg-white"
      }`}
    >
      {checked && <Check className="h-3 w-3 text-white" />}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared dropdown contents (reused for mobile + desktop triggers)    */
/* ------------------------------------------------------------------ */

function FilterPanelContent({
  allCarriers,
  selectedCarriers,
  selectedModes,
  toggleCarrier,
  toggleMode,
  clearFilters,
  onApply,
}: {
  allCarriers: string[];
  selectedCarriers: string[];
  selectedModes: Mode[];
  toggleCarrier: (carrier: string) => void;
  toggleMode: (mode: Mode) => void;
  clearFilters: () => void;
  onApply: () => void;
}) {
  return (
    <>
      <p className="mb-2 text-xs font-semibold text-gray-500">Carrier</p>
      <div className="mb-3 flex flex-col gap-1.5">
        {allCarriers.map((carrier) => {
          const checked = selectedCarriers.includes(carrier);
          return (
            <button
              key={carrier}
              onClick={() => toggleCarrier(carrier)}
              className="flex items-center justify-between rounded-md px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-50"
            >
              <span>{carrier}</span>
              <span
                className={`flex h-4 w-4 items-center justify-center rounded border ${
                  checked ? "border-violet-600 bg-violet-600" : "border-gray-300"
                }`}
              >
                {checked && <Check className="h-3 w-3 text-white" />}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mb-2 text-xs font-semibold text-gray-500">Mode</p>
      <div className="mb-3 flex flex-col gap-1.5">
        {MODES.map((mode) => {
          const checked = selectedModes.includes(mode);
          return (
            <button
              key={mode}
              onClick={() => toggleMode(mode)}
              className="flex items-center justify-between rounded-md px-2 py-1.5 text-left text-sm capitalize text-gray-700 hover:bg-gray-50"
            >
              <span>{mode}</span>
              <span
                className={`flex h-4 w-4 items-center justify-center rounded border ${
                  checked ? "border-violet-600 bg-violet-600" : "border-gray-300"
                }`}
              >
                {checked && <Check className="h-3 w-3 text-white" />}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-2">
        <button
          onClick={clearFilters}
          className="text-xs font-medium text-gray-500 hover:text-gray-700"
        >
          Clear all
        </button>
        <button
          onClick={onApply}
          className="rounded-md bg-[#333] px-3 py-1.5 text-xs font-medium text-white"
        >
          Apply
        </button>
      </div>
    </>
  );
}

function SortMenuContent({
  sortKey,
  setSortKey,
}: {
  sortKey: SortKey;
  setSortKey: (key: SortKey) => void;
}) {
  return (
    <>
      {SORT_OPTIONS.map((opt) => (
        <button
          key={opt.key}
          onClick={() => setSortKey(opt.key)}
          className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm hover:bg-gray-50 ${
            sortKey === opt.key ? "font-medium text-violet-600" : "text-gray-700"
          }`}
        >
          {opt.label}
          {sortKey === opt.key && <Check className="h-3.5 w-3.5" />}
        </button>
      ))}
    </>
  );
}