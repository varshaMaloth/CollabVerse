
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
        // This is the CRITICAL line: alias the problematic Node.js module to 'false'
        'async_hooks': false, 
        
        // You might need to add other Node.js core modules here if they cause issues later:
        'fs': false, 
        'net': false,
        'tls': false,
        
        // Preserve any existing fallbacks
        ...config.resolve.fallback,
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
