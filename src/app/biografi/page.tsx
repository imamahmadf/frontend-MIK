import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Biografi",
  description: "Profil singkat dan perjalanan karier.",
};

export default function BiografiPage() {
  return (
    <section className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 text-center">
        Dari Pulau Buru ke Panggung Global
      </h1>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          Langkah Iksan meninggalkan tanah kelahirannya bukanlah langkah untuk
          pergi selamanya, melainkan untuk belajar dan kembali. Rusia menjadi
          tempatnya menempa diri, menyelesaikan pendidikan Sarjana dan Magister
          di bidang energi.
        </p>

        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          Di sana, ruang-ruang kelas tidak hanya membentuk pengetahuan akademik,
          tetapi juga kesadaran sosial. Iksan aktif di organisasi kepemudaan dan
          diaspora Indonesia, membangun jejaring, berdiskusi tentang masa depan
          bangsa, dan belajar memimpin dalam keberagaman.
        </p>

        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          Sepulang dari studi, Iksan memilih jalan yang dinamis. Dunia bisnis ia
          masuki sebagai ruang pembelajaran dan pengabdian—tentang keberanian
          mengambil risiko, membangun nilai, dan menciptakan peluang. Pengalaman
          inilah yang kemudian mengantarkannya pada amanah yang lebih besar:
          menjadi Tenaga Ahli Menteri di Kementerian Energi dan Sumber Daya
          Mineral (ESDM).
        </p>

        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6 font-semibold">
          Namun bagi Iksan, jabatan bukanlah tujuan akhir. Ia adalah alat untuk
          memperluas dampak.
        </p>
      </div>
    </section>
  );
}
