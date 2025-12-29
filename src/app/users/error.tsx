"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="pt-32 pb-20 px-4 min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-red-800 dark:text-red-400 mb-4">
            Terjadi Kesalahan
          </h2>
          <p className="text-red-600 dark:text-red-300 mb-6">
            {error.message || "Gagal memuat data users. Silakan coba lagi."}
          </p>
          <button
            onClick={reset}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    </div>
  );
}
