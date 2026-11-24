const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
