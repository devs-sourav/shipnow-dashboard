"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MoreHorizontal,
  Package,
  Tag,
  RotateCcw,
  CheckCircle2,
  CheckCheck,
  Trash2,
} from "lucide-react";

interface ActivityItem {
  id: string;
  icon: "package" | "tag" | "return" | "check";
  actorLabel: string;
  actor: string;
  text: string;
  time: string;
}

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
    {
    id: "5",
    icon: "tag",
    actorLabel: "Customer Support",
    actor: "@SupportKen",
    text: "added a priority tag to Order ID 77889JKL",
    time: "11:30 AM",
  },
];

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

export default function RecentActivity() {
  const [activityMenuOpen, setActivityMenuOpen] = useState(false);
  const [dismissedActivity, setDismissedActivity] = useState<Set<string>>(
    new Set()
  );

  const activityMenuRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
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

  const visibleActivity = activity.filter((a) => !dismissedActivity.has(a.id));

  return (
    <div className="rounded-2xl block h-full    bg-white p-4 shadow-sm">
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
                  setDismissedActivity(new Set(activity.map((a) => a.id)));
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

      <ul className="space-y-3 pb-4 md:pb-0">
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
  );
}