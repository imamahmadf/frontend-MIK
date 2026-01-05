import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { AuthInitializer } from "@/components/providers/AuthInitializer";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import PageTransition from "@/components/layout/PageTransition";
import NavigationProgress from "@/components/layout/NavigationProgress";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yourwebsite.com"),
  title: {
    default: "Profile | Muhammad Iksan Kiat",
    template: "%s | Profile",
  },
  description: "Website profile profesional dengan Next.js - SEO friendly",
  keywords: ["profile", "portfolio", "developer", "next.js"],
  authors: [{ name: "Muhammad Iksan Kiat" }],
  creator: "Muhammad Iksan Kiat",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://yourwebsite.com",
    siteName: "Profile",
    title: "Profile - Muhammad Iksan Kiat",
    description: "Website profile profesional dengan Next.js - SEO friendly",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Profile",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Profile - Muhammad Iksan Kiat",
    description: "Website profile profesional dengan Next.js - SEO friendly",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://yourwebsite.com" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (!theme) {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${plusJakartaSans.variable} font-sans`}>
        <ThemeProvider>
          <ReduxProvider>
            <AuthInitializer>
              <NavigationProgress />
              <PageTransition>
                <div className="relative z-10">
                  <Header />
                  <main className="min-h-screen relative z-10">{children}</main>
                  <Footer />
                </div>
              </PageTransition>
            </AuthInitializer>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
