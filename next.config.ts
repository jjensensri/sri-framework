export default {
  experimental: {
    // ppr: true,
    // inlineCss: true,
    useCache: true,
    // optimizePackageImports: true, // todo: if we use mantine uis
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/s/files/**',
      },
    ],
  },
  sassOptions: {
    silenceDeprecations: [
      'color-functions',
      'global-builtin',
      'import',
      'legacy-js-api',
      'mixed-decls',
    ],
  },
};
