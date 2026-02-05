import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
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
