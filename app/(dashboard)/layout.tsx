"use client";

import type { ReactNode } from "react";
import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Presentation,
  Calendar,
  Truck,
  Waypoints,
  Warehouse,
  Bus,
  Contact,
  FileText,
  MessageSquare,
  Bell,
  Settings,
  ChevronDown,
  Search,
  Plus,
  Menu,
  X,
} from "lucide-react";

import Image from "next/image";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";
import PromoBanner from "@/components/sidebar/PromoBanner";

interface DashboardLayoutProps {
  children: ReactNode;
}

// ---- Time onujayi greeting ber korar function ----
function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour === 12) return "Good Noon";
  if (hour > 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 21) return "Good Evening";
  if (hour >= 21 && hour < 24) return "Good Night";
  return "Good Late Night"; // 12am - 5am
}

type TooltipState = { label: string; top: number; left: number } | null;

function SideTooltipPortal({ tooltip }: { tooltip: TooltipState }) {
  if (!tooltip) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <span
      role="tooltip"
      className="pointer-events-none fixed z-50 -translate-y-1/2 whitespace-nowrap rounded-lg bg-[#856DF3] px-3 py-1.5 text-xs font-medium text-white opacity-100 shadow-lg lg:hidden"
      style={{ top: tooltip.top, left: tooltip.left }}
    >
      <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#856DF3]" />
      {tooltip.label}
    </span>,
    document.body,
  );
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [greeting, setGreeting] = useState("Good Morning");
  const [tooltip, setTooltip] = useState<TooltipState>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setGreeting(getGreeting());
    const interval = setInterval(() => setGreeting(getGreeting()), 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Route change hole mobile drawer nijer theke bondho hoye jak
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // NOTE: widened from React.MouseEvent<HTMLElement> to
  // React.SyntheticEvent<HTMLElement> because this handler is used for both
  // onMouseEnter/onMouseLeave (MouseEvent) AND onFocus/onBlur (FocusEvent).
  // Only `currentTarget` is used inside, so SyntheticEvent<HTMLElement> is
  // the correct, minimal shared type for both event kinds.
  const showTooltip = useCallback(
    (e: React.SyntheticEvent<HTMLElement>, label: string) => {
      // lg breakpoint (>=1024px)-e sidebar full-width thake, tooltip lagbe na
      if (window.innerWidth >= 1024) return;
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltip({
        label,
        top: rect.top + rect.height / 2,
        left: rect.right + 8,
      });
    },
    [],
  );

  const hideTooltip = useCallback(() => setTooltip(null), []);

  const mainMenus = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Analytics", href: "/analytics", icon: Presentation },
    { title: "Calendar", href: "/calendar", icon: Calendar },
    { title: "Shipments", href: "/shipments", icon: Truck },
    { title: "Tracking", href: "/tracking", icon: Waypoints },
    { title: "Warehouse", href: "/warehouse", icon: Warehouse },
    { title: "Fleets", href: "/fleets", icon: Bus },
    { title: "Drivers", href: "/drivers", icon: Contact },
    { title: "Invoices & Billing", href: "/invoices", icon: FileText },
  ];

  const utilityMenus = [
    { title: "Message", href: "/messages", icon: MessageSquare, badge: 19 },
    { title: "Notification", href: "/notifications", icon: Bell, badge: 5 },
    { title: "Settings", href: "/settings", icon: Settings },
  ];

  const socialLinks = [
    { Icon: FaFacebookF, label: "Facebook", href: "https://facebook.com" },
    { Icon: FaTwitter, label: "Twitter", href: "https://twitter.com" },
    { Icon: FaInstagram, label: "Instagram", href: "https://instagram.com" },
    { Icon: FaYoutube, label: "Youtube", href: "https://youtube.com" },
    { Icon: FaLinkedinIn, label: "Linkedin", href: "https://linkedin.com" },
  ];

  const renderMenuItem = (
    menu: (typeof mainMenus)[number] & { badge?: number },
  ) => {
    const Icon = menu.icon;
    const active = pathname === menu.href;
    const label = menu.badge ? `${menu.title} (${menu.badge})` : menu.title;

    return (
      <Link
        key={menu.title}
        href={menu.href}
        aria-label={menu.title}
        aria-current={active ? "page" : undefined}
        onMouseEnter={(e) => showTooltip(e, label)}
        onMouseLeave={hideTooltip}
        onFocus={(e) => showTooltip(e, label)}
        onBlur={hideTooltip}
        className={`group flex items-center justify-center gap-3 rounded-xl px-4 py-2.5 outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-violet-400 lg:justify-between ${
          active
            ? "bg-violet-100 font-semibold text-violet-700"
            : "text-gray-500 hover:bg-violet-50 hover:text-violet-700"
        }`}
      >
        <span className="flex items-center gap-3">
          <Icon
            size={19}
            className={`shrink-0 transition ${
              active
                ? "text-violet-700"
                : "text-gray-400 group-hover:text-violet-700"
            }`}
          />
          <span className="hidden text-[15px] lg:inline">{menu.title}</span>
        </span>

        {menu.badge ? (
          <span className="hidden rounded-md bg-violet-600 px-2 py-0.5 text-xs font-semibold text-white lg:block">
            {menu.badge}
          </span>
        ) : null}
      </Link>
    );
  };

  const sidebarContent = (
    <>
      <div>
        {/* Logo + mobile close button */}
        <div className="mb-6 flex items-center justify-between gap-2 px-1 ">
          <div className="flex items-center gap-2">
            <Link href={"/dashboard"} className="hidden lg:block">
              <Image
                src="/assets/logo/Logo3.png"
                alt="logo"
                width={150}
                height={40}
                priority
              />
            </Link>
            <Link
              href={"/dashboard"}
              className="flex justify-center h-9 w-9 lg:hidden"
            >
              <Image
                src="/assets/logo/Logo2.png"
                alt="logo"
                width={30}
                height={30}
                priority
              />
            </Link>
          </div>
        </div>

        {/* User */}
        <button
          aria-label="John Doe, Admin"
          onMouseEnter={(e) => showTooltip(e, "John Doe · Admin")}
          onMouseLeave={hideTooltip}
          className="mb-6 flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-gray-100 px-2 py-2 text-left transition hover:bg-gray-50 lg:justify-between"
        >
          <span className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/100"
              alt="User"
              className="h-9 w-9 shrink-0 rounded-full object-cover"
            />
            <span className="hidden lg:inline">
              <span className="block text-sm font-semibold text-gray-900">
                John Doe
              </span>
              <span className="block text-xs text-gray-400">Admin</span>
            </span>
          </span>
          <ChevronDown size={16} className="hidden text-gray-400 lg:block" />
        </button>

        <nav className="space-y-1">{mainMenus.map(renderMenuItem)}</nav>
        <div className="my-4 border-t border-gray-100" />
        <nav className="space-y-1">{utilityMenus.map(renderMenuItem)}</nav>
      </div>

      <div className="hidden lg:block !mt-auto">
        <PromoBanner />
      </div>
    </>
  );

  return (
    <div className="flex h-full bg-gray-100">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar (collapsed icon-rail on md, full drawer on mobile via translate) */}
      <aside
        className={`fixed sm:block h-full left-0 z-40 flex  lg:w-64 flex-col justify-between overflow-y-auto overflow-x-hidden bg-white px-4 pb-5 pt-6 transition-transform duration-300 md:sticky md:top-0 md:w-20 md:translate-x-0 md:px-2  lg:px-4 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="px-3 pb-4 pt-4 sm:px-5">
          {/* Top row */}
          <div className="flex items-center justify-between gap-4">
            {/* Mobile: logo + page title */}
            <div className="flex items-center gap-2 md:hidden">
              <Image
                src="/assets/logo/Logo2.png"
                alt="logo"
                width={28}
                height={28}
              />
            </div>
            <h1 className="text-[16px] font-semibold md:hidden text-gray-900">
              Dashboard
            </h1>
            {/* Desktop: greeting */}
            <div className="hidden md:block">
              <p className="text-sm text-gray-500">Hello John!</p>
              <h1 className="text-2xl font-bold text-gray-900">{greeting}</h1>
            </div>

            {/* Desktop: search + add button */}
            <div className="hidden items-center gap-4 md:flex">
              <div className="flex w-72 items-center gap-2 rounded-xl bg-white px-4 py-2.5 shadow-sm">
                <Search size={18} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search anything"
                  className="w-full bg-transparent text-sm text-gray-600 outline-none placeholder:text-gray-400"
                />
              </div>

              <button className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700">
                <Plus size={16} />
                <span>Add New Shipping</span>
              </button>
            </div>

            {/* Mobile: hamburger */}
            <button
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="rounded-xl bg-white p-2.5 text-gray-500 shadow-sm cursor-pointer md:hidden"
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Mobile: search row + add button */}
          <div className="mt-4 flex items-center gap-3 md:hidden">
            <div className="flex flex-1 items-center gap-2 rounded-xl bg-white px-4 py-2.5 shadow-sm">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search anything"
                className="w-full bg-transparent text-sm text-gray-600 outline-none placeholder:text-gray-400"
              />
            </div>
            <button
              aria-label="Add New Shipping"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-white transition hover:bg-gray-800"
            >
              <Plus size={18} />
            </button>
          </div>
        </header>

        <main className="flex-1 px-3 pb-4 sm:px-4">{children}</main>

        <footer className="flex flex-col items-center justify-center gap-5 px-4 pb-2 text-sm md:flex-row md:justify-between md:px-6">
          {/* Left Side */}
          <div className="flex flex-col items-center gap-3 md:items-start">
            <p className="text-center lg:hidden  text-[#111111]">
              Copyright © 2025 Peterdraw
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-6 gap-y-2 text-gray-500">
              <p className="text-center lg:block hidden text-[#111111]">
                Copyright © 2025 Peterdraw
              </p>
              <a href="#" className="transition hover:text-gray-700">
                Privacy Policy
              </a>
              <a href="#" className="transition hover:text-gray-700">
                Terms & Conditions
              </a>
              <a href="#" className="transition hover:text-gray-700">
                Contact
              </a>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center justify-center gap-3">
            {socialLinks.map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-all hover:border-violet-300 hover:text-violet-700"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </footer>
      </div>

      <SideTooltipPortal tooltip={tooltip} />
    </div>
  );
}
