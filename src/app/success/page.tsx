"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const eventName = searchParams.get("event") || "Program";

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-600 to-green-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Pendaftaran Berjaya!
        </h1>

        <p className="text-gray-600 mb-4">
          Terima kasih kerana hadir ke program:
        </p>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="font-semibold text-blue-800">{eventName}</p>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Maklumat anda telah direkodkan. Anda boleh menutup halaman ini.
        </p>

        <div className="border-t pt-4">
          <p className="text-xs text-gray-400">PERKESO Keningau</p>
        </div>

        <Link
          href="/"
          className="mt-4 inline-block text-sm text-blue-600 hover:underline"
        >
          Kembali ke halaman utama
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-green-600 to-green-800 flex items-center justify-center">
          <p className="text-white">Memuatkan...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
