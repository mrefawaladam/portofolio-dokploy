import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f4f7fb] px-4 text-center">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl max-w-md w-full">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
          <FileQuestion size={28} />
        </div>
        <span className="eyebrow text-blue-700">404 Error</span>
        <h2 className="text-2xl font-black text-slate-900 mt-2">Page Not Found</h2>
        <p className="mt-2 text-xs text-slate-500">
          Halaman yang Anda cari tidak ditemukan atau telah dipindahkan.
        </p>
        <div className="mt-6 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition"
          >
            <ArrowLeft size={14} /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
