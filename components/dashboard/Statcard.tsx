import { ReactNode } from "react";
import { PiArrowUpRightBold, PiArrowDownRightBold } from "react-icons/pi";

interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  trendValue: number;
  trendPeriod: string;
  icon: ReactNode;
}

export default function StatCard({
  label,
  value,
  unit,
  trendValue,
  trendPeriod,
  icon,
}: StatCardProps) {
  // trendValue-er sign onujayi color/arrow automatically thik hoye jay —
  // tai negative change bhulbosoto green e dekhabe na.
  const isPositive = trendValue >= 0;

  return (
    <div className="flex justify-between items-center justify-between p-4">
      {/* Top row: label + icon */}
      <div className=" flex flex-col gap-1">
        <p className="text-[13px] text-[#8C8C8C]">{label}</p>
        <div className="mt-1">
          <span className="text-[28px] md:text-[22px] lg:text-[28px] font-bold leading-none text-[#2D2D2D]">
            {value}
          </span>
          {unit && (
            <span className="ml-1.5 text-[12px] font-medium text-[#9B9B9B]">
              {unit}
            </span>
          )}
        </div>

        <div className="mt-1.5 flex items-center gap-1.5">
          <span
            className={`flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
              isPositive
                ? "bg-[#EAF8EF] text-[#1BAA55]"
                : "bg-[#FDECEC] text-[#E0453C]"
            }`}
          >
            {isPositive ? (
              <PiArrowUpRightBold size={10} />
            ) : (
              <PiArrowDownRightBold size={10} />
            )}
            {Math.abs(trendValue)}%
          </span>
          <span className="text-[11px] text-[#9B9B9B]">{trendPeriod}</span>
        </div>
      </div>
      <div className="flex w-11 h-11 md:h-8 lg:h-11 md:w-8 lg:w-11 shrink-0 items-center justify-center text-[20px] md:text-[16px] lg:text-[20px] rounded-xl bg-[#7C5CFA] text-white">
        {icon}
      </div>
      {/* Value */}

      {/* Trend */}
    </div>
  );
}
