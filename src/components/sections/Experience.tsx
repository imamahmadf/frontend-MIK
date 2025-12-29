interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  description: string[];
}

const experiences: ExperienceItem[] = [
  {
    title: "Tenaga Ahli Menteri",
    company: "Kementerian Energi dan Sumber Daya Mineral (ESDM)",
    period: "Sekarang",
    description: [
      "Memberikan rekomendasi strategis dalam penyusunan kebijakan sektor energi dan sumber daya mineral",
      "Mengawal implementasi program strategis di bidang energi berkelanjutan",
      "Membangun sinergi antar pemangku kepentingan untuk mendukung transformasi energi Indonesia",
    ],
  },
  {
    title: "Pengusaha & Wirausaha",
    company: "Sektor Energi & Pengembangan Bisnis",
    period: "Sebelumnya",
    description: [
      "Mengembangkan usaha di sektor energi dengan fokus pada inovasi dan keberlanjutan",
      "Membangun kemitraan strategis lintas sektor untuk pengembangan bisnis",
      "Menerapkan prinsip-prinsip kewirausahaan dalam menciptakan nilai dan peluang",
    ],
  },
  {
    title: "Aktifis Organisasi Kepemudaan",
    company: "PPI Dunia, IATMI Rusia, HIPMI",
    period: "Selama Studi & Setelahnya",
    description: [
      "Terlibat aktif dalam Persatuan Pelajar Indonesia (PPI) Dunia untuk membangun jejaring diaspora Indonesia",
      "Aktif di Ikatan Ahli Teknik Perminyakan Indonesia (IATMI) Rusia sebagai ruang belajar lintas disiplin",
      "Berpartisipasi di Himpunan Pengusaha Muda Indonesia (HIPMI) dalam pengembangan ekosistem wirausaha",
    ],
  },
  {
    title: "Mahasiswa S1 & S2 Bidang Energi",
    company: "Rusia",
    period: "Pendidikan",
    description: [
      "Menyelesaikan pendidikan Sarjana dan Magister di bidang energi di Rusia",
      "Menjadi bagian dari ekosistem akademik yang fokus pada inovasi energi global",
      "Mengembangkan pemahaman mendalam tentang tantangan dan peluang energi di tingkat internasional",
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Pengalaman
        </h2>
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {exp.title}
                  </h3>
                  <p className="text-lg text-blue-600 dark:text-blue-400">
                    {exp.company}
                  </p>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-2 md:mt-0">
                  {exp.period}
                </p>
              </div>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                {exp.description.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
