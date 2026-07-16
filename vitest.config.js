import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    // Los tests de Playwright (e2e/) no deben correr con Vitest
    exclude: ['node_modules/**', 'dist/**', 'e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      // Solo medimos el código de la aplicación, no configs ni entry points
      exclude: [
        'node_modules/**',
        'dist/**',
        'e2e/**',
        'test/**',
        'src/test/**',
        'src/main.jsx',
        'src/server.js',
        // Adaptador de PostgreSQL: camino de runtime (necesita DB real),
        // se verifica con el E2E de Docker, no con pruebas unitarias.
        'src/store/postgres.js',
        '*.config.js',
      ],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 50,
        statements: 60,
      },
    },
  },
})
