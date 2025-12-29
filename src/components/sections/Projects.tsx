interface Project {
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
}

const projects: Project[] = [
  {
    title: "Program Kebijakan Energi Nasional",
    description:
      "Mengawal dan mengembangkan program strategis dalam transformasi energi Indonesia menuju energi bersih dan berkelanjutan.",
    technologies: [
      "Kebijakan Publik",
      "Energi Terbarukan",
      "Strategi Nasional",
    ],
  },
  {
    title: "Kuliah Umum & Sharing Session",
    description:
      "Berbagi pengalaman dan pengetahuan tentang energi, kewirausahaan, dan peran anak muda di berbagai kampus di Indonesia.",
    technologies: ["Public Speaking", "Pendidikan", "Kepemudaan"],
  },
  {
    title: "Kolaborasi Organisasi Diaspora",
    description:
      "Membangun jejaring dan kolaborasi antar organisasi kepemudaan Indonesia di tingkat internasional melalui PPI Dunia.",
    technologies: ["Organisasi", "Jejaring Internasional", "Kepemudaan"],
  },
  {
    title: "Inisiatif Pengembangan Bisnis",
    description:
      "Mengembangkan usaha di sektor energi dengan fokus pada inovasi, keberlanjutan, dan kemandirian energi nasional.",
    technologies: ["Kewirausahaan", "Inovasi", "Energi"],
  },
  {
    title: "Program Pemberdayaan Pemuda",
    description:
      "Menginisiasi dan mendukung program-program yang memberdayakan pemuda untuk terlibat aktif di sektor energi.",
    technologies: ["Pemberdayaan", "Kepemudaan", "Pengembangan SDM"],
  },
  {
    title: "Advokasi Energi Berkelanjutan",
    description:
      "Mengadvokasi pentingnya transisi energi dan pengembangan energi terbarukan untuk masa depan Indonesia.",
    technologies: ["Advokasi", "Energi Terbarukan", "Keberlanjutan"],
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Proyek
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                {project.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs"
                  >
                    {tech}
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
