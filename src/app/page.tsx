import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <div className="mb-6">
          <div className="logo-container mx-auto mb-4">
            <Image
              src="/perkeso-logo.png"
              alt="Logo PERKESO"
              width={100}
              height={100}
              className="logo-perkeso mx-auto"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">PERKESO Keningau</h1>
          <p className="text-gray-600 mt-2">Sistem Kehadiran Digital</p>
        </div>

        <div className="space-y-4">
          <Link
            href="/admin"
            className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Masuk Panel Admin
          </Link>

          <p className="text-sm text-gray-500 mt-4">
            Sila imbas kod QR di kaunter pendaftaran untuk mendaftar kehadiran
          </p>
        </div>

        <div className="mt-8 pt-6 border-t">
          <p className="text-xs text-gray-400">
            Pertubuhan Keselamatan Sosial (PERKESO)
            <br />
            Cawangan Keningau, Sabah
          </p>
        </div>
      </div>
    </div>
  );
}
