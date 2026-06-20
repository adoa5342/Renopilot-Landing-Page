import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig = {
  reactStrictMode: false,
  turbopack: {
    rules: {
      '*.js': ['swc', '--minify'],
    },
  },
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  outputFileTracingRoot: 'C:\\Users\\Anthony\\Desktop\\comp\\RenoPilot.Website.LandingPage',

  async headers() {
    return [
      {
        source: '/api/media/file/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

export default withPayload(nextConfig, {
  devBundleServerPackages: false,
})
