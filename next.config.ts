
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
    // Prevent async_hooks from breaking browser builds
    if (!isServer) {
      config.resolve.fallback = {
        async_hooks: false,
        fs: false,
      };
    }
    
    // Disable OpenTelemetry completely
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@opentelemetry/api": false,
      "@opentelemetry/context-async-hooks": false,
    };

    return config;
  },
};

export default nextConfig;
