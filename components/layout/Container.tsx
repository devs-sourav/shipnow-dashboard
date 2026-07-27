import { ReactNode } from "react";
import clsx from "clsx";
import { ContainerProps } from "@/types/common";



export default function Container({
  children,
  className,
}: ContainerProps) {
  return (
    <div
      className={clsx(
        "mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8",
        className
      )}
    >
      {children}
    </div>
  );
}