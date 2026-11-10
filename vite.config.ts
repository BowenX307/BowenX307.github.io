import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5181 }, // 5173 是 Inception，5180 是 OtherWise
});
