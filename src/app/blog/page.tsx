import type { Metadata } from "next";
import Link from "next/link";
import { generateSEOMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Blog",
  description:
    "Artikel dan tulisan tentang pengembangan web, teknologi, dan tips programming",
  keywords: ["blog", "artikel", "programming", "web development", "tips"],
});

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
}

// Data blog posts (bisa dipindah ke file terpisah atau database)
const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Getting Started dengan Next.js 14",
    excerpt:
      "Panduan lengkap untuk memulai pengembangan aplikasi web modern menggunakan Next.js 14 dengan App Router dan fitur-fitur terbarunya.",
    date: "15 Maret 2024",
    category: "Tutorial",
    readTime: "5 min read",
  },
  {
    id: "2",
    title: "Tips Optimasi SEO untuk Website",
    excerpt:
      "Pelajari cara mengoptimalkan website Anda untuk search engine dengan teknik-teknik SEO modern dan best practices.",
    date: "10 Maret 2024",
    category: "SEO",
    readTime: "7 min read",
  },
  {
    id: "3",
    title: "Menguasai TypeScript untuk React Developer",
    excerpt:
      "Panduan praktis untuk developer React yang ingin meningkatkan kode mereka dengan TypeScript untuk type safety yang lebih baik.",
    date: "5 Maret 2024",
    category: "Programming",
    readTime: "10 min read",
  },
];

export default function BlogPage() {
  return (
    <div className="pt-32 pb-20 px-4 min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Blog
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Artikel dan tulisan tentang pengembangan web, teknologi, dan tips
            programming
          </p>
        </div>

        {/* Blog Posts List */}
        <div className="space-y-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                  {post.category}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {post.date}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  • {post.readTime}
                </span>
              </div>

              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                <Link
                  href={`/blog/${post.id}`}
                  className="hover:text-primary dark:hover:text-primary-light transition-colors"
                >
                  {post.title}
                </Link>
              </h2>

              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {post.excerpt}
              </p>

              <Link
                href={`/blog/${post.id}`}
                className="inline-flex items-center text-primary dark:text-primary-light hover:underline font-medium"
              >
                Baca selengkapnya
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </article>
          ))}
        </div>

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors"
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
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
