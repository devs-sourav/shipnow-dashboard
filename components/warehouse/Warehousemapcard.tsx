"use client";

import { useState } from "react";
import { FreightMode } from "@/types/warehouse";
import { WAREHOUSE_MAP_DATA } from "@/data/Warehousemap";

interface Props {
    mode: FreightMode;
}

const FLOORS = [1, 2, 3];

// Badge is 40px (w-10) + 8px gap between badges.
const BADGE_SIZE = 40;
const BADGE_GAP = 8;
const CARD_PADDING = 32; // p-4 on both sides (16px * 2)

export default function WarehouseMapCard({ mode }: Props) {
    const [floor, setFloor] = useState<number>(1);
    const categoryBlocks = WAREHOUSE_MAP_DATA[mode][floor] ?? [];

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 lg:h-110.5 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <h3 className="text-base font-semibold mb-3 sm:mb-0 text-[#262626]">
                    Warehouse Map
                </h3>

                <div className="flex items-center rounded-lg bg-gray-100">
                    {FLOORS.map((f) => (
                        <button
                            key={f}
                            onClick={() => setFloor(f)}
                            className={`rounded-lg w-1/3 sm:w-auto px-4 py-2 text-sm font-medium transition-colors ${floor === f
                                    ? "bg-[#1C1C1E] text-white"
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Floor {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-3 rounded-2xl  bg-gray-50 p-4">
                {categoryBlocks.length === 0 ? (
                    <div className="flex h-32 items-center justify-center text-sm text-gray-400">
                        No sections mapped on this floor yet
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-4">
                        {categoryBlocks.map((block) => {
                            const sectionCount = block.sections.length;
                            // Min width fits every badge in one row — this trick is
                            // ONLY applied at lg+ (see className below). Below lg we
                            // let the card size naturally so badges wrap on their own
                            // instead of being squeezed by a min-width meant for a
                            // much wider viewport (that squeeze is what caused the
                            // uneven/empty-looking badge rows on mobile & tablet).
                            const minWidth =
                                sectionCount * BADGE_SIZE +
                                (sectionCount - 1) * BADGE_GAP +
                                CARD_PADDING;

                            return (
                                <div
                                    key={block.category}
                                    className="w-full rounded-xl border border-gray-200 bg-white p-4 sm:w-[calc(50%-0.5rem)] lg:w-auto lg:flex-none lg:basis-[var(--card-min-w)] lg:grow-[var(--card-grow)]"
                                    style={
                                        {
                                            "--card-min-w": `${minWidth}px`,
                                            "--card-grow": sectionCount,
                                        } as React.CSSProperties
                                    }
                                >
                                    <h4 className="text-[15px] font-semibold text-[#262626]">
                                        {block.category}
                                    </h4>

                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {block.sections.map((section) => (
                                            <div
                                                key={section.code}
                                                className={`flex h-10 w-10 items-center justify-center rounded-lg border text-[10px] font-medium ${section.status === "available"
                                                        ? "border-[#C4B5FD] bg-[#EDE9FE] text-[#333]"
                                                        : "border-gray-200 bg-gray-100 text-gray-400"
                                                    }`}
                                            >
                                                <span className="h-6 w-6 rounded-sm shadow-md bg-white flex justify-center items-center">{section.code}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <p className="mt-3 text-xs text-gray-400">
                                        Available Space{" "}
                                        <span className="font-semibold text-[#262626]">
                                            {block.availableSpace}
                                        </span>
                                        /{block.totalSpace}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="mt-4 flex items-center gap-5 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded border border-[#C4B5FD] bg-[#EDE9FE]" />
                    Available
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded border border-gray-200 bg-gray-100" />
                    Full
                </span>
            </div>
        </div>
    );
}