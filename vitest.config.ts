import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      'server-only': fileURLToPath(
        new URL('./src/__tests__/helpers/server-only.ts', import.meta.url),
      ),
    },
  },
  test: {
    environment: 'node',
    include: ['src/__tests__/**/*.test.ts'],
    testTimeout: 30000,
    coverage: {
      provider: 'v8',
      include: [
        'src/cms/owner.ts',
        'src/cms/password.ts',
        'src/cms/blocks.ts',
        'src/cms/render.ts',
        'scripts/cms/migration.ts',
      ],
    },
  },
});
