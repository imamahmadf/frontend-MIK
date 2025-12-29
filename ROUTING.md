# 📍 Routing di Next.js

Dokumen ini menjelaskan cara routing bekerja di proyek ini menggunakan Next.js App Router.

## 🎯 Konsep Routing di Next.js App Router

Di Next.js 14 dengan App Router, routing dilakukan dengan membuat folder di dalam `src/app/` dan menambahkan file `page.tsx` di dalamnya.

## 📁 Struktur Routing yang Sudah Dibuat

```
src/app/
├── page.tsx              # Route: / (Beranda)
├── layout.tsx            # Root layout untuk semua halaman
├── not-found.tsx         # 404 page untuk route yang tidak ditemukan
│
└── blog/                 # Route: /blog
    ├── page.tsx          # Halaman daftar blog
    │
    └── [slug]/           # Dynamic route: /blog/[slug]
        ├── page.tsx      # Halaman detail artikel blog
        └── not-found.tsx # 404 untuk artikel yang tidak ditemukan
```

## 🔗 Routes yang Tersedia

### 1. Beranda (`/`)

- **File**: `src/app/page.tsx`
- **Deskripsi**: Halaman utama dengan semua section (Hero, About, Experience, dll)
- **Akses**: `http://localhost:3000/`

### 2. Blog List (`/blog`)

- **File**: `src/app/blog/page.tsx`
- **Deskripsi**: Halaman daftar semua artikel blog
- **Akses**: `http://localhost:3000/blog`
- **Fitur**:
  - Menampilkan daftar artikel
  - Link ke detail artikel
  - Metadata SEO

### 3. Blog Detail (`/blog/[slug]`)

- **File**: `src/app/blog/[slug]/page.tsx`
- **Deskripsi**: Halaman detail artikel blog dengan dynamic routing
- **Akses**:
  - `http://localhost:3000/blog/1`
  - `http://localhost:3000/blog/2`
  - `http://localhost:3000/blog/3`
- **Fitur**:
  - Dynamic routing berdasarkan slug
  - Generate metadata dinamis untuk SEO
  - 404 handling jika artikel tidak ditemukan

### 4. 404 Not Found

- **File**: `src/app/not-found.tsx`
- **Deskripsi**: Halaman error 404 untuk route yang tidak ditemukan
- **Akses**: Otomatis muncul untuk route yang tidak ada

## 🛠️ Cara Membuat Route Baru

### Route Statis (Simple Page)

1. **Buat folder baru** di `src/app/`, contoh: `about/`
2. **Buat file `page.tsx`** di dalam folder tersebut:

```tsx
// src/app/about/page.tsx
import type { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Tentang Saya",
  description: "Informasi tentang saya",
});

export default function AboutPage() {
  return (
    <div className="pt-32 pb-20 px-4">
      <div className="container mx-auto">
        <h1>Tentang Saya</h1>
        {/* Konten halaman */}
      </div>
    </div>
  );
}
```

3. **Route akan otomatis tersedia** di `/about`

### Dynamic Route (Dengan Parameter)

1. **Buat folder dengan bracket notation**, contoh: `projects/[id]/`
2. **Buat file `page.tsx`**:

```tsx
// src/app/projects/[id]/page.tsx
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div>
      <h1>Project {id}</h1>
    </div>
  );
}
```

3. **Route akan tersedia** di `/projects/1`, `/projects/2`, dll

### Nested Route (Route Bertingkat)

1. **Buat struktur folder bertingkat**:

```
src/app/
└── portfolio/
    └── web/
        └── page.tsx  # Route: /portfolio/web
```

2. **Route akan tersedia** di `/portfolio/web`

## 📝 Best Practices

### 1. Metadata SEO untuk Setiap Halaman

Selalu tambahkan metadata untuk SEO:

```tsx
import type { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Judul Halaman",
  description: "Deskripsi halaman",
  keywords: ["keyword1", "keyword2"],
});
```

### 2. Loading States

Buat file `loading.tsx` untuk loading state:

```tsx
// src/app/blog/loading.tsx
export default function Loading() {
  return <div>Loading...</div>;
}
```

### 3. Error Handling

Buat file `error.tsx` untuk error handling:

```tsx
// src/app/blog/error.tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

### 4. Layout Khusus untuk Route

Buat `layout.tsx` di dalam folder route untuk layout khusus:

```tsx
// src/app/blog/layout.tsx
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="blog-container">{children}</div>;
}
```

## 🔗 Navigation

Update navigation di `src/components/layout/Header.tsx` untuk menambahkan link ke route baru:

```tsx
const navItems = [
  { name: "Beranda", href: "/" },
  { name: "Blog", href: "/blog" },
  { name: "Tentang", href: "/about" },
  // ... tambahkan route baru di sini
];
```

## 📚 Contoh Route Lain yang Bisa Dibuat

- `/portfolio` - Halaman portfolio
- `/portfolio/[id]` - Detail portfolio
- `/contact` - Halaman kontak terpisah
- `/services` - Daftar layanan
- `/about` - Halaman tentang
- `/resume` - Halaman resume/CV

## 🚀 Testing Routes

1. **Jalankan development server**:

```bash
npm run dev
```

2. **Akses route di browser**:

- `http://localhost:3000/` - Beranda
- `http://localhost:3000/blog` - Blog list
- `http://localhost:3000/blog/1` - Blog detail

3. **Test 404**: Akses route yang tidak ada, contoh: `http://localhost:3000/random-page`

## 💡 Tips

1. **Gunakan Link component** dari Next.js untuk navigasi (bukan `<a>` tag)
2. **Gunakan `useRouter`** untuk programmatic navigation
3. **Gunakan `generateStaticParams`** untuk static generation di dynamic routes
4. **Gunakan `revalidate`** untuk ISR (Incremental Static Regeneration)

## 📖 Referensi

- [Next.js Routing Documentation](https://nextjs.org/docs/app/building-your-application/routing)
- [Next.js Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
