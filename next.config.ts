
import type {NextConfig} from 'next';
import * as path from 'path';
import * as webpack from 'webpack';

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
        // --- 1a. Shim out server-only modules ---
        config.plugins.push(
            new webpack.NormalModuleReplacementPlugin(
                /@opentelemetry\/context-async-hooks/,
                path.resolve(__dirname, 'src/shims/opentelemetry-client-shim.js')
            )
        );

        // --- 1b. Add fallbacks for other Node.js core modules ---
        config.resolve.fallback = {
            ...(config.resolve.fallback || {}), // Spread existing fallbacks
            'async_hooks': path.resolve(__dirname, 'src/shims/async_hooks.js'),
            'fs': false,
            'net': false,
            'tls': false,
        };
    }

    // --- 2. Disable OpenTelemetry completely by aliasing them to false
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@opentelemetry/api": false,
    };

    return config;
  },
};

export default nextConfig;
