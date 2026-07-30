"use client";

import { useEffect, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import { FreightMode } from "@/types/warehouse";
import { INVENTORY_DATA } from "@/data/inventory";

interface Props {
  mode: FreightMode;
}

const slug = (s: string) => s.replace(/[^a-z0-9]+/gi, "-").toLowerCase();

// Must match the BarChart's own `margin` below, so divider math lines up
// exactly with where recharts actually places the bands.
const CHART_MARGIN_LEFT = 8;
const CHART_MARGIN_RIGHT = 8;

// Reserved width on the right of the mobile chart's plot area for the
// name / percentage / package-count label (drawn outside the bar/track).
const MOBILE_LABEL_WIDTH = 128;
const MOBILE_BAR_SIZE = 56;

// Measures a container's real pixel box (and keeps it in sync on resize),
// so we can compute divider positions from actual layout instead of
// guessing with equal CSS flex columns.
function useContainerSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(el);
    const rect = el.getBoundingClientRect();
    setSize({ width: rect.width, height: rect.height });

    return () => observer.disconnect();
  }, []);

  return [ref, size] as const;
}

// Category name rendered above the bar (orientation="top" XAxis tick).
// foreignObject lets us get real CSS text-wrapping ("Home & Kitchen" -> 2 lines)
// which plain SVG <text> can't do.
function CategoryTick({ x, y, payload }: any) {
  return (
    <g transform={`translate(${x},${y})`}>
      <foreignObject x={-45} y={-38} width={90} height={32}>
        <div
          style={{
            fontSize: 13,
            lineHeight: "16px",
            color: "#6b7280",
            textAlign: "center",
          }}
        >
          {payload.value}
        </div>
      </foreignObject>
    </g>
  );
}

// "25% • 2,500" style footer, rendered below each bar's own baseline
// (desktop vertical chart).
function ValueLabel(props: any) {
  const { x, y, width, height, index, items } = props;
  const item = items[index];
  const cx = x + width / 2;

  return (
    <foreignObject x={cx - 45} y={y + height + 10} width={90} height={20}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 4,
          fontSize: 11,
        }}
      >
        <span style={{ fontWeight: 600, color: "#262626" }}>
          {item.percentage}%
        </span>
        <span style={{ color: "#9ca3af" }}>
          • {item.packages.toLocaleString()}
        </span>
      </div>
    </foreignObject>
  );
}

// Name + "25% · 2,500" label, drawn to the right of each horizontal bar's
// row band (mobile chart). Positioned at a fixed x (the reserved label
// column) rather than props.x/width, since those track the bar's *value*
// length, not the row's full width.
function RowLabel(props: any) {
  const { y, height, index, items, plotRight } = props;
  const item = items[index];
  const cy = y + height / 2;

  return (
    <foreignObject
      x={plotRight + 10}
      y={cy - 16}
      width={MOBILE_LABEL_WIDTH - 10}
      height={32}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "center",
          height: "100%",
          gap: 4,
        }}
      >
        <span style={{ fontSize: 13, color: "#6b7280" }}>{item.name}</span>
        <span style={{ fontSize: 11 }}>
          <span style={{ fontWeight: 600, color: "#262626" }}>
            {item.percentage}%
          </span>{" "}
          <span style={{ color: "#9ca3af" }}>
            &middot; {item.packages.toLocaleString()}
          </span>
        </span>
      </div>
    </foreignObject>
  );
}

export default function InventoryCard({ mode }: Props) {
  const data = INVENTORY_DATA[mode];
  const items = data.items;

  const [chartRef, chartSize] = useContainerSize<HTMLDivElement>();
  const plotWidth = Math.max(
    chartSize.width - CHART_MARGIN_LEFT - CHART_MARGIN_RIGHT,
    0
  );
  const bandWidth = items.length ? plotWidth / items.length : 0;

  const [mobileChartRef, mobileChartSize] = useContainerSize<HTMLDivElement>();
  const mobilePlotRight = Math.max(mobileChartSize.width - MOBILE_LABEL_WIDTH, 0);
  const mobileRowHeight = items.length
    ? mobileChartSize.height / items.length
    : 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:h-73.25">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[16px] font-medium text-[#333]">
          Warehouse Inventory
        </h3>

        <button className="text-gray-400">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="flex items-end gap-1">
        <h2 className="text-[24px] font-bold">
          {data.totalPackages.toLocaleString()}
        </h2>

        <p className="mb-2 text-[10px] text-gray-500">packages</p>
      </div>

      {items.length === 0 ? (
        <div className="mt-8 flex h-40 items-center justify-center rounded-xl border border-dashed border-gray-200 text-sm text-gray-400">
          No inventory data for this freight mode yet
        </div>
      ) : (
        <>
          {/* Mobile: real recharts horizontal BarChart (layout="vertical") */}
          <div
            ref={mobileChartRef}
            className="relative mt-2 sm:hidden"
            style={{ height: items.length * (MOBILE_BAR_SIZE + 24) }}
          >
            {mobileChartSize.height > 0 && (
              <div className="pointer-events-none absolute inset-0 z-10">
                {Array.from({ length: items.length - 1 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute inset-x-0 border-t border-dashed border-[#E5E7EB]"
                    style={{ top: mobileRowHeight * (i + 1) }}
                  />
                ))}
              </div>
            )}

            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                key={mode}
                data={items}
                layout="vertical"
                margin={{ top: 0, right: MOBILE_LABEL_WIDTH, left: 0, bottom: 0 }}
                barCategoryGap="30%"
              >
                <defs>
                  <linearGradient id="inv-track-m" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#F1F5F9" />
                    <stop offset="100%" stopColor="#F8FAFC" />
                  </linearGradient>

                  {items.map(
                    (item) =>
                      item.striped && (
                        <pattern
                          key={item.name}
                          id={`inv-stripe-m-${slug(item.name)}`}
                          width="8"
                          height="8"
                          patternTransform="rotate(45)"
                          patternUnits="userSpaceOnUse"
                        >
                          <rect width="8" height="8" fill={item.color} />
                          <line
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="8"
                            stroke="rgba(255,255,255,.35)"
                            strokeWidth="3"
                          />
                        </pattern>
                      )
                  )}
                </defs>

                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis type="category" dataKey="name" hide />

                <Bar
                  dataKey="percentage"
                  radius={[8, 8, 8, 8]}
                  background={{ fill: "url(#inv-track-m)", radius: 8 }}
                  barSize={MOBILE_BAR_SIZE}
                  animationDuration={900}
                  animationEasing="ease-out"
                >
                  {items.map((item) => (
                    <Cell
                      key={item.name}
                      fill={
                        item.striped
                          ? `url(#inv-stripe-m-${slug(item.name)})`
                          : item.color
                      }
                    />
                  ))}

                  <LabelList
                    dataKey="percentage"
                    content={(props: any) => (
                      <RowLabel {...props} items={items} plotRight={mobilePlotRight} />
                    )}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Desktop/tablet: recharts vertical bar chart */}
          <div ref={chartRef} className="relative mt-3 hidden h-[170px] sm:block">
            {/* Dashed dividers - positioned from the container's measured
                pixel width, using the same left/right margin as the chart. */}
            {chartSize.width > 0 && (
              <div className="pointer-events-none absolute inset-0 z-10">
                {Array.from({ length: items.length - 1 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute border-r border-dashed border-[#E5E7EB]"
                    style={{
                      left: CHART_MARGIN_LEFT + bandWidth * (i + 1),
                      top: 40,
                      bottom: 36,
                    }}
                  />
                ))}
              </div>
            )}

            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                key={mode}
                data={items}
                margin={{ top: 3, right: CHART_MARGIN_RIGHT, left: CHART_MARGIN_LEFT, bottom: 26 }}
                barCategoryGap="5%"
              >
                <defs>
                  <linearGradient id="inv-track" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#F1F5F9" />
                  </linearGradient>

                  {items.map(
                    (item) =>
                      item.striped && (
                        <pattern
                          key={item.name}
                          id={`inv-stripe-${slug(item.name)}`}
                          width="8"
                          height="8"
                          patternTransform="rotate(45)"
                          patternUnits="userSpaceOnUse"
                        >
                          <rect width="8" height="8" fill={item.color} />
                          <line
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="8"
                            stroke="rgba(255,255,255,.35)"
                            strokeWidth="3"
                          />
                        </pattern>
                      )
                  )}
                </defs>

                <YAxis hide domain={[0, 100]} />

                <XAxis
                  dataKey="name"
                  orientation="top"
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  height={40}
                  tick={<CategoryTick />}
                />

                <Bar
                  dataKey="percentage"
                  radius={[6, 6, 6, 6]}
                  background={{ fill: "url(#inv-track)", radius: 6 }}
                  maxBarSize={70}
                  animationDuration={900}
                  animationEasing="ease-out"
                >
                  {items.map((item) => (
                    <Cell
                      key={item.name}
                      fill={
                        item.striped
                          ? `url(#inv-stripe-${slug(item.name)})`
                          : item.color
                      }
                    />
                  ))}

                  <LabelList
                    dataKey="percentage"
                    content={(props: any) => (
                      <ValueLabel {...props} items={items} />
                    )}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}