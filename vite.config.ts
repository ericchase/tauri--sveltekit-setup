import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  // strict port for tauri
  server: {
    port: 5180,
    strictPort: true,
  },
  // don't clear the logs
  clearScreen: false,
});
