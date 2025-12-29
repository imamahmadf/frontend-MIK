import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { generateSEOMetadata } from "@/lib/seo";

// Data blog posts (dalam aplikasi nyata, ini bisa dari database atau CMS)
const blogPosts: Record<
  string,
  {
    title: string;
    content: string;
    date: string;
    category: string;
    readTime: string;
    author: string;
  }
> = {
  "1": {
    title: "Getting Started dengan Next.js 14",
    content: `
      <p class="mb-4">Next.js 14 adalah framework React terbaru yang membawa banyak fitur menarik untuk pengembangan aplikasi web modern.</p>
      
      <h2 class="text-2xl font-semibold mb-3 mt-6">Apa yang Baru di Next.js 14?</h2>
      <p class="mb-4">Next.js 14 memperkenalkan App Router yang memberikan pengalaman pengembangan yang lebih baik dengan:</p>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li>Server Components untuk performa yang lebih baik</li>
        <li>Nested layouts untuk struktur yang lebih fleksibel</li>
        <li>Streaming dan Suspense untuk loading yang lebih cepat</li>
        <li>Metadata API untuk SEO yang lebih mudah</li>
      </ul>
      
      <h2 class="text-2xl font-semibold mb-3 mt-6">Memulai Proyek</h2>
      <p class="mb-4">Untuk memulai proyek Next.js 14, jalankan perintah berikut:</p>
      <pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4 overflow-x-auto"><code>npx create-next-app@latest my-app</code></pre>
      
      <p class="mb-4">Pilih opsi yang sesuai dengan kebutuhan Anda, termasuk TypeScript, Tailwind CSS, dan App Router.</p>
      
      <h2 class="text-2xl font-semibold mb-3 mt-6">Kesimpulan</h2>
      <p class="mb-4">Next.js 14 adalah pilihan yang sangat baik untuk membangun aplikasi web modern dengan performa tinggi dan developer experience yang luar biasa.</p>
    `,
    date: "15 Maret 2024",
    category: "Tutorial",
    readTime: "5 min read",
    author: "Nama Anda",
  },
  "2": {
    title: "Tips Optimasi SEO untuk Website",
    content: `
      <p class="mb-4">Search Engine Optimization (SEO) adalah kunci untuk meningkatkan visibilitas website Anda di search engine.</p>
      
      <h2 class="text-2xl font-semibold mb-3 mt-6">1. Optimasi Metadata</h2>
      <p class="mb-4">Pastikan setiap halaman memiliki title tag dan meta description yang unik dan relevan. Gunakan keywords yang tepat tanpa keyword stuffing.</p>
      
      <h2 class="text-2xl font-semibold mb-3 mt-6">2. Struktur URL yang Baik</h2>
      <p class="mb-4">Gunakan URL yang deskriptif dan mudah dibaca. Hindari parameter yang tidak perlu dan gunakan hyphens untuk memisahkan kata.</p>
      
      <h2 class="text-2xl font-semibold mb-3 mt-6">3. Konten Berkualitas</h2>
      <p class="mb-4">Konten adalah raja. Buat konten yang original, informatif, dan memberikan nilai tambah untuk pembaca. Update konten secara berkala.</p>
      
      <h2 class="text-2xl font-semibold mb-3 mt-6">4. Mobile-Friendly</h2>
      <p class="mb-4">Pastikan website Anda responsive dan mudah digunakan di berbagai device. Google menggunakan mobile-first indexing.</p>
      
      <h2 class="text-2xl font-semibold mb-3 mt-6">5. Kecepatan Loading</h2>
      <p class="mb-4">Optimalkan gambar, gunakan lazy loading, dan minimalkan JavaScript. Website yang cepat memiliki ranking yang lebih baik.</p>
    `,
    date: "10 Maret 2024",
    category: "SEO",
    readTime: "7 min read",
    author: "Nama Anda",
  },
  "3": {
    title: "Menguasai TypeScript untuk React Developer",
    content: `
      <p class="mb-4">TypeScript membawa type safety ke dalam pengembangan React, membantu mengurangi bugs dan meningkatkan developer experience.</p>
      
      <h2 class="text-2xl font-semibold mb-3 mt-6">Mengapa TypeScript?</h2>
      <p class="mb-4">TypeScript memberikan:</p>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li>Type checking saat development</li>
        <li>Autocomplete yang lebih baik di IDE</li>
        <li>Refactoring yang lebih aman</li>
        <li>Dokumentasi yang lebih jelas melalui types</li>
      </ul>
      
      <h2 class="text-2xl font-semibold mb-3 mt-6">Dasar-dasar TypeScript dengan React</h2>
      <p class="mb-4">Untuk menggunakan TypeScript dengan React, Anda perlu memahami beberapa konsep dasar:</p>
      
      <h3 class="text-xl font-semibold mb-2 mt-4">1. Typing Props</h3>
      <pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4 overflow-x-auto"><code>interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

function Button({ label, onClick, disabled }: ButtonProps) {
  return &lt;button onClick={onClick} disabled={disabled}&gt;{label}&lt;/button&gt;;
}</code></pre>
      
      <h3 class="text-xl font-semibold mb-2 mt-4">2. Typing State</h3>
      <pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4 overflow-x-auto"><code>const [count, setCount] = useState&lt;number&gt;(0);
const [user, setUser] = useState&lt;User | null&gt;(null);</code></pre>
      
      <h2 class="text-2xl font-semibold mb-3 mt-6">Best Practices</h2>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li>Gunakan interface untuk object types</li>
        <li>Gunakan type untuk union types</li>
        <li>Hindari menggunakan 'any'</li>
        <li>Gunakan generic types untuk reusable components</li>
      </ul>
    `,
    date: "5 Maret 2024",
    category: "Programming",
    readTime: "10 min read",
    author: "Nama Anda",
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) {
    return {
      title: "Post Tidak Ditemukan",
    };
  }

  return generateSEOMetadata({
    title: post.title,
    description: `Baca artikel: ${post.title}`,
    keywords: [post.category.toLowerCase(), "blog", "artikel"],
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) {
    notFound();
  }

  return (
    <div className="pt-32 pb-20 px-4 min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-4xl">
        {/* Back Button */}
        <Link
          href="/blog"
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Kembali ke Blog
        </Link>

        {/* Article Header */}
        <article>
          <div className="mb-6">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
              {post.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 mb-8">
            <span>Oleh {post.author}</span>
            <span>•</span>
            <span>{post.date}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>

          {/* Article Content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:text-gray-900 dark:prose-headings:text-white
              prose-p:text-gray-700 dark:prose-p:text-gray-300
              prose-strong:text-gray-900 dark:prose-strong:text-white
              prose-code:text-blue-600 dark:prose-code:text-blue-400
              prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800
              prose-ul:text-gray-700 dark:prose-ul:text-gray-300
              prose-li:text-gray-700 dark:prose-li:text-gray-300"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* Navigation */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            ← Kembali ke Daftar Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
