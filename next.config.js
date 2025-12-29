/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "7000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "localhost",
        port: "7000",
        pathname: "/uploads/**",
      },
      // Untuk production, tambahkan hostname backend Anda di sini
      // Contoh:
      // {
      //   protocol: "https",
      //   hostname: "api.yourdomain.com",
      //   pathname: "/uploads/**",
      // },
    ],
  },
};

module.exports = nextConfig;
