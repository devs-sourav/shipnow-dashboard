"use client";

import { useState } from "react";
import { BarChart, Bar, Cell, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

interface ProductCategory {
  id: number;
  name: string;
  products: number;
  percentage: number;
  color: string;
  hex: string;
}

const productCategoriesData: ProductCategory[] = [
  { id: 1, name: "Electronics", products: 240, percentage: 24, color: "bg-violet-500", hex: "#8B5CF6" },
  { id: 2, name: "Home & Kitchen", products: 200, percentage: 20, color: "bg-violet-100", hex: "#EDE9FE" },
  { id: 3, name: "Apparel", products: 180, percentage: 18, color: "bg-neutral-900", hex: "#171717" },
  { id: 4, name: "Beauty & Health", products: 140, percentage: 14, color: "bg-neutral-500", hex: "#737373" },
  { id: 5, name: "Sports & Outdoors", products: 120, percentage: 12, color: "bg-neutral-200", hex: "#E5E5E5" },
  { id: 6, name: "Automotive", products: 120, percentage: 12, color: "bg-neutral-100", hex: "#F5F5F5" },
];

const productCategoriesTotal = productCategoriesData.reduce((sum, c) => sum + c.products, 0);

const productCategoriesChartData = [
  productCategoriesData.reduce(
    (acc, category) => ({ ...acc, [category.name]: category.products }),
    {} as Record<string, number>
  ),
];

// Driven entirely by activeCategory (set on segment hover), not by recharts' own
// payload matching — stacked bars share one data point so payload matching always
// resolves to the same entry regardless of which segment is actually hovered.
function SegmentTooltip({
  active,
  activeCategory,
}: {
  active?: boolean;
  activeCategory: number | null;
}) {
  if (!active || activeCategory === null) return null;

  const category = productCategoriesData.find((c) => c.id === activeCategory);
  if (!category) return null;

  return (
    <div className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-neutral-900">{category.name}</p>
      <p className="text-neutral-500">
        {category.products} products · {category.percentage}%
      </p>
    </div>
  );
}

export default function ProductCategories() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  return (
    <div className="w-full h-full  rounded-2xl bg-white px-4 pt-4 pb-2 ">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-neutral-900">Product Categories</h3>
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
        >
          <HiOutlineDotsHorizontal size={16} />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-neutral-400">Total Products</span>
        <span className="text-2xl font-bold text-neutral-900">
          {productCategoriesTotal.toLocaleString()}
        </span>
      </div>

      <div className="mt-4 h-[60px] w-full overflow-visible rounded-lg">
        <ResponsiveContainer width="100%" height={60}>
          <BarChart
            layout="vertical"
            data={productCategoriesChartData}
            barSize={60}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            onMouseLeave={() => setActiveCategory(null)}
          >
            <XAxis type="number" domain={[0, productCategoriesTotal]} hide />
            <YAxis type="category" hide />
            <Tooltip
              content={(props) => <SegmentTooltip {...props} activeCategory={activeCategory} />}
              cursor={false}
              wrapperStyle={{ outline: "none", zIndex: 50 }}
              position={{ y: 66 }}
              allowEscapeViewBox={{ x: false, y: true }}
            />
            <Bar
              dataKey={productCategoriesData[0].name}
              stackId="a"
              isAnimationActive={false}
              radius={[8, 0, 0, 8]}
              onMouseEnter={() => setActiveCategory(productCategoriesData[0].id)}
            >
              <Cell
                fill={productCategoriesData[0].hex}
                opacity={activeCategory === null || activeCategory === productCategoriesData[0].id ? 1 : 0.35}
                style={{ transition: "opacity 150ms ease" }}
              />
            </Bar>
            {productCategoriesData.slice(1, -1).map((category) => (
              <Bar
                key={category.id}
                dataKey={category.name}
                stackId="a"
                isAnimationActive={true}
                onMouseEnter={() => setActiveCategory(category.id)}
              >
                <Cell
                  fill={category.hex}
                  opacity={activeCategory === null || activeCategory === category.id ? 1 : 0.35}
                  style={{ transition: "opacity 150ms ease" }}
                />
              </Bar>
            ))}
            <Bar
              dataKey={productCategoriesData[productCategoriesData.length - 1].name}
              stackId="a"
              isAnimationActive={false}
              radius={[0, 8, 8, 0]}
              onMouseEnter={() =>
                setActiveCategory(productCategoriesData[productCategoriesData.length - 1].id)
              }
            >
              <Cell
                fill={productCategoriesData[productCategoriesData.length - 1].hex}
                opacity={
                  activeCategory === null ||
                  activeCategory === productCategoriesData[productCategoriesData.length - 1].id
                    ? 1
                    : 0.35
                }
                style={{ transition: "opacity 150ms ease" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <ul className="mt-5 ">
        {productCategoriesData.map((category) => (
          <li
            key={category.id}
            onMouseEnter={() => setActiveCategory(category.id)}
            onMouseLeave={() => setActiveCategory(null)}
            className={`flex items-center justify-between rounded-lg px-1.5 py-2 -mx-1.5 transition-colors duration-150 ${
              activeCategory === category.id ? "bg-neutral-50" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${category.color} ${
                  category.hex === "#F5F5F5" || category.hex === "#EDE9FE" ? "ring-1 ring-neutral-200" : ""
                }`}
              />
              <span className="text-sm text-neutral-700">{category.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-neutral-100 px-2 py-1 text-xs text-neutral-500">
                {category.products} products
              </span>
              <span className="w-8 text-right text-xs font-semibold text-neutral-900">
                {category.percentage}%
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}