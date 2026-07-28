"use client";

import { useMemo, useRef, useState } from "react";
import { Search, Plus, Minus, Navigation2, ArrowLeftRight, MapPin, Flag } from "lucide-react";

interface ShipmentLeg {
  city: string;
  date: string;
}

interface Point {
  x: number;
  y: number;
}

interface Shipment {
  id: string;
  status: string;
  schedule: string;
  courier: string;
  courierService: string;
  progress: number; // 0-100, how far along `route` the shipment currently is
  route: Point[]; // 3+ points describing the road/flight path
  origin: ShipmentLeg;
  destination: ShipmentLeg;
}

// Replace this with a real lookup (API call / DB query) keyed by shipment id.
const SHIPMENTS: Record<string, Shipment> = {
  SH8743921: {
    id: "SH8743921",
    status: "In Transit",
    schedule: "On Schedule",
    courier: "Daniel Cooper",
    courierService: "SkyLogix Express",
    progress: 46,
    route: [
      { x: -20, y: 195 },
      { x: 18, y: 148 },
      { x: 95, y: 128 },
      { x: 205, y: 92 },
      { x: 440, y: 4 },
    ],
    origin: { city: "San Francisco, CA, USA", date: "Mar 19, 2035 - 10:30 AM" },
    destination: {
      city: "New York, NY, USA",
      date: "Mar 23, 2035 - 03:00 PM (estimated)",
    },
  },
  SH1029384: {
    id: "SH1029384",
    status: "In Transit",
    schedule: "Delayed",
    courier: "Maria Alvarez",
    courierService: "Coastal Freight Co.",
    progress: 72,
    route: [
      { x: -20, y: 30 },
      { x: 90, y: 60 },
      { x: 190, y: 150 },
      { x: 300, y: 130 },
      { x: 440, y: 200 },
    ],
    origin: { city: "Seattle, WA, USA", date: "Mar 21, 2035 - 08:00 AM" },
    destination: {
      city: "Austin, TX, USA",
      date: "Mar 25, 2035 - 06:15 PM (estimated)",
    },
  },
  SH5502217: {
    id: "SH5502217",
    status: "Out for Delivery",
    schedule: "On Schedule",
    courier: "James Okafor",
    courierService: "SkyLogix Express",
    progress: 90,
    route: [
      { x: 10, y: 210 },
      { x: 120, y: 170 },
      { x: 260, y: 175 },
      { x: 340, y: 90 },
      { x: 420, y: 20 },
    ],
    origin: { city: "Chicago, IL, USA", date: "Mar 22, 2035 - 11:45 AM" },
    destination: {
      city: "Detroit, MI, USA",
      date: "Mar 23, 2035 - 02:30 PM (estimated)",
    },
  },
};

const DEFAULT_SHIPMENT_ID = "SH8743921";
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;
// Extra breathing room (in route-space units) around the route's bounding
// box so the start/end markers never sit flush against the SVG edge, and
// so the pin icons (which have real pixel width/height) never get clipped
// by the map container's overflow-hidden.
const BBOX_PADDING = 44;

// Walks a multi-point polyline and returns the point sitting at `fraction`
// (0-1) of the total path length, plus the index of the segment it falls on -
// this is what lets the marker sit correctly on a bent route.
function pointAtFraction(
  points: Point[],
  fraction: number,
): { point: Point; segmentIndex: number } {
  const segmentLengths: number[] = [];
  let totalLength = 0;

  for (let i = 0; i < points.length - 1; i++) {
    const dx = points[i + 1].x - points[i].x;
    const dy = points[i + 1].y - points[i].y;
    const length = Math.sqrt(dx * dx + dy * dy);
    segmentLengths.push(length);
    totalLength += length;
  }

  let target = Math.max(0, Math.min(1, fraction)) * totalLength;

  for (let i = 0; i < segmentLengths.length; i++) {
    if (target <= segmentLengths[i] || i === segmentLengths.length - 1) {
      const t = segmentLengths[i] === 0 ? 0 : target / segmentLengths[i];
      const a = points[i];
      const b = points[i + 1];
      return {
        point: { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t },
        segmentIndex: i,
      };
    }
    target -= segmentLengths[i];
  }

  return { point: points[points.length - 1], segmentIndex: points.length - 2 };
}

function toPolylinePoints(points: Point[]): string {
  return points.map((p) => `${p.x},${p.y}`).join(" ");
}

// Computes a viewBox (and matching pixel-space bounds) that tightly wraps
// the route's own bounding box instead of a fixed 400x224 frame. This is
// what keeps the start/end points on-screen: previously the route's real
// coordinates (e.g. x=-20 or x=440) fell outside the fixed viewBox and got
// clipped by the SVG, which was worst at low zoom.
function routeBounds(points: Point[]) {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs) - BBOX_PADDING;
  const maxX = Math.max(...xs) + BBOX_PADDING;
  const minY = Math.min(...ys) - BBOX_PADDING;
  const maxY = Math.max(...ys) + BBOX_PADDING;
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

export default function LiveTracking() {
  const [zoom, setZoom] = useState<number>(1.35);
  const [query, setQuery] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>(DEFAULT_SHIPMENT_ID);

  // While the user is dragging the handle this holds a live 0-100 preview value.
  // It's null when not dragging, so the bar/marker fall back to the real progress.
  const [dragProgress, setDragProgress] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const shipment = SHIPMENTS[selectedId] ?? SHIPMENTS[DEFAULT_SHIPMENT_ID];
  const displayProgress = dragProgress ?? shipment.progress;

  const suggestions = useMemo(() => {
    const cleaned = query.trim().toUpperCase().replace(/^#/, "");
    if (!cleaned) return Object.values(SHIPMENTS);
    return Object.values(SHIPMENTS).filter(
      (s) =>
        s.id.includes(cleaned) || s.courier.toUpperCase().includes(cleaned),
    );
  }, [query]);

  // Bounds are derived from the route itself (not a fixed constant), so
  // every shipment's full path -  including its start and end points -
  // fits inside the visible frame regardless of zoom level.
  const bounds = useMemo(() => routeBounds(shipment.route), [shipment]);
  const viewBox = `${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`;

  const { traveled, remaining, markerPoint, markerAngle } = useMemo(() => {
    const { point, segmentIndex } = pointAtFraction(
      shipment.route,
      displayProgress / 100,
    );
    const traveledPoints = [
      ...shipment.route.slice(0, segmentIndex + 1),
      point,
    ];
    const remainingPoints = [point, ...shipment.route.slice(segmentIndex + 1)];

    // Heading of the segment the marker currently sits on. Navigation2 points
    // "up" by default, so +90deg maps a rightward vector (dx>0, dy=0) to a
    // 90deg clockwise rotation, which is correct since our y-axis points down.
    const a = shipment.route[segmentIndex];
    const b = shipment.route[segmentIndex + 1];
    const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI + 90;

    return {
      traveled: traveledPoints,
      remaining: remainingPoints,
      markerPoint: point,
      markerAngle: angle,
    };
  }, [shipment, displayProgress]);

  // Marker position as a % of the container, expressed relative to the same
  // bounding box used for the SVG viewBox (not the old fixed 400/224), so
  // the marker and the route line always agree on where "on screen" is.
  const markerLeftPct = ((markerPoint.x - bounds.x) / bounds.width) * 100;
  const markerTopPct = ((markerPoint.y - bounds.y) / bounds.height) * 100;

  // Fixed pins for the route's start and end (origin/destination), positioned
  // the same way as the moving marker so they stay put on the path
  // regardless of zoom or drag progress.
  const startPoint = shipment.route[0];
  const endPoint = shipment.route[shipment.route.length - 1];
  const startLeftPct = ((startPoint.x - bounds.x) / bounds.width) * 100;
  const startTopPct = ((startPoint.y - bounds.y) / bounds.height) * 100;
  const endLeftPct = ((endPoint.x - bounds.x) / bounds.width) * 100;
  const endTopPct = ((endPoint.y - bounds.y) / bounds.height) * 100;

  function selectShipment(id: string) {
    setSelectedId(id);
    setQuery(id);
    setShowSuggestions(false);
  }

  function handleZoomIn() {
    setZoom((z) => Math.min(MAX_ZOOM, Math.round((z + ZOOM_STEP) * 100) / 100));
  }

  function handleZoomOut() {
    setZoom((z) => Math.max(MIN_ZOOM, Math.round((z - ZOOM_STEP) * 100) / 100));
  }

  function progressFromClientX(clientX: number): number {
    const bar = progressBarRef.current;
    if (!bar) return displayProgress;
    const rect = bar.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    return Math.max(0, Math.min(100, Math.round(ratio * 100)));
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    setDragProgress(progressFromClientX(e.clientX));
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging) return;
    setDragProgress(progressFromClientX(e.clientX));
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);
    setDragProgress(null); // snaps back to the real shipment.progress, animated by the transition classes
  }

  return (
    <div className="w-full relative mx-auto rounded-2xl bg-[#F4F3F1]">
      {/* Map area
          - was a hard-coded h-[242px], which stayed the same pixel height
            even when the card's width shrank on mobile, making the map look
            disproportionately tall/short depending on screen size.
          - now sized with aspect-ratio + min/max clamps so it scales with
            the container width and still looks right on narrow phones. */}
      <div className="relative w-full h-[220px] sm:h-[420px] overflow-hidden rounded-xl bg-[#f4f3f1]">
        {/* zoomable map content: grid + route + marker scale together, chrome (search/zoom) stays fixed
            - mobile: full inset-0 (no card overlapping, so no bottom offset needed)
            - desktop (sm+): bottom offset reserved so the route doesn't sit under the info card */}
        <div
          className="absolute inset-0 sm:bottom-[145px]"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "center center",
            transition: "transform 200ms ease-out",
          }}
        >
          <svg
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern
                id="grid"
                width="28"
                height="28"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 28 0 L 0 0 0 28"
                  fill="none"
                  stroke="#e8e6e1"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          <svg
            className="absolute inset-0 h-full w-full"
            viewBox={viewBox}
            preserveAspectRatio="none"
          >
            {displayProgress > 0 && (
              <polyline
                points={toPolylinePoints(traveled)}
                fill="none"
                stroke="#171717"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
            {displayProgress < 100 && (
              <polyline
                points={toPolylinePoints(remaining)}
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>

          {/* fixed pin at the route's origin - center-anchored on the point
              (not pointing-down style) so it can never poke outside the
              padded bounding box and get clipped by overflow-hidden */}
          <div
            className="absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-900 shadow-md"
            style={{
              left: `${startLeftPct}%`,
              top: `${startTopPct}%`,
            }}
          >
            <MapPin size={14} className="fill-white text-white" />
          </div>

          {/* fixed pin at the route's destination - same center-anchor approach */}
          <div
            className="absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-emerald-600 shadow-md"
            style={{
              left: `${endLeftPct}%`,
              top: `${endTopPct}%`,
            }}
          >
            <Flag size={14} className="fill-white text-white" />
          </div>

          {/* moving marker showing the shipment's current position/progress */}
          <div
            className={`absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-violet-500 shadow-md ring-4 ring-violet-200 ${
              isDragging ? "" : "transition-[left,top] duration-300 ease-out"
            }`}
            style={{
              left: `${markerLeftPct}%`,
              top: `${markerTopPct}%`,
            }}
          >
            <div
              className={
                isDragging ? "" : "transition-transform duration-300 ease-out"
              }
              style={{ transform: `rotate(${markerAngle}deg)` }}
            >
              <Navigation2 size={16} className="fill-white text-white" />
            </div>
          </div>
        </div>

        {/* search bar
            - was w-[254px] (fixed width) + right-16, which on narrow phone
              widths pushed the suggestion list/search box right up against
              (or past) the zoom controls.
            - now width flexes between left-3 and right-16, capped with
              max-w so it never grows too wide on larger screens either. */}
        <div className="absolute left-3 right-16 top-3  w-[93%] sm:max-w-[254px]">
          <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-sm">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
              placeholder="Search by Shipping ID..."
              className="w-full bg-transparent text-sm text-neutral-700 placeholder:text-neutral-400 outline-none"
            />
            <Search size={16} className="text-neutral-400 shrink-0" />
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="mt-1.5 max-h-40 overflow-y-auto rounded-xl bg-white p-1 shadow-md">
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onMouseDown={() => selectShipment(s.id)}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left hover:bg-neutral-50 ${
                    s.id === selectedId ? "bg-violet-50" : ""
                  }`}
                >
                  <span className="text-xs font-medium text-neutral-900">
                    #{s.id}
                  </span>
                  <span className="text-xs text-neutral-400">{s.courier}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* zoom controls */}
        <div className="absolute right-3 top-[60%] sm:top-3 flex flex-col overflow-hidden rounded-lg bg-white shadow-sm">
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoom >= MAX_ZOOM}
            className="flex h-8 w-8 items-center justify-center text-neutral-600 hover:bg-neutral-50 disabled:opacity-30"
          >
            <Plus size={16} />
          </button>
          <div className="h-px w-full bg-neutral-100" />
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoom <= MIN_ZOOM}
            className="flex h-8 w-8 items-center justify-center text-neutral-600 hover:bg-neutral-50 disabled:opacity-30"
          >
            <Minus size={16} />
          </button>
        </div>
      </div>

      {/* info card - desktop (unchanged, hidden entirely on mobile so it
          doesn't take up any space or overlap the map) */}
      <div className="hidden sm:block bg-[#f4f3f1] absolute left-0 bottom-0 sm:w-[425px] lg:w-full px-3 pb-3 rounded-b-2xl mt-0 ">
        <div className="rounded-xl bg-white p-3 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-base font-semibold text-neutral-900">
                #{shipment.id}
              </p>
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
                  {shipment.status}
                </span>
                <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
                  {shipment.schedule}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-400">Courier:</p>
              <p className="text-sm font-semibold text-neutral-900">
                {shipment.courier}
              </p>
              <p className="text-xs text-neutral-400">
                {shipment.courierService}
              </p>
            </div>
          </div>

          {/* draggable progress bar: scrub to preview, release to snap back to the real progress */}
          <div
            ref={progressBarRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="relative mt-5 flex h-5 items-center cursor-pointer touch-none select-none"
          >
            <div className="h-1 w-full rounded-full bg-neutral-100">
              <div
                className={`h-1 rounded-full bg-violet-500 ${isDragging ? "" : "transition-[width] duration-300 ease-out"}`}
                style={{ width: `${displayProgress}%` }}
              />
            </div>
            <div className="absolute left-0 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-violet-500 bg-white" />
            <div
              className={`absolute flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full bg-violet-500 text-white ${
                isDragging ? "" : "transition-[left] duration-300 ease-out"
              }`}
              style={{ left: `${displayProgress}%` }}
            >
              <ArrowLeftRight size={12} />
            </div>
            <div className="absolute right-0 h-3.5 w-3.5 translate-x-1/2 rounded-full border-2 border-neutral-200 bg-white" />
          </div>

          <div className="mt-3 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-900">
                {shipment.origin.city}
              </p>
              <p className="text-xs text-neutral-400">{shipment.origin.date}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-neutral-900">
                {shipment.destination.city}
              </p>
              <p className="text-xs text-neutral-400">
                {shipment.destination.date}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* info card - mobile (normal flow, sits below the map, no overlap) */}
      <div className="bg-white sm:w-[425px] sm:hidden lg:w-full rounded-b-2xl">
        <div className="rounded-xl bg-white px-4 pb-4 pt-3 block sm:hidden">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-base font-semibold text-neutral-900">
                #{shipment.id}
              </p>
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-violet-700">
                  {shipment.status}
                </span>
                <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] sm:text-xs  font-medium text-neutral-600">
                  {shipment.schedule}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-400">Courier:</p>
              <p className="text-sm font-semibold text-neutral-900">
                {shipment.courier}
              </p>
              <p className="text-xs text-neutral-400">
                {shipment.courierService}
              </p>
            </div>
          </div>

          {/* draggable progress bar: scrub to preview, release to snap back to the real progress */}
          <div
            ref={progressBarRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="relative mt-5 flex h-5 items-center cursor-pointer touch-none select-none"
          >
            <div className="h-1 w-full rounded-full bg-neutral-100">
              <div
                className={`h-1 rounded-full bg-violet-500 ${isDragging ? "" : "transition-[width] duration-300 ease-out"}`}
                style={{ width: `${displayProgress}%` }}
              />
            </div>
            <div className="absolute left-0 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-violet-500 bg-white" />
            <div
              className={`absolute flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full bg-violet-500 text-white ${
                isDragging ? "" : "transition-[left] duration-300 ease-out"
              }`}
              style={{ left: `${displayProgress}%` }}
            >
              <ArrowLeftRight size={12} />
            </div>
            <div className="absolute right-0 h-3.5 w-3.5 translate-x-1/2 rounded-full border-2 border-neutral-200 bg-white" />
          </div>

          <div className="mt-3 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-900">
                {shipment.origin.city}
              </p>
              <p className="text-xs text-neutral-400">{shipment.origin.date}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-neutral-900">
                {shipment.destination.city}
              </p>
              <p className="text-xs text-neutral-400">
                {shipment.destination.date}
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}