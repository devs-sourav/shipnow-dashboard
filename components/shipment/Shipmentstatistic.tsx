"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface DataPoint {
  month: string;
  value: number;
  label: string; // tooltip e ei text ta dekhabe (e.g. "May 2030")
}

// পুরো ১২ মাসের ডেটা — এখান থেকেই ৬ / ৮ / ১২ মাস স্লাইস হবে
const FULL_DATA: DataPoint[] = [
  { month: "Jan", value: 1900, label: "Jan 2030" },
  { month: "Feb", value: 3100, label: "Feb 2030" },
  { month: "Mar", value: 1300, label: "Mar 2030" },
  { month: "Apr", value: 2000, label: "Apr 2030" },
  { month: "May", value: 3124, label: "May 2030" },
  { month: "Jun", value: 2100, label: "Jun 2030" },
  { month: "Jul", value: 3500, label: "Jul 2030" },
  { month: "Aug", value: 3900, label: "Aug 2030" },
  { month: "Sep", value: 2800, label: "Sep 2030" },
  { month: "Oct", value: 4200, label: "Oct 2030" },
  { month: "Nov", value: 3600, label: "Nov 2030" },
  { month: "Dec", value: 4600, label: "Dec 2030" },
];

const PERIOD_OPTIONS = [
  { key: "6", label: "Last 6 Months" },
  { key: "8", label: "Last 8 Months" },
  { key: "12", label: "Last Year" },
] as const;

type PeriodKey = (typeof PERIOD_OPTIONS)[number]["key"];

type BarRect = { x: number; y: number; width: number };

interface CustomBarProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
  index?: number;
  activeIndex: number;
  onLayout: (index: number, rect: BarRect) => void;
}

function CustomBar(props: CustomBarProps) {
  const {
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    fill,
    index,
    activeIndex,
    onLayout,
  } = props;
  const isActive = index === activeIndex;

  if (index != null) {
    onLayout(index, { x, y, width });
  }

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} />
      <line
        x1={x}
        x2={x + width}
        y1={y}
        y2={y}
        stroke="#111827"
        strokeWidth={2}
        strokeLinecap="butt"
      />
      {isActive && (
        <circle
          cx={x + width / 2}
          cy={y}
          r={5}
          fill="#111827"
          stroke="#ffffff"
          strokeWidth={2}
        />
      )}
    </g>
  );
}

type MouseMoveState = {
  activeTooltipIndex?: number | null;
};

// data er max value theke ekta "nice" round ceiling ber kore, tarpor
// shei ceiling ke thik tickCount-1 equal ongshe bhag kore — flat 5 ta tick guarantee kore
function getYAxisTicks(values: number[], tickCount = 5): number[] {
  const max = Math.max(...values, 0);
  if (max === 0) {
    return Array.from({ length: tickCount }, (_, i) => i);
  }

  const magnitude = Math.pow(10, Math.floor(Math.log10(max)));
  const residual = max / magnitude;

  let niceMax: number;
  if (residual > 5) niceMax = 10 * magnitude;
  else if (residual > 2) niceMax = 5 * magnitude;
  else if (residual > 1) niceMax = 2 * magnitude;
  else niceMax = magnitude;

  const step = niceMax / (tickCount - 1);
  return Array.from({ length: tickCount }, (_, i) => Math.round(i * step));
}

export default function ShipmentStatistic() {
  const [period, setPeriod] = useState<PeriodKey>("8");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const barRectsRef = useRef<Record<number, BarRect>>({});
  const [containerWidth, setContainerWidth] = useState(0);

  const selectedLabel =
    PERIOD_OPTIONS.find((opt) => opt.key === period)?.label ?? "";

  // dropdown er baire click korle bondho hoye jabe
  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isDropdownOpen]);

  // period onujayi data slice + global index map rakhi (jate month-over-month % thik thake)
  const displayedData = useMemo(() => {
    const n = Number(period);
    return FULL_DATA.slice(-n);
  }, [period]);

  const globalOffset = FULL_DATA.length - displayedData.length;

  // shobshomoy thik 5 ta row/tick dekhabe, data er max onujayi
  const yAxisTicks = useMemo(
    () => getYAxisTicks(displayedData.map((d) => d.value)),
    [displayedData],
  );

  // profit % = active month vs তার আগের মাস (previous month), first available month hole null
  const profitPercent = useMemo(() => {
    const globalIndex = globalOffset + activeIndex;
    const prev = FULL_DATA[globalIndex - 1];
    const current = FULL_DATA[globalIndex];
    if (!prev || !current) return null;
    return ((current.value - prev.value) / prev.value) * 100;
  }, [globalOffset, activeIndex]);

  // period palte gele active bar ke shobshomoy shesh (shobcheye recent) mash e niye ashi
  useEffect(() => {
    barRectsRef.current = {};
    setActiveIndex(displayedData.length - 1);
  }, [displayedData.length]);

  // container width track kori — responsive resize + tooltip clamp er jonno
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(el);
    setContainerWidth(el.clientWidth);
    return () => observer.disconnect();
  }, []);

  const activePoint = displayedData[activeIndex];
  const activeRect = barRectsRef.current[activeIndex];

  // tooltip jeno card er baire beriye na jay, tar jonno left value clamp kora hocche
  const tooltipLeft = activeRect
    ? Math.min(Math.max(activeRect.x + activeRect.width / 2, 34), containerWidth - 34)
    : 0;

  const isPositive = (profitPercent ?? 0) >= 0;

  return (
    <div className="w-full rounded-2xl bg-white p-3 sm:p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between lg:gap-2">
        <h3 className="text-base font-semibold text-gray-900">
          Shipment Statistic
        </h3>

        {/* Period dropdown — select korle shetai dekhabe */}
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen((open) => !open)}
            aria-haspopup="listbox"
            aria-expanded={isDropdownOpen}
            className="flex items-center gap-1.5 rounded-lg cursor-pointer bg-gray-50 px-2 py-1.5 text-[10px] text-gray-600 transition-colors hover:bg-gray-100"
          >
            {selectedLabel}
            <svg
              className={`h-3.5 w-3.5 text-gray-400 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {isDropdownOpen && (
            <ul
              role="listbox"
              className="absolute right-0 z-20 mt-1.5 w-full text-[10px] overflow-hidden rounded-lg border border-gray-100 bg-white py-1 shadow-lg"
            >
              {PERIOD_OPTIONS.map((opt) => (
                <li key={opt.key} role="option" aria-selected={period === opt.key}>
                  <button
                    type="button"
                    onClick={() => {
                      setPeriod(opt.key);
                      setIsDropdownOpen(false);
                    }}
                    className={`flex w-full items-center justify-between cursor-pointer px-2 py-1 text-left text-[10px] transition-colors hover:bg-gray-50 ${
                      period === opt.key
                        ? "font-medium text-violet-700"
                        : "text-gray-600"
                    }`}
                  >
                    {opt.label}
                    {period === opt.key && (
                      <svg
                        className="h-4 w-4 text-violet-600"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4 10.5L8 14.5L16 5.5"
                          stroke="currentColor"
                          strokeWidth={1.7}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className=" flex items-baseline gap-2">
        {activePoint ? (
          <>
            <span className="text-[24px] font-bold text-gray-900">
              {activePoint.value.toLocaleString()}
            </span>
            {profitPercent !== null ? (
              <span
                className={`text-sm font-medium ${
                  isPositive ? "text-green-500" : "text-red-500"
                }`}
              >
                {isPositive ? "↗" : "↘"} {isPositive ? "+" : ""}
                {profitPercent.toFixed(1)}%
              </span>
            ) : (
              <span className="text-sm font-medium text-gray-400">
                No prior month to compare
              </span>
            )}
          </>
        ) : (
          <span className="text-sm text-gray-400">No data for this range</span>
        )}
      </div>
      {/* {profitPercent !== null && (
        <p className="mb-2 text-xs text-gray-400">vs previous month</p>
      )} */}

      <div ref={containerRef} className="relative h-40 w-full min-w-0">
        {activeRect && activePoint && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full"
            style={{
              left: tooltipLeft,
              top: activeRect.y - 20,
            }}
          >
            <div className="rounded-lg bg-violet-100 px-2 py-1 text-center shadow-md">
              <p className="text-[10px] font-medium text-violet-700">
                {activePoint.label}
              </p>
              <p className="text-[14px] font-bold text-gray-900">
                {activePoint.value.toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {displayedData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={displayedData}
              margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
              barCategoryGap={0}
              barGap={0}
              onMouseMove={(state: unknown) => {
                const s = state as MouseMoveState;
                if (s?.activeTooltipIndex != null) {
                  setActiveIndex(Number(s.activeTooltipIndex));
                }
              }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="4 4"
                stroke="#e5e7eb"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                dy={8}
                interval="preserveStartEnd"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                tickFormatter={(v) => `${v / 1000}K`}
                width={40}
                ticks={yAxisTicks}
                domain={[0, yAxisTicks[yAxisTicks.length - 1]]}
                interval={0}
                allowDecimals={false}
              />

              <defs>
                <linearGradient id="defaultGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e5e7eb" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
                <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="85%" stopColor="#fff" />
                </linearGradient>
              </defs>
              <Bar
                dataKey="value"
                shape={(
                  props: Omit<CustomBarProps, "activeIndex" | "onLayout">,
                ) => (
                  <CustomBar
                    {...props}
                    activeIndex={activeIndex}
                    onLayout={(index, rect) => {
                      barRectsRef.current[index] = rect;
                    }}
                  />
                )}
              >
                {displayedData.map((entry, index) => (
                  <Cell
                    key={entry.label}
                    fill={
                      index === activeIndex
                        ? "url(#activeGradient)"
                        : "url(#defaultGradient)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No data available
          </div>
        )}
      </div>
    </div>
  );
}