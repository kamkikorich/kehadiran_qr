"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

function RegisterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [namaProgram, setNamaProgram] = useState("");
  const [formData, setFormData] = useState({
    namaPeserta: "",
    noIC: "",
    noTelefon: "",
    syarikat: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const event = searchParams.get("event");
    if (event) {
      setNamaProgram(decodeURIComponent(event).replace(/_/g, " "));
    }
  }, [searchParams]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.namaPeserta.trim()) {
      newErrors.namaPeserta = "Nama wajib diisi";
    }

    if (!formData.noIC) {
      newErrors.noIC = "No. IC wajib diisi";
    } else if (!/^\d{12}$/.test(formData.noIC)) {
      newErrors.noIC = "No. IC mesti 12 digit nombor (tanpa -)";
    }

    if (!formData.noTelefon) {
      newErrors.noTelefon = "No. Telefon wajib diisi";
    } else if (!/^[\d\s+-]{10,15}$/.test(formData.noTelefon)) {
      newErrors.noTelefon = "Format nombor telefon tidak sah";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          namaProgram,
          ...formData,
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push(`/success?event=${encodeURIComponent(namaProgram)}`);
      } else {
        setSubmitError(data.error || "Pendaftaran gagal");
      }
    } catch {
      setSubmitError("Gagal menghubungi server. Sila cuba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="logo-container mx-auto mb-3">
            <Image
              src="/perkeso-logo.png"
              alt="Logo PERKESO"
              width={70}
              height={70}
              className="logo-perkeso mx-auto"
              priority
            />
          </div>
          <h1 className="text-xl font-bold text-gray-800">
            Pendaftaran Kehadiran
          </h1>
          <p className="text-blue-600 font-semibold mt-1">PERKESO Keningau</p>
          {namaProgram && (
            <div className="mt-3 p-2 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Program:</p>
              <p className="font-semibold text-gray-800">{namaProgram}</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Penuh <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="namaPeserta"
              value={formData.namaPeserta}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                errors.namaPeserta ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Seperti dalam IC"
            />
            {errors.namaPeserta && (
              <p className="text-red-500 text-xs mt-1">{errors.namaPeserta}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              No. Kad Pengenalan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="noIC"
              value={formData.noIC}
              onChange={handleChange}
              maxLength={12}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                errors.noIC ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="123456789012 (12 digit)"
            />
            {errors.noIC && (
              <p className="text-red-500 text-xs mt-1">{errors.noIC}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              No. Telefon <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="noTelefon"
              value={formData.noTelefon}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                errors.noTelefon ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="0123456789"
            />
            {errors.noTelefon && (
              <p className="text-red-500 text-xs mt-1">{errors.noTelefon}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wakil Syarikat / Persatuan
            </label>
            <input
              type="text"
              name="syarikat"
              value={formData.syarikat}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="Kosongkan jika hadir secara individu"
            />
          </div>

          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm text-center">{submitError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {loading ? "Menghantar..." : "Hantar Pendaftaran"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex items-center justify-center">
          <p className="text-white">Memuatkan...</p>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
