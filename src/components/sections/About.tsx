export default function About() {
  return (
    <section id="about" className="py-20 px-4 bg-white dark:bg-neutral-900">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl font-bold text-center mb-12 text-neutral-900 dark:text-white">
          Tentang Saya
        </h2>

        {/* Quote Section */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <p className="text-xl md:text-2xl text-neutral-800 dark:text-neutral-200 mb-8 font-semibold italic">
            "Ketika anak muda memahami energi, mereka sedang menyiapkan masa
            depan Indonesia."
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed">
              Energi, bagi Iksan, bukan sekadar persoalan sumber daya. Energi
              adalah masa depan, kemandirian, dan keberlanjutan bangsa.
              Keyakinan itulah yang membawanya menempuh pendidikan hingga ribuan
              kilometer jauhnya, melintasi batas negara dan budaya.
            </p>
            <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed">
              Saya adalah seorang anak muda Indonesia yang menempuh S1 dan S2 di
              Rusia, belajar langsung dari ekosistem teknologi dan energi yang
              inovatif. Pengalaman lintas budaya membantu saya berpikir global
              dan bertindak adaptif.
            </p>
            <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed">
              Saya aktif di berbagai organisasi internasional, membangun
              jejaring dan kolaborasi lintas negara untuk isu-isu strategis di
              sektor energi dan pengembangan berkelanjutan.
            </p>
            <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
              Hari ini, perjalanan itu belum selesai. Justru, ia terus
              bergerak—menginspirasi, membangun, dan mengajak generasi muda
              untuk ikut terlibat. Saat ini saya mengabdi sebagai tenaga ahli
              menteri di Kementerian Energi dan Sumber Daya Mineral, fokus pada
              inisiatif kebijakan dan program yang berdampak bagi masyarakat.
            </p>
          </div>
          <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-8 shadow-md border border-neutral-200 dark:border-neutral-700">
            <h3 className="text-2xl font-semibold mb-4 text-neutral-900 dark:text-white">
              Informasi
            </h3>
            <ul className="space-y-3 text-neutral-700 dark:text-neutral-300">
              <li>
                <strong className="text-primary dark:text-primary-light">
                  Lokasi:
                </strong>{" "}
                Jakarta, Indonesia
              </li>
              <li>
                <strong className="text-primary dark:text-primary-light">
                  Email:
                </strong>{" "}
                email@example.com
              </li>
              <li>
                <strong className="text-primary dark:text-primary-light">
                  Fokus:
                </strong>{" "}
                Kebijakan energi, kerja sama internasional
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
