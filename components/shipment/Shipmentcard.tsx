import { Plane, Truck, Ship, TrainFront, MapPin } from "lucide-react";
import type { Shipment, Status, Mode } from "@/types/shipment";
import { IoMdPin } from "react-icons/io";
import Image from "next/image";

/* ------------------------------------------------------------------ */
/*  Style helpers                                                     */
/* ------------------------------------------------------------------ */

const STATUS_STYLES: Record<Status, string> = {
  "In Transit": "bg-[#E3DDFF] text-[#333]",
  "Out for Delivery": "bg-gray-100 text-[#333]",
  Delivered: "bg-emerald-100 text-[#333]",
  Processing: "bg-amber-100 text-[#333]",
};

function ModeIcon({ mode }: { mode: Mode }) {
  const cls = "h-5 w-5 text-gray-500";
  switch (mode) {
    case "air":
      return <Plane className={cls} />;
    case "truck":
      return <Truck className={cls} />;
    case "ship":
      return <Ship className={cls} />;
    case "train":
      return <TrainFront className={cls} />;
  }
}

function CompanyLogo({ logoImage }: { logoImage: string }) {
  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
    >
      <Image src={logoImage} width={36} height={36}  alt={logoImage}/>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Card                                                               */
/* ------------------------------------------------------------------ */

export default function ShipmentCard({ s }: { s: Shipment }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[15px] font-semibold text-gray-900">{s.id}</p>
          <span
            className={`mt-1 inline-block rounded-md px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[s.status]}`}
          >
            {s.status}
          </span>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
          <ModeIcon mode={s.mode} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <CompanyLogo logoImage={s.logoImage} />
        <div>
          <p className="text-sm font-semibold text-gray-900">{s.company}</p>
          <p className="text-xs text-gray-500">{s.category}</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-[#F5F5F5] p-3">
        <div className="flex gap-1">
          {/* Timeline */}
          <div className="flex flex-col items-center">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E3DDFF]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#856DF3]" />
            </span>

            <span className="my-1 h-[42px] w-0.5 bg-[#E3DDFF]" />

            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E3DDFF]">
              <IoMdPin className="text-[11px] text-[#856DF3]" />
            </span>
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* Origin */}
            <div className="flex items-start justify-between">
              <p className="min-w-[10%] mt-0.5 text-xs font-semibold text-[#757575]">
                Origin
              </p>

              <div className="text-right">
                <p className="text-sm font-semibold text-[#333333]">
                  {s.originCity}
                </p>
                <p className="mt-1 text-[10px] text-[#757575]">{s.originDate}</p>
              </div>
            </div>

            {/* Divider */}
            <div className="my-4 border-t border-dashed border-[#E2E2E2]" />

            {/* Destination */}
            <div className="flex items-start justify-between">
              <p className="w-[15%] text-xs font-semibold text-[#757575]">
                Destination
              </p>

              <div className="text-right -mt-0.5">
                <p className="text-sm font-semibold text-[#333333]">
                  {s.destinationCity}
                </p>
                <p className="mt-1 text-[10px] text-[#757575]">
                  {s.destinationDate}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="text-gray-500">
          Progress{" "}
          <span className="font-semibold text-gray-900">{s.progress}%</span>
        </span>
        <span className="text-gray-500">
          Carriers{" "}
          <span className="font-semibold text-gray-900">{s.carrier}</span>
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-violet-500"
          style={{ width: `${s.progress}%` }}
        />
      </div>
    </div>
  );
}
