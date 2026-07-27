"use client";

import type { ReactNode } from "react";
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

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

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
    { Icon: FaFacebookF, label: "Facebook" },
    { Icon: FaTwitter, label: "Twitter" },
    { Icon: FaInstagram, label: "Instagram" },
    { Icon: FaYoutube, label: "Youtube" },
    { Icon: FaLinkedinIn, label: "Linkedin" },
  ];

  const renderMenuItem = (
    menu: (typeof mainMenus)[number] & { badge?: number },
  ) => {
    const Icon = menu.icon;
    const active = pathname === menu.href;

    return (
      <Link
        key={menu.title}
        href={menu.href}
        className={`group flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 transition-all duration-200 ${
          active
            ? "bg-violet-100 font-semibold text-violet-700"
            : "text-gray-500 hover:bg-violet-50 hover:text-violet-700"
        }`}
      >
        <span className="flex items-center gap-3">
          <Icon
            size={19}
            className={`transition ${
              active
                ? "text-violet-700"
                : "text-gray-400 group-hover:text-violet-700"
            }`}
          />
          <span className="text-[15px]">{menu.title}</span>
        </span>

        {menu.badge ? (
          <span className="rounded-md bg-violet-600 px-2 py-0.5 text-xs font-semibold text-white">
            {menu.badge}
          </span>
        ) : null}
      </Link>
    );
  };

  return (
    <div className="flex h-full bg-gray-100">
      {/* Sidebar */}
      <aside className=" h-auto w-[260px]  overflow-y-auto flex flex-col justify-between bg-white px-4 pb-5 pt-6">
        {/* Logo */}
        <div >
          <div className="mb-6 flex items-center gap-2 px-1">
            <Image
              src="/assets/logo/Logo3.png"
              alt="logo"
              width={150}
              height={40}
              priority
            />
          </div>

          {/* User */}
          <button className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-gray-100 px-2 py-2 text-left transition hover:bg-gray-50">
            <span className="flex items-center gap-3">
              <img
                src="https://i.pravatar.cc/100"
                alt="User"
                className="h-9 w-9 rounded-full object-cover"
              />
              <span>
                <span className="block text-sm font-semibold text-gray-900">
                  John Doe
                </span>
                <span className="block text-xs text-gray-400">Admin</span>
              </span>
            </span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>

          {/* Main Menu */}
          <nav className="space-y-1">{mainMenus.map(renderMenuItem)}</nav>

          {/* Divider */}
          <div className="my-4 border-t border-gray-100" />

          {/* Utility Menu */}
          <nav className="space-y-1">{utilityMenus.map(renderMenuItem)}</nav>

          {/* Spacer pushes upgrade card down like reference */}
          <div className="flex-1" />
        </div>{" "}
        <PromoBanner />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-8 pb-4 pt-6">
          <div>
            <p className="text-sm text-gray-500">Hello John!</p>
            <h1 className="text-2xl font-bold text-gray-900">Good Morning</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex w-72 items-center gap-2 rounded-xl bg-white px-4 py-2.5 shadow-sm">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search anything"
                className="w-full bg-transparent text-sm text-gray-600 outline-none placeholder:text-gray-400"
              />
            </div>

            <button className="flex items-center gap-2 rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800">
              <Plus size={16} />
              Add New Shipping
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-8 pb-4">{children}</main>

        <footer className="flex items-center justify-between px-8 py-2 text-sm text-gray-500">
          <div className="flex items-center gap-8">
            <p className="text-[#111111]">Copyright © 2025 Peterdraw</p>
            <a href="#" className="transition hover:text-gray-700">
              Privacy Policy
            </a>
            <a href="#" className="transition hover:text-gray-700">
              Term and conditions
            </a>
            <a href="#" className="transition hover:text-gray-700">
              Contact
            </a>
          </div>

          <div className="flex items-center gap-3">
            {socialLinks.map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-violet-300 hover:text-violet-700"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}
