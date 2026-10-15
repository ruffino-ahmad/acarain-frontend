/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "acarainstorage.blob.core.windows.net",
        pathname: "/samaya-media-public/**",
      },
    ],
  },
};

export default nextConfig;