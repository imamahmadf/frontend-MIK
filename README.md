# Website Profile - Next.js

Website profile pribadi yang SEO-friendly dibangun dengan Next.js 14, TypeScript, dan Tailwind CSS.

## 🚀 Fitur

- ✅ SEO Optimized (Metadata, Open Graph, Structured Data)
- ✅ Responsive Design dengan Tailwind CSS
- ✅ TypeScript untuk type safety
- ✅ Struktur folder yang rapi dan mudah dikembangkan
- ✅ App Router (Next.js 14)

## 📁 Struktur Folder

```
src/
├── app/                    # App Router (Next.js 14)
│   ├── layout.tsx         # Root layout dengan metadata
│   ├── page.tsx           # Halaman utama
│   └── globals.css        # Global styles
├── components/             # Komponen React
│   ├── layout/           # Komponen layout (Header, Footer)
│   ├── sections/         # Komponen section (Hero, About, dll)
│   └── ui/               # Komponen UI reusable
├── lib/                   # Utilities & helpers
│   └── seo.ts            # SEO utilities
└── types/                 # TypeScript types
    └── index.ts
```

## 🛠️ Instalasi

1. Install dependencies:

```bash
npm install
```

2. Jalankan development server:

```bash
npm run dev
```

3. Buka [http://localhost:3000](http://localhost:3000) di browser

## 📝 Pengembangan

### Menambah Section Baru

1. Buat komponen di `src/components/sections/`
2. Import dan gunakan di `src/app/page.tsx`

### Mengubah Konten

- Edit data di `src/app/page.tsx` atau buat file data terpisah di `src/data/`

### SEO Configuration

- Edit metadata di `src/app/layout.tsx`
- Gunakan komponen `<SEO>` untuk halaman spesifik

## 🚀 Build untuk Production

```bash
npm run build
npm start
```

## 📄 License

MIT
