"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts";
import { ChevronDown, Check } from "lucide-react";

interface MonthData {
  month: string;
  revenue: number;
  cost: number;
}

interface HoverInfo {
  index: number;
  left: number;
  top: number;
}

interface RangeOption {
  label: string;
  months: number;
}

interface XAxisTickProps {
  x?: number | string;
  y?: number | string;
  payload?: { value: string };
  index?: number;
}

const ALL_DATA: MonthData[] = [
  { month: "Jan", revenue: 42000, cost: 28000 },
  { month: "Feb", revenue: 36000, cost: 24000 },
  { month: "Mar", revenue: 51000, cost: 42000 },
  { month: "Apr", revenue: 72000, cost: 36000 },
  { month: "May", revenue: 87524, cost: 45680 },
  { month: "Jun", revenue: 76000, cost: 45000 },
  { month: "Jul", revenue: 58000, cost: 49000 },
  { month: "Aug", revenue: 70000, cost: 35000 },
];

// Range options — koyekta preset window, ALL_DATA-er last N month dekhabe.
const RANGE_OPTIONS: RangeOption[] = [
  { label: "Last 3 Months", months: 3 },
  { label: "Last 6 Months", months: 6 },
  { label: "Last 8 Months", months: 8 },
];

// Tooltip-er approx width/height — clamp calculation-e use hobe.
// (Actual DOM width measure kora zeto ekta ref diye, kintu eta simple o predictable.)
const TOOLTIP_WIDTH = 104;
const TOOLTIP_HEIGHT = 56;
const EDGE_PADDING = 4; // container-er edge theke minimum gap

export default function ProfitSummary() {
  // selectedRange = dropdown theke kon option active
  const [selectedRange, setSelectedRange] = useState<RangeOption>(
    RANGE_OPTIONS[2]
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // range change hole DATA truncate hoy, tai activeIndex-o shei onujayi
  // clamp kora dorkar (nahole out-of-range index e tooltip bhenge jabe).
  const DATA: MonthData[] = useMemo(
    () => ALL_DATA.slice(-selectedRange.months),
    [selectedRange]
  );

  const [activeIndex, setActiveIndex] = useState<number>(DATA.length - 1);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);

  const chartWrapRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const totalRevenue = useMemo(
    () => DATA.reduce((a, b) => a + b.revenue, 0),
    [DATA]
  );

  // Range palte gele active bar-ke notun DATA-r shesh month-e reset kori.
  useEffect(() => {
    setActiveIndex(DATA.length - 1);
  }, [DATA]);

  // Dropdown-er baire click korle bondho hoye jabe.
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // activeIndex change hole (ba mount hole, ba window resize hole) DOM theke
  // shothik bar-ta khuje niye tar upore tooltip position calculate kori.
  // Tooltip-er left/top ekhon container-er bounds-er moddhei clamp kora hocche,
  // tai mobile-e (choto width) tooltip r bahire chole jabe na.
  useEffect(() => {
    const positionTooltip = () => {
      const wrap = chartWrapRef.current;
      if (!wrap) return;

      const barGroups = wrap.querySelectorAll<SVGGElement>(".recharts-bar");
      const revenueGroup = barGroups[0];
      if (!revenueGroup) return;

      const rects = revenueGroup.querySelectorAll<SVGPathElement>(
        ".recharts-rectangle"
      );
      const activeRect = rects[activeIndex];
      if (!activeRect) return;

      const wrapRect = wrap.getBoundingClientRect();
      const rectBox = activeRect.getBoundingClientRect();

      let left = rectBox.left + rectBox.width / 2 - wrapRect.left;
      let top = rectBox.top - wrapRect.top;

      // Horizontally clamp: tooltip half-width + padding-er baire jete debo na
      const minLeft = TOOLTIP_WIDTH / 2 + EDGE_PADDING;
      const maxLeft = wrapRect.width - TOOLTIP_WIDTH / 2 - EDGE_PADDING;
      left = Math.min(Math.max(left, minLeft), maxLeft);

      // Vertically clamp: upore chart wrap-er baire (negative top) jete debo na
      top = Math.max(top, TOOLTIP_HEIGHT + EDGE_PADDING);

      setHoverInfo({ index: activeIndex, left, top });
    };

    const raf = requestAnimationFrame(positionTooltip);

    window.addEventListener("resize", positionTooltip);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", positionTooltip);
    };
  }, [activeIndex, DATA]);

  const handleEnter = (i: number) => {
    setActiveIndex(i);
  };

  const handleSelectRange = (option: RangeOption) => {
    setSelectedRange(option);
    setIsDropdownOpen(false);
  };

  const hoverData = hoverInfo ? DATA[hoverInfo.index] : null;

  return (
    <div className="h-[260px] rounded-3xl bg-white p-4 overflow-visible flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between">
        <h3 className="text-[16px] font-semibold text-[#2D2D2D]">
          Profit Summary
        </h3>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-1 rounded-xl bg-[#F5F5F5] px-2.5 py-1.5 text-[11px] font-medium text-[#555] transition-colors hover:bg-[#ECECEC] active:bg-[#E4E4E4] cursor-pointer"
            aria-haspopup="listbox"
            aria-expanded={isDropdownOpen}
          >
            {selectedRange.label}
            <ChevronDown
              size={12}
              className={`transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <ul
              role="listbox"
              className="absolute right-0 top-[calc(100%+6px)] z-20 w-[148px] overflow-hidden rounded-xl border border-[#F0F0F0] bg-white py-1 shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
            >
              {RANGE_OPTIONS.map((option) => {
                const isSelected = option.label === selectedRange.label;
                return (
                  <li key={option.label} role="option" aria-selected={isSelected}>
                    <button
                      onClick={() => handleSelectRange(option)}
                      className={`flex w-full items-center cursor-pointer justify-between px-3 py-1.5 text-left text-[11px] transition-colors ${
                        isSelected
                          ? "font-semibold text-[#7C5CFA] bg-[#F5F2FF]"
                          : "font-medium text-[#555] hover:bg-[#F7F7F7]"
                      }`}
                    >
                      {option.label}
                      {isSelected && <Check size={12} />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Total + legend row */}
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-[20px] font-bold text-[#2D2D2D]">
            ${totalRevenue.toLocaleString()}
          </h2>
          <span className="rounded-full bg-[#EAF8EF] px-2 py-0.5 text-[10px] font-medium text-[#1BAA55]">
            ↗ 5.62%
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#7C5CFA]" />
            <span className="text-[11px] text-[#555]">Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#2D2D2D]" />
            <span className="text-[11px] text-[#555]">Cost</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div ref={chartWrapRef} className="relative mt-2 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={DATA}
            barGap={6}
            barCategoryGap="10%"
            margin={{ top: 10, right: 0, left: -23, bottom: -8 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#ECECEC" />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={(props: XAxisTickProps) => {
                const { x = 0, y = 0, payload, index = 0 } = props;
                const numX = Number(x);
                const numY = Number(y);
                return (
                  <text
                    x={numX}
                    y={numY + 12}
                    textAnchor="middle"
                    fontSize={10}
                    fontWeight={index === activeIndex ? 700 : 400}
                    fill={index === activeIndex ? "#2D2D2D" : "#9CA3AF"}
                  >
                    {payload?.value}
                  </text>
                );
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 10 }}
              tickFormatter={(v: number) => `$${v / 1000}k`}
            />

            <Bar radius={[8, 8, 0, 0]} dataKey="revenue">
              {DATA.map((_, i) => (
                <Cell
                  key={i}
                  fill={i === activeIndex ? "#7C5CFA" : "#DDD6FE"}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => handleEnter(i)}
                />
              ))}
            </Bar>

            <Bar radius={[8, 8, 0, 0]} dataKey="cost">
              {DATA.map((_, i) => (
                <Cell
                  key={i}
                  fill={i === activeIndex ? "#2D2D2D" : "#F0F0F0"}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => handleEnter(i)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {hoverData && hoverInfo && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-t-md rounded-r-md bg-[#F0F0F0] px-2.5 py-1.5 shadow-xl border border-[#F0F0F0]"
            style={{ left: hoverInfo.left, top: hoverInfo.top - 13, width: TOOLTIP_WIDTH }}
          >
            <div className="space-y-0.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#7C5CFA]" />
                  <span className="text-[10px] text-gray-500">Revenue</span>
                </div>
                <span className="text-[10px] font-bold text-[#2D2D2D]">
                  ${hoverData.revenue.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#2D2D2D]" />
                  <span className="text-[10px] text-gray-500">Cost</span>
                </div>
                <span className="text-[10px] font-bold text-[#2D2D2D]">
                  ${hoverData.cost.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}