import Link from "next/link";

export default function NotFound() {
  return (
    <div className="pt-32 pb-20 px-4 min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Artikel Tidak Ditemukan
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Maaf, artikel yang Anda cari tidak ditemukan.
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Kembali ke Blog
        </Link>
      </div>
    </div>
  );
}
