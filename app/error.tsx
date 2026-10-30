"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f4f7fb] px-4 text-center">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl max-w-md w-full">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 mb-4">
          <AlertCircle size={28} />
        </div>
        <h2 className="text-xl font-black text-slate-900">Something went wrong</h2>
        <p className="mt-2 text-xs text-slate-500">
          {error.message || "An unexpected error occurred while loading this page."}
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition w-full sm:w-auto justify-center"
          >
            <RefreshCcw size={14} /> Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition w-full sm:w-auto justify-center"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
