
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  experimental: {
    instrumentationHook: false,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // --- 1. Client-Side (Browser) Configuration ---
    if (!isServer) {
      // Add fallbacks for Node.js core modules you want to mock in the browser.
      // This prevents 'Module not found' errors.
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}), // Spread existing fallbacks
        'async_hooks': false,
        'fs': false,
        'net': false,
        'tls': false,
      };
    }

    // --- 2. Disable OpenTelemetry completely by aliasing them to false
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@opentelemetry/api": false,
      "@opentelemetry/context-async-hooks": false,
    };

    return config;
  },
};

export default nextConfig;
