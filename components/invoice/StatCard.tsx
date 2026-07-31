"use client";

import { StatCardType } from "@/types/invoice";

interface Props {
  item: StatCardType;
}

export default function StatCard({ item }: Props) {
  const Icon = item.icon;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[#ECECEC] bg-white p-4 shadow-sm ">
      <div className="flex h-13 w-13 items-center justify-center rounded-xl bg-[#856DF3]">
        <Icon
          size={24}
          strokeWidth={2}
          className="text-white"
        />
      </div>

      <div className=" sm:text-right">
        <p className="text-[12px] mt-1.5 sm:mt-0 font-medium text-[#757575]">
          {item.title}
        </p>

        <h2 className="mt-1 sm:mt-2 text-[24px] sm:text-[28px] font-bold leading-none tracking-tight text-[#2B2B2F]">
          {item.amount}
        </h2>

        <div className="mt-4 flex  sm:justify-end items-center gap-2 text-[10px] text-[#757575]">
          <span>from</span>

          <span className="rounded-lg bg-[#DDF6E6] px-2 py-1 text-[#313131]">
            {item.invoices}
          </span>

          <span>Invoices</span>
        </div>
      </div>
    </div>
  );
}