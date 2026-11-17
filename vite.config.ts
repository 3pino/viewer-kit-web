/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// 配布はソースのまま（取り込む側の Vite が Svelte を変換する）。ここは試験と型の確認のためだけの設定
export default defineConfig({
  plugins: [svelte()],
  resolve: { conditions: ['browser'] },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
    css: false,
  },
});
