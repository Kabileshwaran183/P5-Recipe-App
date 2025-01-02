import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// dotenv is not required here if you use Vite's built-in environment variable handling.
export default defineConfig({
  plugins: [react()],
});
