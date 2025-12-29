# 🚀 Getting Started

Panduan cepat untuk memulai proyek website profile ini.

## 📋 Prerequisites

Pastikan Anda sudah menginstall:

- **Node.js** (versi 18 atau lebih baru)
- **npm** atau **yarn** atau **pnpm**

## ⚡ Instalasi Cepat

1. **Install dependencies:**

```bash
npm install
```

2. **Jalankan development server:**

```bash
npm run dev
```

3. **Buka browser:**

```
http://localhost:3000
```

## 🎨 Customization

### 1. Update Informasi Pribadi

#### Metadata SEO (`src/app/layout.tsx`)

```typescript
export const metadata: Metadata = {
  title: {
    default: "Profile - Nama Anda", // Ganti dengan nama Anda
    template: "%s | Profile",
  },
  description: "Website profile profesional...", // Update deskripsi
  // ... update URL, social links, dll
};
```

#### Hero Section (`src/components/sections/Hero.tsx`)

- Ganti "Nama Anda" dengan nama Anda
- Update deskripsi dan title

#### About Section (`src/components/sections/About.tsx`)

- Update informasi tentang Anda
- Ganti lokasi, email, dll

#### Experience (`src/components/sections/Experience.tsx`)

- Update array `experiences` dengan pengalaman Anda

#### Skills (`src/components/sections/Skills.tsx`)

- Update array `skillCategories` dengan keahlian Anda

#### Projects (`src/components/sections/Projects.tsx`)

- Update array `projects` dengan proyek Anda

#### Contact (`src/components/sections/Contact.tsx`)

- Update email dan nomor telepon
- Implementasikan form submission (saat ini hanya console.log)

#### Footer (`src/components/layout/Footer.tsx`)

- Update social media links

### 2. Menambah Gambar

1. Tambahkan gambar di folder `public/`
2. Untuk Open Graph image, buat `public/og-image.jpg` (1200x630px)
3. Gunakan Next.js Image component untuk optimasi:

```tsx
import Image from "next/image";

<Image src="/your-image.jpg" alt="Description" width={500} height={300} />;
```

### 3. Menambah Section Baru

1. Buat file baru di `src/components/sections/`, contoh: `Education.tsx`
2. Tambahkan di `src/app/page.tsx`:

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

3. Tambahkan link di `src/components/layout/Header.tsx`:

```tsx
const navItems = [
  // ...
  { name: "Pendidikan", href: "#education" },
];
```

### 4. Styling dengan Tailwind

Semua styling menggunakan Tailwind CSS. Edit class di komponen untuk mengubah tampilan.

Contoh:

```tsx
<div className="bg-blue-600 text-white p-4 rounded-lg">{/* content */}</div>
```

## 🔧 Scripts

- `npm run dev` - Development server
- `npm run build` - Build untuk production
- `npm start` - Jalankan production build
- `npm run lint` - Check linting errors

## 📦 Deploy

### Vercel (Recommended)

1. Push code ke GitHub
2. Import project di [Vercel](https://vercel.com)
3. Deploy otomatis!

### Manual Build

```bash
npm run build
npm start
```

## 🐛 Troubleshooting

### Error: Cannot find module

```bash
rm -rf node_modules package-lock.json
npm install
```

### Port sudah digunakan

```bash
npm run dev -- -p 3001
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 💡 Tips

1. Gunakan TypeScript untuk type safety
2. Selalu update metadata SEO untuk setiap halaman
3. Optimalkan gambar sebelum upload
4. Test di berbagai device untuk responsive design
5. Gunakan Lighthouse untuk check SEO dan performance
