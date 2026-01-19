# Panduan SEO untuk Website Muhammad Iksan Kiat

Panduan ini menjelaskan langkah-langkah yang perlu dilakukan agar website muncul di hasil pencarian Google ketika user mengetik "muhammad iksan kiat".

## ✅ Yang Sudah Diimplementasikan

### 1. Metadata & Structured Data

- ✅ Metadata lengkap dengan fokus pada "Muhammad Iksan Kiat"
- ✅ Structured Data (JSON-LD) untuk Person schema
- ✅ Website schema dengan mainEntity untuk Sitelinks
- ✅ BreadcrumbList schema untuk navigasi
- ✅ Open Graph tags untuk social media sharing
- ✅ Twitter Card metadata
- ✅ Keywords yang relevan di semua halaman

### 2. File SEO

- ✅ `robots.txt` - Mengarahkan search engine crawler
- ✅ `sitemap.ts` - Sitemap otomatis untuk semua halaman penting

### 3. Optimasi Konten

- ✅ Nama "Muhammad Iksan Kiat" muncul di title, description, dan konten
- ✅ H1 tags menggunakan nama lengkap
- ✅ Alt text pada gambar
- ✅ Internal linking yang baik antar halaman
- ✅ Anchor links untuk section penting (home, about, contact, dll)

### 4. Optimasi untuk Sitelinks

- ✅ Website schema dengan mainEntity mencantumkan halaman penting
- ✅ BreadcrumbList untuk struktur navigasi yang jelas
- ✅ Internal linking yang konsisten
- ✅ Struktur URL yang jelas dan konsisten

## 📋 Langkah-Langkah Setelah Deploy

### 1. Update Domain di Konfigurasi

**PENTING:** Pilih domain yang akan digunakan dan update di file konfigurasi.

**File yang perlu diupdate:**

- `src/lib/config.ts` - Pilih salah satu domain:
  - `https://www.muhammadiksankiat.com` (default)
  - `https://www.muhammadiksankiat.id`

**Cara update:**

1. Buka file `src/lib/config.ts`
2. Uncomment (hapus `//`) pada domain yang akan digunakan
3. Comment (tambahkan `//`) pada domain yang tidak digunakan
4. Semua URL di website akan otomatis menggunakan domain dari file ini

### 2. Verifikasi Google Search Console

1. **Daftar ke Google Search Console**

   - Kunjungi: https://search.google.com/search-console
   - Tambahkan property website Anda
   - Verifikasi ownership (pilih metode verifikasi)

2. **Update Verification Code**

   - Setelah verifikasi, dapatkan verification code
   - Update di `src/app/layout.tsx`:
     ```typescript
     verification: {
       google: "your-google-verification-code", // Ganti dengan code Anda
     },
     ```

3. **Submit Sitemap**
   - Di Google Search Console, masuk ke "Sitemaps"
   - Submit: `https://www.muhammadiksankiat.com/sitemap.xml` (atau `.id` jika menggunakan domain tersebut)
   - Sitemap akan otomatis menggunakan domain dari `src/lib/config.ts`

### 3. Buat Google Business Profile (Opsional tapi Disarankan)

Jika Anda memiliki profil Google Business:

- Tambahkan website URL
- Pastikan nama "Muhammad Iksan Kiat" konsisten
- Tambahkan informasi kontak dan lokasi

### 4. Optimasi Tambahan

#### A. Buat Halaman Biografi yang SEO-Friendly

Pastikan halaman `/biografi` mengandung:

- Nama lengkap "Muhammad Iksan Kiat" di H1
- Deskripsi lengkap tentang profil dan pencapaian
- Kata kunci terkait: "Tenaga Ahli Menteri ESDM", "Kementerian Energi", dll

#### B. Konten Berkualitas

- Pastikan konten di halaman utama menyebutkan nama "Muhammad Iksan Kiat" beberapa kali secara natural
- Gunakan variasi: "Muhammad Iksan Kiat", "Iksan Kiat", "Muhammad Iksan"
- Tambahkan informasi lengkap tentang peran di Kementerian ESDM

#### C. Backlinks & Referensi

- Minta website resmi Kementerian ESDM untuk menambahkan link ke website Anda
- Tambahkan link di profil LinkedIn, Twitter, dll
- Minta media yang pernah menulis tentang Anda untuk menambahkan link

### 5. Monitoring & Analitik

1. **Setup Google Analytics**

   - Daftar di https://analytics.google.com
   - Tambahkan tracking code ke website

2. **Monitor Performa di Search Console**
   - Cek "Performance" untuk melihat keyword yang membawa traffic
   - Monitor "Coverage" untuk memastikan semua halaman terindeks
   - Cek "Enhancements" untuk structured data

### 6. Optimasi Teknis

#### A. Kecepatan Website

- Pastikan website cepat (gunakan PageSpeed Insights)
- Optimasi gambar
- Gunakan Next.js Image component (sudah diimplementasikan)

#### B. Mobile-Friendly

- Pastikan website responsive (sudah diimplementasikan)
- Test di Google Mobile-Friendly Test

#### C. HTTPS

- Pastikan website menggunakan HTTPS
- Setup SSL certificate

### 7. Konten & Update Rutin

1. **Update Konten Secara Berkala**

   - Tambahkan artikel/berita baru secara rutin
   - Update informasi terbaru tentang aktivitas dan pencapaian

2. **Blog/Artikel**
   - Buat artikel tentang topik energi, kebijakan, dll
   - Gunakan nama "Muhammad Iksan Kiat" secara natural dalam artikel

## 🎯 Target Keyword

Fokus pada keyword berikut:

- **Primary:** "Muhammad Iksan Kiat" (exact match)
- **Secondary:**
  - "muhammad iksan kiat"
  - "Iksan Kiat"
  - "Muhammad Iksan Kiat ESDM"
  - "Tenaga Ahli Menteri Muhammad Iksan Kiat"

## ⏱️ Timeline

- **Minggu 1-2:** Setup Google Search Console, submit sitemap
- **Minggu 2-4:** Google mulai mengindeks website
- **Bulan 1-3:** Website mulai muncul di hasil pencarian
- **Bulan 3-6:** Ranking meningkat dengan konten berkualitas dan backlinks

## 📝 Checklist Post-Deploy

- [ ] Update domain di `src/lib/config.ts` (pilih .com atau .id)
- [ ] Setup Google Search Console
- [ ] Submit sitemap.xml (akan otomatis menggunakan domain dari config)
- [ ] Update Google verification code di `src/app/layout.tsx`
- [ ] Setup Google Analytics
- [ ] Test website di PageSpeed Insights
- [ ] Test mobile-friendly
- [ ] Pastikan HTTPS aktif
- [ ] Buat konten berkualitas dengan nama "Muhammad Iksan Kiat"
- [ ] Dapatkan backlinks dari website relevan
- [ ] Monitor performa di Search Console

## 🔗 Optimasi untuk Sitelinks (Tautan Langsung ke Menu)

Sitelinks adalah tautan tambahan yang muncul di bawah hasil pencarian utama di Google, seperti yang terlihat pada hasil pencarian Facebook. Ini membantu user langsung mengakses halaman penting di website Anda.

### Yang Sudah Diimplementasikan

- ✅ **Website Schema** dengan `mainEntity` yang mencantumkan halaman-halaman penting:
  - Beranda
  - Biografi
  - Publikasi
  - Berita
  - Galeri
  - Rekam Jejak
  - Testimoni
- ✅ **BreadcrumbList Schema** untuk struktur navigasi yang jelas
- ✅ **Internal Linking** yang konsisten antar halaman
- ✅ **Anchor Links** untuk section penting (home, about, contact, dll)

### Cara Kerja Sitelinks

Google secara otomatis menampilkan sitelinks berdasarkan:

1. **Struktur website yang jelas** - Sudah diimplementasikan dengan Website schema
2. **Popularitas halaman** - Halaman yang sering dikunjungi lebih mungkin muncul
3. **Internal linking yang baik** - Link antar halaman yang konsisten
4. **Relevansi dengan query** - Halaman yang relevan dengan pencarian user

### Tips untuk Meningkatkan Peluang Sitelinks

1. **Pastikan Navigation Menu Jelas**

   - Menu utama harus mudah diakses
   - Gunakan nama menu yang deskriptif dan jelas

2. **Konsistensi Internal Linking**

   - Pastikan setiap halaman memiliki link ke halaman penting lainnya
   - Gunakan anchor text yang deskriptif

3. **Konten Berkualitas**

   - Halaman dengan konten berkualitas lebih mungkin muncul sebagai sitelink
   - Update konten secara rutin

4. **Traffic & Engagement**
   - Halaman yang banyak dikunjungi lebih mungkin muncul
   - Pastikan user experience yang baik

### Timeline untuk Sitelinks

- **Bulan 1-3:** Website mulai terindeks, sitelinks belum muncul
- **Bulan 3-6:** Dengan traffic dan engagement yang baik, sitelinks mulai muncul
- **Bulan 6+:** Sitelinks stabil dan konsisten muncul

**Catatan:** Sitelinks adalah fitur otomatis Google. Tidak ada cara untuk "memaksa" Google menampilkan sitelinks tertentu, tapi dengan optimasi yang sudah dilakukan, peluang untuk muncul sangat tinggi.

## 🔍 Testing

Setelah deploy, test dengan:

1. **Google Search:** `site:www.muhammadiksankiat.com "Muhammad Iksan Kiat"` (atau .id jika menggunakan domain tersebut)
2. **Rich Results Test:** https://search.google.com/test/rich-results
   - Test Website schema dan BreadcrumbList
3. **Mobile-Friendly Test:** https://search.google.com/test/mobile-friendly
4. **PageSpeed Insights:** https://pagespeed.web.dev/
5. **Schema Markup Validator:** https://validator.schema.org/

## 📚 Referensi

- [Google Search Central](https://developers.google.com/search)
- [Schema.org Person](https://schema.org/Person)
- [Next.js SEO Guide](https://nextjs.org/learn/seo/introduction-to-seo)

---

**Catatan:** SEO adalah proses jangka panjang. Butuh waktu 1-3 bulan untuk melihat hasil signifikan. Konsistensi dalam update konten dan kualitas backlinks sangat penting.
