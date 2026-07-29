"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  MoreHorizontal,
  Package,
  Tag,
  RotateCcw,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Download,
  Printer,
  RefreshCcw,
  CheckCheck,
  Trash2,
} from "lucide-react";
import { GoSortDesc } from "react-icons/go";

type ShipmentStatus =
  | "In Transit"
  | "Out for Delivery"
  | "Delivered"
  | "Processing";

interface Shipment {
  id: string;
  company: string;
  category: string;
  carrier: string;
  route: string;
  date: string;
  status: ShipmentStatus;
}

interface ActivityItem {
  id: string;
  icon: "package" | "tag" | "return" | "check";
  actorLabel: string;
  actor: string;
  text: string;
  time: string;
}

const shipments: Shipment[] = [
  {
    id: "#SH9283746",
    company: "TechGear Inc.",
    category: "Electronics",
    carrier: "FedEx",
    route: "Los Angeles, CA → Chicago, IL",
    date: "Mar 20, 2035",
    status: "In Transit",
  },
  {
    id: "#SH9182635",
    company: "StyleHub Co.",
    category: "Apparel",
    carrier: "DHL",
    route: "New York, NY → Atlanta, GA",
    date: "Mar 19, 2035",
    status: "Out for Delivery",
  },
  {
    id: "#SH9037821",
    company: "FreshNest",
    category: "Home & Kitchen",
    carrier: "UPS",
    route: "Dallas, TX → Miami, FL",
    date: "Mar 18, 2035",
    status: "Delivered",
  },
  {
    id: "#SH9374652",
    company: "FitPlus Gear",
    category: "Sports & Outdoors",
    carrier: "USPS",
    route: "Seattle, WA → Denver, CO",
    date: "Mar 21, 2035",
    status: "Processing",
  },
  {
    id: "#SH9457830",
    company: "AutoParts Pro",
    category: "Automotive",
    carrier: "Aramex",
    route: "Detroit, MI → San Diego, CA",
    date: "Mar 20, 2035",
    status: "In Transit",
  },
];

const activity: ActivityItem[] = [
  {
    id: "1",
    icon: "package",
    actorLabel: "User",
    actor: "@TechGuru99",
    text: "submitted a bulk shipment request",
    time: "12:00 PM",
  },
  {
    id: "2",
    icon: "tag",
    actorLabel: "Customer Support",
    actor: "@SupportKen",
    text: "added a priority tag to Order ID 77889JKL",
    time: "11:30 AM",
  },
  {
    id: "3",
    icon: "return",
    actorLabel: "User",
    actor: "@SallyMae88",
    text: "initiated a return process for Order ID 44556GHI",
    time: "11:00 AM",
  },
  {
    id: "4",
    icon: "check",
    actorLabel: "Administrator",
    actor: "@AdminLisa",
    text: "resolved a delivery issue for Order ID 12345XYZ",
    time: "10:15 AM",
  },
];

const statusStyles: Record<ShipmentStatus, string> = {
  "In Transit": "bg-gray-100 text-gray-700",
  "Out for Delivery": "bg-violet-100 text-violet-700",
  Delivered: "bg-green-100 text-green-700",
  Processing: "bg-blue-100 text-blue-700",
};

const activityIcon = (type: ActivityItem["icon"]) => {
  const common = "h-4 w-4";
  switch (type) {
    case "package":
      return <Package className={common} />;
    case "tag":
      return <Tag className={common} />;
    case "return":
      return <RotateCcw className={common} />;
    case "check":
      return <CheckCircle2 className={common} />;
  }
};

type SortKey = "id" | "company" | "carrier" | "route" | "date" | "status";
type SortDirection = "asc" | "desc";

const columns: { key: SortKey; label: string }[] = [
  { key: "id", label: "Shipping ID" },
  { key: "company", label: "Company" },
  { key: "carrier", label: "Carriers" },
  { key: "route", label: "Route" },
  { key: "date", label: "Shipping Date" },
  { key: "status", label: "Status" },
];

// Parses "Mar 20, 2035" style strings into a comparable timestamp
const parseDate = (value: string) => {
  const t = Date.parse(value);
  return Number.isNaN(t) ? 0 : t;
};

export default function ShipmentDashboardPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [selectAll, setSelectAll] = useState(false);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [tableMenuOpen, setTableMenuOpen] = useState(false);
  const [activityMenuOpen, setActivityMenuOpen] = useState(false);
  const [dismissedActivity, setDismissedActivity] = useState<Set<string>>(
    new Set()
  );

  const sortMenuRef = useRef<HTMLDivElement>(null);
  const tableMenuRef = useRef<HTMLDivElement>(null);
  const activityMenuRef = useRef<HTMLDivElement>(null);

  // Close any open dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        sortMenuRef.current &&
        !sortMenuRef.current.contains(e.target as Node)
      ) {
        setSortMenuOpen(false);
      }
      if (
        tableMenuRef.current &&
        !tableMenuRef.current.contains(e.target as Node)
      ) {
        setTableMenuOpen(false);
      }
      if (
        activityMenuRef.current &&
        !activityMenuRef.current.contains(e.target as Node)
      ) {
        setActivityMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const filteredShipments = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return shipments;
    return shipments.filter((s) =>
      [s.id, s.company, s.category, s.carrier, s.route, s.status]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [query]);

  const sortedShipments = useMemo(() => {
    const list = [...filteredShipments];
    list.sort((a, b) => {
      let compare = 0;
      if (sortKey === "date") {
        compare = parseDate(a.date) - parseDate(b.date);
      } else {
        compare = a[sortKey].localeCompare(b[sortKey]);
      }
      return sortDirection === "asc" ? compare : -compare;
    });
    return list;
  }, [filteredShipments, sortKey, sortDirection]);

  const toggleAll = () => {
    const next = !selectAll;
    setSelectAll(next);
    const map: Record<string, boolean> = {};
    sortedShipments.forEach((s) => (map[s.id] = next));
    setChecked(map);
  };

  const toggleOne = (id: string) => {
    setChecked((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      setSelectAll(sortedShipments.every((s) => updated[s.id]));
      return updated;
    });
  };

  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key) {
      return (
        <ChevronsUpDown className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-500" />
      );
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="h-3.5 w-3.5 text-violet-600" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5 text-violet-600" />
    );
  };

  const visibleActivity = activity.filter((a) => !dismissedActivity.has(a.id));

  return (
    <div className="">
      <div className="mt-4 grid grid-cols-12 gap-4">
        {/* Recent Shipments */}
        <div className="rounded-2xl col-span-12 lg:col-span-9 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-base font-semibold text-gray-900">
              Recent Shipments
            </h2>
            <div className="flex flex-1 items-center justify-end gap-2">
              <div className="relative w-full max-w-xs">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search shipment"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-violet-300"
                />
              </div>

              {/* Sort button + menu */}
              <div className="relative" ref={sortMenuRef}>
                <button
                  aria-label="Sort"
                  onClick={() => setSortMenuOpen((v) => !v)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border text-gray-500 hover:bg-gray-50 ${
                    sortMenuOpen
                      ? "border-violet-300 bg-violet-50 text-violet-600"
                      : "border-gray-200"
                  }`}
                >
                  <GoSortDesc className="h-4 w-4" />
                </button>
                {sortMenuOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-48 rounded-xl border border-gray-100 bg-white p-1.5 shadow-lg">
                    <p className="px-2 py-1 text-xs font-medium text-gray-400">
                      Sort by
                    </p>
                    {columns.map((col) => (
                      <button
                        key={col.key}
                        onClick={() => {
                          handleSort(col.key);
                          setSortMenuOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-sm hover:bg-gray-50 ${
                          sortKey === col.key
                            ? "text-violet-600"
                            : "text-gray-700"
                        }`}
                      >
                        {col.label}
                        {sortKey === col.key &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5" />
                          ))}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Table options menu */}
              <div className="relative" ref={tableMenuRef}>
                <button
                  aria-label="More options"
                  onClick={() => setTableMenuOpen((v) => !v)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border text-gray-500 hover:bg-gray-50 ${
                    tableMenuOpen
                      ? "border-violet-300 bg-violet-50 text-violet-600"
                      : "border-gray-200"
                  }`}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
                {tableMenuOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-44 rounded-xl border border-gray-100 bg-white p-1.5 shadow-lg">
                    <button
                      onClick={() => setTableMenuOpen(false)}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Export CSV
                    </button>
                    <button
                      onClick={() => setTableMenuOpen(false)}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      Print table
                    </button>
                    <button
                      onClick={() => {
                        setQuery("");
                        setSortKey("date");
                        setSortDirection("desc");
                        setTableMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <RefreshCcw className="h-3.5 w-3.5" />
                      Reset view
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-left text-sm">
              <thead>
                <tr className="rounded-lg bg-violet-100/70 text-gray-500">
                  <th className="rounded-l-lg px-2 py-2">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={toggleAll}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </th>
                  {columns.map((col, idx) => (
                    <th
                      key={col.key}
                      className={`px-2 py-2 font-medium ${
                        idx === columns.length - 1 ? "rounded-r-lg" : ""
                      }`}
                    >
                      <button
                        onClick={() => handleSort(col.key)}
                        className="group flex items-center gap-1 text-gray-500 hover:text-gray-700"
                      >
                        {col.label}
                        {renderSortIcon(col.key)}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedShipments.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-gray-100 last:border-none"
                  >
                    <td className="px-2 py-3">
                      <input
                        type="checkbox"
                        checked={!!checked[s.id]}
                        onChange={() => toggleOne(s.id)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </td>
                    <td className="px-2 py-3 font-medium text-violet-600">
                      {s.id}
                    </td>
                    <td className="px-2 py-3">
                      <div className="text-gray-900">{s.company}</div>
                      <div className="text-xs text-gray-400">{s.category}</div>
                    </td>
                    <td className="px-2 py-3 text-gray-700">{s.carrier}</td>
                    <td className="px-2 py-3 text-gray-700">{s.route}</td>
                    <td className="px-2 py-3 text-gray-700">{s.date}</td>
                    <td className="px-2 py-3">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${statusStyles[s.status]}`}
                      >
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {sortedShipments.length === 0 && (
                  <tr>
                    <td
                      colSpan={columns.length + 1}
                      className="px-2 py-6 text-center text-sm text-gray-400"
                    >
                      No shipments match "{query}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl col-span-3 bg-white p-5  shadow-sm hidden lg:block">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">
              Recent Activity
            </h2>
            <div className="relative" ref={activityMenuRef}>
              <button
                aria-label="More options"
                onClick={() => setActivityMenuOpen((v) => !v)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg border text-gray-500 hover:bg-gray-50 ${
                  activityMenuOpen
                    ? "border-violet-300 bg-violet-50 text-violet-600"
                    : "border-gray-200"
                }`}
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
              {activityMenuOpen && (
                <div className="absolute right-0 z-10 mt-2 w-48 rounded-xl border border-gray-100 bg-white p-1.5 shadow-lg">
                  <button
                    onClick={() => setActivityMenuOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    Mark all as read
                  </button>
                  <button
                    onClick={() => {
                      setDismissedActivity(
                        new Set(activity.map((a) => a.id))
                      );
                      setActivityMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Clear activity
                  </button>
                </div>
              )}
            </div>
          </div>

          <ul className="space-y-3">
            {visibleActivity.map((a, i) => (
              <li key={a.id} className="flex gap-3 relative">
                <div className="absolute left-4 top-[35px] w-0.5 h-[60%] bg-[#E0E0E0]"></div>
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full  ${
                    i % 2 !== 0
                      ? "bg-[#E0E0E0] text-gray-600"
                      : "bg-[#E3DDFF] text-violet-600"
                  }`}
                >
                  {activityIcon(a.icon)}
                </div>
                <div>
                  <p className="text-sm leading-snug text-gray-700">
                    {a.actorLabel}{" "}
                    <span className={`font-medium  text-violet-600`}>
                      {a.actor}
                    </span>{" "}
                    {a.text}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">{a.time}</p>
                </div>
              </li>
            ))}
            {visibleActivity.length === 0 && (
              <li className="py-6 text-center text-sm text-gray-400">
                No recent activity
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}