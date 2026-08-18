import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow serving static assets from the public directory
  // No special image config needed since we use canvas + <img> tags, not next/image
  reactStrictMode: true,

  // Optimize build output
  compress: true,
};

export default nextConfig;
