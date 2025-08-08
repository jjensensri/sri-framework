export default {
  experimental: {
    useCache: true,
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
