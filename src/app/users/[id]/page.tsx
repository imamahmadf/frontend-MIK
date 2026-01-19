import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { generateSEOMetadata } from "@/lib/seo";
import { fetchUserById, type User } from "@/lib/api/users";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const user = await fetchUserById(Number(id));

    return generateSEOMetadata({
      title: `User: ${user.name}`,
      description: `Detail informasi user ${user.name} - ${user.email}`,
      keywords: ["user", "profile", "detail"],
    });
  } catch {
    return generateSEOMetadata({
      title: "User Tidak Ditemukan",
      description: "User yang Anda cari tidak ditemukan",
    });
  }
}

export default async function UserDetailPage({ params }: PageProps) {
  let user: User;
  try {
    const { id } = await params;
    user = await fetchUserById(Number(id));
  } catch (error) {
    notFound();
  }

  return (
    <div className="pt-32 pb-20 px-4 min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-4xl">
        {/* Back Button */}
        <Link
          href="/users"
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
          Kembali ke Daftar Users
        </Link>

        {/* User Detail Card */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {user.name}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                @{user.username}
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl">
              {user.id}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Informasi Kontak
              </h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <a
                    href={`mailto:${user.email}`}
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {user.email}
                  </a>
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">
                    {user.phone}
                  </span>
                </div>
                {user.website && (
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                    <a
                      href={`https://${user.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {user.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Address */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Alamat
              </h2>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p>{user.address.street}</p>
                <p>{user.address.suite}</p>
                <p>
                  {user.address.city}, {user.address.zipcode}
                </p>
              </div>
            </div>

            {/* Company */}
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Perusahaan
              </h2>
              <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {user.company.name}
                </p>
                <p className="text-gray-600 dark:text-gray-400 italic mb-2">
                  &quot;{user.company.catchPhrase}&quot;
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  {user.company.bs}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
