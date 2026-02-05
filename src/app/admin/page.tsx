"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AdminPage() {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/verify-passcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });

      const data = await res.json();

      if (data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem("adminPasscode", passcode);
      } else {
        setError(data.error || "Kod akses tidak sah");
      }
    } catch {
      setError("Gagal menghubungi server");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasscode("");
    sessionStorage.removeItem("adminPasscode");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="logo-container mx-auto mb-4">
              <Image
                src="/perkeso-logo.png"
                alt="Logo PERKESO"
                width={80}
                height={80}
                className="logo-perkeso mx-auto"
                priority
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              PERKESO Keningau
            </h1>
            <p className="text-gray-600 mt-1">Panel Admin - Sistem Kehadiran</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kod Akses
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Masukkan kod akses"
                required
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? "Mengesahkan..." : "Masuk"}
            </button>
          </form>

          <Link
            href="/"
            className="block mt-4 text-center text-sm text-blue-600 hover:underline"
          >
            ← Kembali ke Laman Utama
          </Link>
        </div>
      </div>
    );
  }

  // Menu utama selepas login
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="logo-container mx-auto mb-4">
            <Image
              src="/perkeso-logo.png"
              alt="Logo PERKESO"
              width={80}
              height={80}
              className="logo-perkeso mx-auto"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Panel Admin</h1>
          <p className="text-gray-600 mt-1">PERKESO Keningau</p>
        </div>

        <div className="space-y-4">
          <Link
            href="/admin/jana-qr"
            className="block w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors text-center"
          >
            <div className="flex items-center justify-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              Jana QR Code
            </div>
            <p className="text-green-200 text-sm mt-1">Cipta QR untuk program baharu</p>
          </Link>

          <Link
            href="/admin/dashboard"
            className="block w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-center"
          >
            <div className="flex items-center justify-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Dashboard Kehadiran
            </div>
            <p className="text-blue-200 text-sm mt-1">Lihat & cetak rekod kehadiran</p>
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t flex justify-between items-center">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            ← Laman Utama
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Log Keluar
          </button>
        </div>
      </div>
    </div>
  );
}
