"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error:", error);
  }, [error]);

  return (
    <html lang="id">
      <body className="flex min-h-screen items-center justify-center bg-slate-900 text-white p-4 font-sans">
        <div className="max-w-md w-full rounded-2xl border border-slate-800 bg-slate-950 p-6 text-center">
          <h2 className="text-xl font-bold text-red-400">Application Error</h2>
          <p className="mt-2 text-xs text-slate-400">
            {error.message || "A critical error occurred."}
          </p>
          <button
            onClick={() => reset()}
            className="mt-6 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
          >
            Refresh Application
          </button>
        </div>
      </body>
    </html>
  );
}
