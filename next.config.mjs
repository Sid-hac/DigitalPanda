/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
      remotePatterns: [
          {
              protocol: "http",
              hostname: "localhost",
          },
          {
              protocol: "https",
              hostname: "https://digital-panda.vercel.app",
          },
      ],
  },
}

export default nextConfig;
