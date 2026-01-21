"use client";

import { useState, Suspense, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/authSlice";
import LanguageSwitcher from "./LanguageSwitcher";
import DarkModeToggle from "./DarkModeToggle";
import { useTranslations } from "@/hooks/useTranslations";
import { useTheme } from "@/components/providers/ThemeProvider";
import { getAllBerita } from "@/lib/api/berita";
import { Berita } from "@/types/berita";
import { getCurrentLanguage, LanguageCode } from "@/lib/language";
import logoTerang from "@/assets/logoTerang.png";
import logoGelap from "@/assets/logoGelap.png";

function HeaderContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Berita[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const { theme } = useTheme();
  const { user, isAuthenticated, loading } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined" && document.body) {
      setPortalContainer(document.body);
    }
  }, []);

  // Focus input ketika modal dibuka dan handle body scroll
  useEffect(() => {
    if (isSearchOpen) {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    } else {
      // Restore body scroll when modal is closed
      document.body.style.overflow = "unset";
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSearchOpen]);

  // Debounced search - Pencarian dilakukan di backend
  // Frontend hanya mengirimkan kata kunci, backend yang melakukan filtering
  // Debounce 500ms untuk mengurangi jumlah request ke backend
  useEffect(() => {
    // Clear timeout sebelumnya jika ada
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Hanya kirim request jika user mengetik minimal 2 karakter
    if (searchQuery.trim().length >= 2) {
      setIsSearching(true);
      setSearchError(null);

      // Debounce: tunggu 500ms setelah user berhenti mengetik
      // Ini mencegah backend menerima request terus-menerus
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const langFromUrl = searchParams?.get("lang");
          const lang: LanguageCode =
            langFromUrl && ["id", "en", "ru"].includes(langFromUrl)
              ? (langFromUrl as LanguageCode)
              : getCurrentLanguage();

          // Kirim kata kunci ke backend untuk dilakukan pencarian
          // Backend akan melakukan filtering/searching di database
          const response = await getAllBerita(1, 10, searchQuery.trim(), lang);
          setSearchResults(response.data);
        } catch (err) {
          setSearchError(t.search.error);
          setSearchResults([]);
          console.error("Error searching berita:", err);
        } finally {
          setIsSearching(false);
        }
      }, 500); // 500ms debounce untuk mengurangi request ke backend
    } else {
      // Reset hasil jika query kurang dari 2 karakter
      setSearchResults([]);
      setIsSearching(false);
      setSearchError(null);
    }

    // Cleanup: cancel timeout jika component unmount atau query berubah
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, searchParams, t.search.error]);

  // Close modal dengan ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isSearchOpen]);

  const handleSearchResultClick = (slug: string) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    const href = createHref(`/berita/${slug}`);
    router.push(href);
  };

  // Helper function untuk membuat href dengan lang parameter
  const createHref = (path: string) => {
    const lang = searchParams?.get("lang");
    return lang ? `${path}?lang=${lang}` : path;
  };

  // Helper function untuk mengecek apakah path aktif
  const isActive = (href: string) => {
    // Hapus query string dari href untuk perbandingan
    const hrefPath = href.split("?")[0];
    // Hapus query string dari pathname
    const currentPath = pathname?.split("?")[0] || "";

    // Untuk home page, harus exact match
    if (hrefPath === "/") {
      return currentPath === "/";
    }

    // Untuk path lain, cek apakah pathname dimulai dengan hrefPath
    return currentPath.startsWith(hrefPath);
  };

  const navItems = [
    { name: t.nav.home, href: createHref("/") },
    { name: t.nav.biography, href: createHref("/biografi") },
    { name: t.nav.publication, href: createHref("/publikasi") },
    { name: t.nav.news, href: createHref("/berita") },
    { name: t.nav.gallery, href: createHref("/galeri") },
    { name: t.nav.timeline, href: createHref("/rekam-jejak") },
    { name: t.nav.testimoni, href: createHref("/testimoni") },
  ];

  const handleLogout = () => {
    dispatch(logout());
    setIsUserMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md border-b border-neutral-200 dark:border-gray-800">
      <nav className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src={theme === "dark" ? logoGelap : logoTerang}
              alt="Logo Website"
              width={120}
              height={40}
              className="h-8 sm:h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <ul className="flex space-x-6">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`relative transition-colors font-medium ${
                        active
                          ? "text-primary dark:text-primary-light"
                          : "text-neutral-700 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light"
                      }`}
                    >
                      {item.name}
                      {active && (
                        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary dark:bg-primary-light rounded-full"></span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="ml-4 p-2 text-neutral-700 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition-colors"
              aria-label="Search news"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Language Switcher */}
            <div className="ml-4 pl-4 border-l border-neutral-300 dark:border-neutral-700">
              <LanguageSwitcher />
            </div>

            {/* Dark Mode Toggle */}
            <div className="ml-4 pl-4 border-l border-neutral-300 dark:border-neutral-700">
              <DarkModeToggle />
            </div>

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
                          href={createHref("/admin/berita")}
                          className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                            isActive(createHref("/admin/berita"))
                              ? "text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20 font-semibold"
                              : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                          }`}
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          {t.auth.adminNews}
                        </Link>
                        <Link
                          href={createHref("/admin/galeri")}
                          className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                            isActive(createHref("/admin/galeri"))
                              ? "text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20 font-semibold"
                              : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                          }`}
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          {t.auth.adminGallery}
                        </Link>
                        <Link
                          href={createHref("/admin/rekam-jejak")}
                          className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                            isActive(createHref("/admin/rekam-jejak"))
                              ? "text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20 font-semibold"
                              : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                          }`}
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          {t.auth.adminTimeline}
                        </Link>
                        <Link
                          href={createHref("/admin/hero")}
                          className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                            isActive(createHref("/admin/hero"))
                              ? "text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20 font-semibold"
                              : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                          }`}
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          {t.auth.adminHero}
                        </Link>
                        <Link
                          href={createHref("/admin/testimoni")}
                          className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                            isActive(createHref("/admin/testimoni"))
                              ? "text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20 font-semibold"
                              : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                          }`}
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          {t.auth.adminTestimoni}
                        </Link>
                        <Link
                          href={createHref("/admin/biografi")}
                          className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                            isActive(createHref("/admin/biografi"))
                              ? "text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20 font-semibold"
                              : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                          }`}
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          {t.auth.adminBiografi}
                        </Link>
                        <Link
                          href={createHref("/admin/publikasi")}
                          className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                            isActive(createHref("/admin/publikasi"))
                              ? "text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20 font-semibold"
                              : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                          }`}
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          {t.auth.adminPublikasi}
                        </Link>
                        <Link
                          href={createHref("/admin/pesan")}
                          className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                            isActive(createHref("/admin/pesan"))
                              ? "text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20 font-semibold"
                              : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                          }`}
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          {t.auth.adminPesan}
                        </Link>
                        <Link
                          href={createHref("/admin/pengalaman")}
                          className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                            isActive(createHref("/admin/pengalaman"))
                              ? "text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20 font-semibold"
                              : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                          }`}
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          {t.auth.adminPengalaman}
                        </Link>
                        <Link
                          href={createHref("/admin/tentang")}
                          className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                            isActive(createHref("/admin/tentang"))
                              ? "text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20 font-semibold"
                              : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                          }`}
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          {t.auth.adminTentang}
                        </Link>
                        <Link
                          href={createHref("/admin/fakta-unik")}
                          className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                            isActive(createHref("/admin/fakta-unik"))
                              ? "text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20 font-semibold"
                              : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                          }`}
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          {t.auth.adminFaktaUnik}
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                        >
                          {t.auth.logout}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition-all shadow-md hover:shadow-lg"
                  >
                    {t.auth.login}
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Mobile Search and Menu Buttons */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-neutral-700 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition-colors"
              aria-label="Search news"
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
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button
              className="flex-shrink-0 p-2 -mr-2 text-neutral-700 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
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
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "max-h-[calc(100vh-80px)] opacity-100 mt-4"
              : "max-h-0 opacity-0 mt-0"
          }`}
        >
          <div className="space-y-2 pb-4 overflow-y-auto max-h-[calc(100vh-100px)]">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`block py-2.5 px-2 rounded-md transition-colors font-medium ${
                        active
                          ? "text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20 border-l-4 border-primary dark:border-primary-light"
                          : "text-neutral-700 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Mobile Language Switcher */}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <div className="px-2">
                <LanguageSwitcher />
              </div>
            </div>

            {/* Mobile Dark Mode Toggle */}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <div className="px-2">
                <DarkModeToggle />
              </div>
            </div>

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
                      href={createHref("/admin/berita")}
                      className={`block px-2 py-2.5 text-sm rounded-md transition-colors ${
                        isActive(createHref("/admin/berita"))
                          ? "text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20 font-semibold border-l-4 border-primary dark:border-primary-light"
                          : "text-neutral-700 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t.auth.adminNews}
                    </Link>
                    <Link
                      href={createHref("/admin/galeri")}
                      className={`block px-2 py-2.5 text-sm rounded-md transition-colors ${
                        isActive(createHref("/admin/galeri"))
                          ? "text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20 font-semibold border-l-4 border-primary dark:border-primary-light"
                          : "text-neutral-700 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t.auth.adminGallery}
                    </Link>
                    <Link
                      href={createHref("/admin/rekam-jejak")}
                      className={`block px-2 py-2.5 text-sm rounded-md transition-colors ${
                        isActive(createHref("/admin/rekam-jejak"))
                          ? "text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20 font-semibold border-l-4 border-primary dark:border-primary-light"
                          : "text-neutral-700 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t.auth.adminTimeline}
                    </Link>
                    <Link
                      href={createHref("/admin/hero")}
                      className={`block px-2 py-2.5 text-sm rounded-md transition-colors ${
                        isActive(createHref("/admin/hero"))
                          ? "text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20 font-semibold border-l-4 border-primary dark:border-primary-light"
                          : "text-neutral-700 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t.auth.adminHero}
                    </Link>
                    <Link
                      href={createHref("/admin/testimoni")}
                      className={`block px-2 py-2.5 text-sm rounded-md transition-colors ${
                        isActive(createHref("/admin/testimoni"))
                          ? "text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20 font-semibold border-l-4 border-primary dark:border-primary-light"
                          : "text-neutral-700 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t.auth.adminTestimoni}
                    </Link>
                    <Link
                      href={createHref("/admin/biografi")}
                      className={`block px-2 py-2.5 text-sm rounded-md transition-colors ${
                        isActive(createHref("/admin/biografi"))
                          ? "text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20 font-semibold border-l-4 border-primary dark:border-primary-light"
                          : "text-neutral-700 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t.auth.adminBiografi}
                    </Link>
                    <Link
                      href={createHref("/admin/publikasi")}
                      className={`block px-2 py-2.5 text-sm rounded-md transition-colors ${
                        isActive(createHref("/admin/publikasi"))
                          ? "text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20 font-semibold border-l-4 border-primary dark:border-primary-light"
                          : "text-neutral-700 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t.auth.adminPublikasi}
                    </Link>
                    <Link
                      href={createHref("/admin/pesan")}
                      className={`block px-2 py-2.5 text-sm rounded-md transition-colors ${
                        isActive(createHref("/admin/pesan"))
                          ? "text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20 font-semibold border-l-4 border-primary dark:border-primary-light"
                          : "text-neutral-700 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t.auth.adminPesan}
                    </Link>
                    <Link
                      href={createHref("/admin/pengalaman")}
                      className={`block px-2 py-2.5 text-sm rounded-md transition-colors ${
                        isActive(createHref("/admin/pengalaman"))
                          ? "text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20 font-semibold border-l-4 border-primary dark:border-primary-light"
                          : "text-neutral-700 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t.auth.adminPengalaman}
                    </Link>
                    <Link
                      href={createHref("/admin/tentang")}
                      className={`block px-2 py-2.5 text-sm rounded-md transition-colors ${
                        isActive(createHref("/admin/tentang"))
                          ? "text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20 font-semibold border-l-4 border-primary dark:border-primary-light"
                          : "text-neutral-700 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t.auth.adminTentang}
                    </Link>
                    <Link
                      href={createHref("/admin/fakta-unik")}
                      className={`block px-2 py-2.5 text-sm rounded-md transition-colors ${
                        isActive(createHref("/admin/fakta-unik"))
                          ? "text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20 font-semibold border-l-4 border-primary dark:border-primary-light"
                          : "text-neutral-700 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t.auth.adminFaktaUnik}
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                    >
                      {t.auth.logout}
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="block px-2 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition-all shadow-md hover:shadow-lg text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t.auth.login}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Search Modal - Render menggunakan portal untuk memastikan backdrop menutupi seluruh layar */}
      {isSearchOpen && mounted && portalContainer
        ? createPortal(
            <>
              {/* Backdrop - Menutupi seluruh layar */}
              <div
                className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen z-[100] bg-black/50 dark:bg-black/70 backdrop-blur-md"
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  width: "100vw",
                  height: "100vh",
                }}
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                  setSearchResults([]);
                }}
              />
              {/* Modal Content */}
              <div
                className="fixed inset-0 z-[101] flex items-start justify-center pt-20 md:pt-32 px-4 pointer-events-none"
              >
                <div
                  className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-neutral-200 dark:border-gray-700 max-h-[80vh] flex flex-col pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                {/* Search Input */}
                <div className="p-4 border-b border-neutral-200 dark:border-gray-700">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="w-5 h-5 text-neutral-400"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t.search.placeholder}
                      className="w-full pl-10 pr-10 py-3 border border-neutral-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light focus:border-transparent"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setSearchResults([]);
                          searchInputRef.current?.focus();
                        }}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <svg
                          className="w-5 h-5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Search Results */}
                <div className="flex-1 overflow-y-auto p-4">
                  {isSearching ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-primary-light"></div>
                      <p className="mt-4 text-neutral-600 dark:text-neutral-400">
                        {t.search.loading}
                      </p>
                    </div>
                  ) : searchError ? (
                    <div className="text-center py-8">
                      <p className="text-red-600 dark:text-red-400">
                        {searchError}
                      </p>
                    </div>
                  ) : searchQuery.trim().length < 2 ? (
                    <div className="text-center py-8">
                      <p className="text-neutral-600 dark:text-neutral-400">
                        {t.search.minChars}
                      </p>
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-neutral-600 dark:text-neutral-400">
                        {t.search.noResults}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {searchResults.map((berita) => {
                        const plainText = berita.isi.replace(/<[^>]*>/g, "");
                        const ringkasan =
                          plainText.length > 100
                            ? plainText.substring(0, 100) + "..."
                            : plainText;

                        const baseURL =
                          process.env.NEXT_PUBLIC_API_URL ||
                          "http://localhost:7000";
                        const fotoUrl =
                          berita.fotos && berita.fotos.length > 0
                            ? `${baseURL}${berita.fotos[0].foto}`
                            : berita.foto
                            ? `${baseURL}${berita.foto}`
                            : null;

                        return (
                          <button
                            key={berita.id}
                            onClick={() => handleSearchResultClick(berita.slug)}
                            className="w-full text-left p-4 rounded-lg border border-neutral-200 dark:border-gray-700 hover:bg-neutral-50 dark:hover:bg-gray-700 transition-colors group"
                          >
                            <div className="flex gap-4">
                              {fotoUrl && (
                                <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-200 dark:bg-gray-600">
                                  <Image
                                    src={fotoUrl}
                                    alt={berita.judul}
                                    fill
                                    className="object-cover"
                                    sizes="80px"
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-neutral-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary-light transition-colors line-clamp-2 mb-1">
                                  {berita.judul}
                                </h3>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                                  {ringkasan}
                                </p>
                                <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-500">
                                  {new Date(berita.createdAt).toLocaleDateString(
                                    "id-ID",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )}
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                </div>
              </div>
            </>,
            portalContainer
          )
        : null}
    </header>
  );
}

export default function Header() {
  return (
    <Suspense
      fallback={
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md border-b border-neutral-200 dark:border-gray-800">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </nav>
        </header>
      }
    >
      <HeaderContent />
    </Suspense>
  );
}
