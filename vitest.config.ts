import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    globals: false,
    include: ['src/__tests__/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/util/db.ts', 'src/lib/queries.ts', 'src/auth.ts', 'scripts/**'],
      thresholds: { lines: 80, functions: 80, statements: 80, branches: 70 },
    },
    testTimeout: 30000,
    hookTimeout: 60000,
  },
});
