"use client";

import Link from "next/link";
import { FiHome, FiArrowLeft } from "react-icons/fi";

/**
 * 404 — Not Found page
 * Drop this in app/not-found.tsx (App Router) or use as a component
 * anywhere else. Requires: `npm i react-icons`
 *
 * Page background: white
 * Illustration: the original dribbble gif, shown responsively
 */
export default function NotFound() {
  return (
    <section className="min-h-screen w-full bg-white flex items-center justify-center px-6 py-16">
      <div className="w-full  text-center">
        {/* Illustration */}
        <div
          className="mx-auto mb-6 h-[220px] sm:h-[520px] w-full  bg-center bg-contain bg-no-repeat"
          style={{
            backgroundImage:
              "url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)",
          }}
          role="img"
          aria-label="404 illustration — page not found"
        />
        <div className="-mt-30">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Looks like you&apos;re lost
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-500">
            The page you&apos;re looking for isn&apos;t available. It may have
            been moved or no longer exists.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              <FiHome className="h-4 w-4" />
              Go to Home
            </Link>

            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
            >
              <FiArrowLeft className="h-4 w-4" />
              Go back
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
