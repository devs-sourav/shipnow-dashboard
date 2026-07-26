import type { ReactNode } from "react";
import Link from "next/link";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white shadow-sm">
        <div className="border-b p-6">
          <h1 className="text-2xl font-bold text-blue-600">
            ShipNow
          </h1>
        </div>

        <nav className="flex flex-col gap-2 p-4">
          <Link
            href="/dashboard"
            className="rounded-md px-4 py-2 hover:bg-blue-50 hover:text-blue-600"
          >
            Dashboard
          </Link>

          <Link
            href="/shipments"
            className="rounded-md px-4 py-2 hover:bg-blue-50 hover:text-blue-600"
          >
            Shipments
          </Link>

          <Link
            href="/create-shipment"
            className="rounded-md px-4 py-2 hover:bg-blue-50 hover:text-blue-600"
          >
            Create Shipment
          </Link>

          <Link
            href="/warehouse"
            className="rounded-md px-4 py-2 hover:bg-blue-50 hover:text-blue-600"
          >
            Warehouse
          </Link>

          <Link
            href="/invoices"
            className="rounded-md px-4 py-2 hover:bg-blue-50 hover:text-blue-600"
          >
            Invoices
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
          <h2 className="text-xl font-semibold">
            ShipNow Dashboard
          </h2>

          <button className="rounded-md bg-red-500 px-4 py-2 text-white transition hover:bg-red-600">
            Logout
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}