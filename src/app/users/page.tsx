import type { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";
import UsersList from "@/components/users/UsersList";

export const metadata: Metadata = generateSEOMetadata({
  title: "Users",
  description: "Daftar users yang diambil dari API",
  keywords: ["users", "api", "data"],
});

export default function UsersPage() {
  return (
    <div className="pt-32 pb-20 px-4 min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Daftar Users
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Data users diambil dari API menggunakan axios. Halaman ini
            menampilkan contoh penggunaan API dengan loading state dan error
            handling.
          </p>
        </div>

        <UsersList />
      </div>
    </div>
  );
}
