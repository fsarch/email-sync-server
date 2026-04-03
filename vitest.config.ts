import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: [
      // Support TS source imports that use runtime .js specifiers (NodeNext style).
      { find: /^(\.{1,2}\/.*)\.js$/, replacement: '$1.ts' },
    ],
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.spec.ts', 'test/**/*.spec.ts'],
    setupFiles: ['./vitest.setup.ts'],
  },
});

