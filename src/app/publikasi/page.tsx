import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publikasi",
  description:
    "Daftar karya tulis, riset, atau artikel yang telah diterbitkan.",
};

const publikasi = [
  {
    judul: "Judul Publikasi 1",
    sumber: "Jurnal/Media",
    tahun: "2024",
    tautan: "#",
  },
  {
    judul: "Judul Publikasi 2",
    sumber: "Konferensi",
    tahun: "2023",
    tautan: "#",
  },
];

export default function PublikasiPage() {
  return (
    <section className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Publikasi
      </h1>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
        Cantumkan publikasi penting Anda, lengkap dengan sumber penerbitan dan
        tautan jika tersedia.
      </p>
      <div className="space-y-4">
        {publikasi.map((item) => (
          <article
            key={item.judul}
            className="rounded-lg border border-gray-200 dark:border-gray-700 p-4"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {item.judul}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {item.sumber} · {item.tahun}
            </p>
            <a
              href={item.tautan}
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              Baca selengkapnya
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
