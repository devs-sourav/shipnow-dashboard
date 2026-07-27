import Image from "next/image";

export default function PromoBanner() {
  return (
    <div className="w-full mt-20">
      <div className="relative w-full overflow-hidden rounded-lg bg-[#262626]  px-4 py-6">
        {/* Decorative parallelogram shapes - top right */}
        <Image
          src="/assets/images/Patterns.png"
          alt="Promo Banner Shape"
          width={56}
          height={65}
          className="absolute right-0 top-0"
        />

        {/* Content */}
        <div className="relative max-w-md">
          <h2 className="text-[24px] font-bold pr-8 leading-tight text-white s">
            Loving ShipNow Free?
          </h2>

          <p className="mt-3 text-=[12px] leading-6 text-neutral-300">
            Go Pro to access priority support, real-time tracking, and full
            analytics.
          </p>

          <button
            type="button"
            className="mt-4 w-full rounded-lg text-center py-2 bg-white  text-lg font-semibold text-neutral-900 transition-opacity hover:opacity-90 "
          >
            Go Pro Today
          </button>
        </div>
      </div>
    </div>
  );
}