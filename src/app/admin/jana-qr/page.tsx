"use client";

import { useState, useRef, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function JanaQRPage() {
  const router = useRouter();
  const [namaProgram, setNamaProgram] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [error, setError] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const passcode = sessionStorage.getItem("adminPasscode");
    if (!passcode) {
      router.push("/admin");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("adminPasscode");
    router.push("/admin");
  };

  const generateQR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaProgram.trim()) {
      setError("Sila masukkan nama program");
      return;
    }
    setError("");
    const eventSlug = namaProgram.trim().replace(/\s+/g, "_");
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://hadir-perkeso.vercel.app";
    setQrUrl(`${baseUrl}/register?event=${encodeURIComponent(eventSlug)}`);
  };

  const handlePrintQR = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>QR Code - ${namaProgram}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
            box-sizing: border-box;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 5px;
          }
          .subtitle {
            font-size: 14px;
            color: #666;
          }
          .program-name {
            font-size: 24px;
            font-weight: bold;
            margin: 20px 0;
            color: #333;
            text-align: center;
          }
          .qr-container {
            padding: 30px;
            border: 3px solid #1e40af;
            border-radius: 15px;
            background: white;
          }
          .instruction {
            margin-top: 25px;
            font-size: 18px;
            color: #333;
            text-align: center;
            font-weight: 500;
          }
          .footer {
            margin-top: 40px;
            font-size: 12px;
            color: #999;
            text-align: center;
          }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">PERKESO Keningau</div>
          <div class="subtitle">Sistem Kehadiran Digital</div>
        </div>
        <div class="program-name">${namaProgram}</div>
        <div class="qr-container">
          ${printContent.innerHTML}
        </div>
        <div class="instruction">
          Imbas kod QR ini untuk mendaftar kehadiran
        </div>
        <div class="footer">
          Pertubuhan Keselamatan Sosial (PERKESO) - Cawangan Keningau, Sabah
        </div>
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  const resetForm = () => {
    setNamaProgram("");
    setQrUrl("");
    setError("");
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex items-center justify-center p-4">
        <p className="text-white">Memuatkan...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Jana QR Code</h1>
              <p className="text-gray-600 text-sm">PERKESO Keningau</p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/admin"
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-sm"
              >
                ← Kembali
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-100 text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-200 transition-colors text-sm"
              >
                Log Keluar
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {!qrUrl ? (
            <form onSubmit={generateQR} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Program
                </label>
                <input
                  type="text"
                  value={namaProgram}
                  onChange={(e) => setNamaProgram(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-lg"
                  placeholder="cth: Taklimat Majikan 2026"
                  required
                  autoFocus
                />
              </div>

              {error && (
                <p className="text-red-600 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors text-lg"
              >
                Jana QR Code
              </button>
            </form>
          ) : (
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                {namaProgram}
              </h2>
              
              <div ref={printRef} className="bg-white p-6 inline-block rounded-xl shadow-lg border-2 border-blue-200">
                <QRCodeSVG value={qrUrl} size={280} />
              </div>
              
              <p className="text-xs text-gray-500 mt-4 break-all px-4">{qrUrl}</p>
              <p className="text-sm text-gray-600 mt-2">
                Imbas kod QR ini untuk mendaftar kehadiran
              </p>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handlePrintQR}
                  className="flex-1 bg-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors inline-flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Cetak QR
                </button>
                <button
                  onClick={resetForm}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Jana QR Baharu
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
