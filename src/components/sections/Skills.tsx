interface SkillCategory {
  category: string;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  {
    category: "Energi & Sumber Daya Mineral",
    skills: [
      "Kebijakan Energi",
      "Energi Terbarukan",
      "Sumber Daya Mineral",
      "Analisis Energi",
      "Keberlanjutan Energi",
    ],
  },
  {
    category: "Kepemimpinan & Organisasi",
    skills: [
      "Manajemen Organisasi",
      "Kepemimpinan Pemuda",
      "Jejaring Internasional",
      "Kolaborasi Lintas Sektor",
      "Public Speaking",
    ],
  },
  {
    category: "Bisnis & Strategi",
    skills: [
      "Kewirausahaan",
      "Pengembangan Bisnis",
      "Strategi Bisnis",
      "Manajemen Proyek",
      "Analisis Pasar",
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-20 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Keahlian
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6"
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                {category.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
