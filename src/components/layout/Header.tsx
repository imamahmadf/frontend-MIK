"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/authSlice";
import logo from "@/assets/logoMIK.png";

const navItems = [
  { name: "Beranda", href: "/" },
  { name: "Biografi", href: "/biografi" },
  { name: "Publikasi", href: "/publikasi" },
  { name: "Berita", href: "/berita" },
  { name: "Galeri", href: "/galeri" },
  { name: "Rekam Jejak", href: "/rekam-jejak" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAppSelector(
    (state) => state.auth
  );

  const handleLogout = () => {
    dispatch(logout());
    setIsUserMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-md border-b border-neutral-200 dark:border-neutral-800">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src={logo}
              alt="Logo Website"
              width={120}
              height={40}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <ul className="flex space-x-6">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-neutral-700 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition-colors font-medium"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Auth Section */}
            {!loading && (
              <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-neutral-300 dark:border-neutral-700">
                {isAuthenticated && user ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 text-neutral-700 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm">{user.name}</span>
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          isUserMenuOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* User Dropdown Menu */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-xl py-1 z-50 border border-neutral-200 dark:border-neutral-700">
                        <div className="px-4 py-2 border-b border-neutral-200 dark:border-neutral-700">
                          <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                            {user.name}
                          </p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            {user.email}
                          </p>
                        </div>
                        <Link
                          href="/admin/berita"
                          className="block w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Admin Berita
                        </Link>
                        <Link
                          href="/admin/galeri"
                          className="block w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Admin Galeri
                        </Link>
                        <Link
                          href="/admin/rekam-jejak"
                          className="block w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Admin Rekam Jejak
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                        >
                          Keluar
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition-all shadow-md hover:shadow-lg"
                  >
                    Masuk
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-neutral-700 dark:text-neutral-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="block py-2 text-neutral-700 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile Auth Section */}
            {!loading && (
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                {isAuthenticated && user ? (
                  <div className="space-y-2">
                    <div className="px-2 py-2">
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/admin/berita"
                      className="block px-2 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Berita
                    </Link>
                    <Link
                      href="/admin/galeri"
                      className="block px-2 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Galeri
                    </Link>
                    <Link
                      href="/admin/rekam-jejak"
                      className="block px-2 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Rekam Jejak
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition-colors"
                    >
                      Keluar
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="block px-2 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition-all shadow-md hover:shadow-lg text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Masuk
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
