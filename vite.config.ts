import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// vite.config.js / vite.config.ts

import { createRequire } from 'node:module';
const require = createRequire( import.meta.url );



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()
],
      

})
