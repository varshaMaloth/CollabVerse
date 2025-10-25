import type { NextConfig } from 'next';

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
      config.resolve.fallback = {
        // CRITICAL FIX: Alias the Node.js module to 'false' to ignore it
        'async_hooks': false,

        // Add other core modules if they pop up later
        'fs': false,
        'net': false,
        'tls': false,

        ...config.resolve.fallback,
      };
    }

    // --- 2. Server-Side (Node.js) Configuration ---
    // Mark the tracing package as external to prevent it from being processed and leaking
    if (isServer) {
      config.externals = [
        // List the package causing the issue here:
        '@opentelemetry/context-async-hooks',

        ...(config.externals || []),
      ];
    }
    
    // --- Also disable OpenTelemetry completely by aliasing them to false
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@opentelemetry/api": false,
      "@opentelemetry/context-async-hooks": false,
    };

    return config;
  },
};

export default nextConfig;
