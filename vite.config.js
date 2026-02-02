import { defineConfig } from 'vite'

export default defineConfig({
  base: './', // Ensures assets are linked relatively, making deployment easier on any subpath
})
