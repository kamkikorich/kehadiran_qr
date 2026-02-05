"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AttendanceRecord {
  timestamp: string;
  namaProgram: string;
  namaPeserta: string;
  noIC: string;
  noTelefon: string;
  syarikat: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [storedPasscode, setStoredPasscode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [programs, setPrograms] = useState<string[]>([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const passcode = sessionStorage.getItem("adminPasscode");
    if (!passcode) {
      router.push("/admin");
    } else {
      setStoredPasscode(passcode);
      setIsAuthorized(true);
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("adminPasscode");
    router.push("/admin");
  };

  const fetchAttendance = async (passcode: string, program?: string) => {
    setLoading(true);
    setError("");

    try {
      const url = program
        ? `/api/attendance?program=${encodeURIComponent(program)}`
        : "/api/attendance";

      const res = await fetch(url, {
        headers: { "x-admin-passcode": passcode },
      });

      const data = await res.json();

      if (data.success) {
        setRecords(data.data);
        setPrograms(data.programs);
      } else {
        setError(data.error || "Gagal mendapatkan data");
      }
    } catch {
      setError("Gagal menghubungi server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorized && storedPasscode) {
      fetchAttendance(storedPasscode);
    }
  }, [isAuthorized, storedPasscode]);

  const handleProgramChange = (program: string) => {
    setSelectedProgram(program);
    fetchAttendance(storedPasscode, program || undefined);
  };

  const handleRefresh = () => {
    fetchAttendance(storedPasscode, selectedProgram || undefined);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const programTitle = selectedProgram || "Semua Program";
    const currentDate = new Date().toLocaleString("ms-MY", {
      timeZone: "Asia/Kuala_Lumpur",
    });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Laporan Kehadiran - ${programTitle}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            font-size: 12px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #333;
            padding-bottom: 15px;
          }
          .logo {
            font-size: 20px;
            font-weight: bold;
            color: #1e40af;
          }
          .subtitle {
            font-size: 14px;
            color: #666;
            margin-top: 5px;
          }
          .report-info {
            margin: 15px 0;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 5px;
          }
          .report-info p {
            margin: 5px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }
          th, td {
            border: 1px solid #333;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #1e40af;
            color: white;
            font-weight: bold;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #ccc;
            padding-top: 10px;
          }
          .total {
            margin-top: 15px;
            font-weight: bold;
            text-align: right;
          }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">PERKESO Keningau</div>
          <div class="subtitle">Laporan Kehadiran Program</div>
        </div>
        
        <div class="report-info">
          <p><strong>Program:</strong> ${programTitle}</p>
          <p><strong>Tarikh Cetak:</strong> ${currentDate}</p>
          <p><strong>Jumlah Peserta:</strong> ${records.length} orang</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Bil.</th>
              <th>Tarikh/Masa</th>
              <th>Nama Peserta</th>
              <th>No. IC</th>
              <th>No. Telefon</th>
              <th>Syarikat/Persatuan</th>
              ${!selectedProgram ? "<th>Program</th>" : ""}
            </tr>
          </thead>
          <tbody>
            ${records
              .map(
                (record, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${record.timestamp}</td>
                <td>${record.namaPeserta}</td>
                <td>${record.noIC}</td>
                <td>${record.noTelefon}</td>
                <td>${record.syarikat}</td>
                ${!selectedProgram ? `<td>${record.namaProgram}</td>` : ""}
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <div class="total">
          Jumlah Keseluruhan: ${records.length} peserta
        </div>

        <div class="footer">
          <p>Pertubuhan Keselamatan Sosial (PERKESO) - Cawangan Keningau, Sabah</p>
          <p>Dokumen ini dijana secara automatik oleh Sistem Kehadiran Digital</p>
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

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex items-center justify-center p-4">
        <p className="text-white">Memuatkan...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Dashboard Kehadiran
              </h1>
              <p className="text-gray-600">PERKESO Keningau</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Link
                href="/admin"
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-center"
              >
                ← Kembali
              </Link>
              <button
                onClick={handleRefresh}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Muat Semula
              </button>
              <button
                onClick={handlePrint}
                disabled={records.length === 0}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Cetak Laporan
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-100 text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Log Keluar
              </button>
            </div>
          </div>
        </div>

        {/* Stats & Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-gray-600 text-sm">Jumlah Peserta</p>
            <p className="text-3xl font-bold text-blue-600">{records.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-gray-600 text-sm">Jumlah Program</p>
            <p className="text-3xl font-bold text-green-600">
              {programs.length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <label className="text-gray-600 text-sm block mb-2">
              Tapis Program
            </label>
            <select
              value={selectedProgram}
              onChange={(e) => handleProgramChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="">Semua Program</option>
              {programs.map((program) => (
                <option key={program} value={program}>
                  {program}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div
          ref={tableRef}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">Memuatkan data...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-600">{error}</p>
              <button
                onClick={handleRefresh}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Cuba Lagi
              </button>
            </div>
          ) : records.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-600">Tiada rekod kehadiran</p>
              <p className="text-gray-400 text-sm mt-1">Rekod akan dipaparkan selepas peserta mendaftar</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-900 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Bil.
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Tarikh/Masa
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Nama Peserta
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      No. IC
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      No. Telefon
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Syarikat/Persatuan
                    </th>
                    {!selectedProgram && (
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Program
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {records.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {record.timestamp}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                        {record.namaPeserta}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {record.noIC}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {record.noTelefon}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {record.syarikat}
                      </td>
                      {!selectedProgram && (
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {record.namaProgram}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
