# Struktur Folder Website Profile

Dokumen ini menjelaskan struktur folder proyek untuk memudahkan pengembangan.

## 📁 Struktur Folder

```
website profile/
├── public/                 # File static (images, favicon, dll)
│   ├── favicon.ico
│   └── og-image.jpg       # Open Graph image untuk SEO
│
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── layout.tsx     # Root layout dengan metadata SEO
│   │   ├── page.tsx       # Halaman utama (Home)
│   │   └── globals.css    # Global styles dengan Tailwind
│   │
│   ├── components/        # Komponen React
│   │   ├── layout/       # Komponen layout
│   │   │   ├── Header.tsx    # Navigation header
│   │   │   └── Footer.tsx    # Footer dengan social links
│   │   │
│   │   └── sections/     # Komponen section untuk halaman
│   │       ├── Hero.tsx         # Hero section (intro)
│   │       ├── About.tsx         # Tentang saya
│   │       ├── Experience.tsx    # Pengalaman kerja
│   │       ├── Skills.tsx        # Keahlian/teknologi
│   │       ├── Projects.tsx      # Portfolio proyek
│   │       └── Contact.tsx       # Form kontak
│   │
│   ├── lib/              # Utilities & helpers
│   │   └── seo.ts        # Helper functions untuk SEO
│   │
│   └── types/            # TypeScript type definitions
│       └── index.ts      # Shared types
│
├── package.json          # Dependencies & scripts
├── tsconfig.json         # TypeScript configuration
├── next.config.js        # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── postcss.config.js     # PostCSS configuration
├── .eslintrc.json       # ESLint configuration
├── .gitignore           # Git ignore rules
└── README.md            # Dokumentasi utama
```

## 🎯 Penjelasan Folder

### `/src/app`

Folder ini menggunakan **App Router** dari Next.js 14. Semua file di sini adalah route atau layout.

- `layout.tsx`: Root layout yang membungkus semua halaman. Berisi metadata SEO global.
- `page.tsx`: Halaman utama (route `/`). Menggabungkan semua section components.
- `globals.css`: Global CSS dengan Tailwind directives.

### `/src/components`

Semua komponen React reusable.

#### `/layout`

Komponen yang digunakan di layout utama:

- `Header.tsx`: Navigation bar dengan mobile menu
- `Footer.tsx`: Footer dengan copyright dan social links

#### `/sections`

Komponen section yang ditampilkan di halaman utama:

- Setiap section adalah komponen terpisah untuk kemudahan maintenance
- Semua section memiliki ID untuk anchor navigation
- Data bisa di-hardcode di komponen atau dipindah ke file data terpisah

### `/src/lib`

Utility functions dan helpers:

- `seo.ts`: Helper untuk generate metadata SEO

### `/src/types`

TypeScript type definitions untuk type safety:

- `index.ts`: Shared types (Experience, Project, Skill, dll)

## 🔧 Cara Menambah Fitur Baru

### Menambah Section Baru

1. Buat file baru di `src/components/sections/`, contoh: `Education.tsx`
2. Import dan tambahkan di `src/app/page.tsx`:

```tsx
import Education from "@/components/sections/Education";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Education /> {/* Section baru */}
      {/* ... */}
    </>
  );
}
```

3. Tambahkan link navigation di `src/components/layout/Header.tsx`

### Menambah Halaman Baru

1. Buat folder baru di `src/app/`, contoh: `src/app/blog/`
2. Buat file `page.tsx` di dalam folder tersebut
3. Halaman akan otomatis tersedia di route `/blog`

### Mengubah Data

**Opsi 1: Hardcode di komponen** (untuk data sederhana)

- Edit langsung di file komponen, contoh: `src/components/sections/Experience.tsx`

**Opsi 2: File data terpisah** (untuk data kompleks)

- Buat folder `src/data/`
- Buat file seperti `experiences.ts`, `projects.ts`
- Import dan gunakan di komponen

Contoh:

```typescript
// src/data/experiences.ts
export const experiences = [
  { title: "...", company: "...", ... },
  // ...
];

// src/components/sections/Experience.tsx
import { experiences } from "@/data/experiences";
```

## 🎨 Styling

Proyek menggunakan **Tailwind CSS** untuk styling.

- Edit `tailwind.config.ts` untuk custom theme
- Gunakan utility classes di komponen
- Global styles di `src/app/globals.css`

## 🔍 SEO

Metadata SEO dikonfigurasi di:

- `src/app/layout.tsx`: Metadata global
- `src/lib/seo.ts`: Helper untuk generate metadata per halaman

Untuk halaman baru, gunakan:

```typescript
import { generateSEOMetadata } from "@/lib/seo";

export const metadata = generateSEOMetadata({
  title: "Judul Halaman",
  description: "Deskripsi halaman",
});
```

## 📝 Best Practices

1. **Komponen**: Buat komponen kecil dan reusable
2. **Types**: Gunakan TypeScript types untuk type safety
3. **SEO**: Selalu tambahkan metadata untuk setiap halaman
4. **Performance**: Gunakan Next.js Image component untuk gambar
5. **Accessibility**: Gunakan semantic HTML dan ARIA labels

## 🚀 Next Steps

1. Install dependencies: `npm install`
2. Jalankan dev server: `npm run dev`
3. Customize konten di setiap section
4. Tambahkan gambar di folder `public/`
5. Update metadata SEO dengan informasi Anda
6. Deploy ke Vercel atau hosting lainnya
