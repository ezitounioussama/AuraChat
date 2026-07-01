import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'vendor-react', test: /[\\/]node_modules[\\/](react|react-dom|react-router|@clerk)[\\/]/ },
            { name: 'vendor-mui', test: /[\\/]node_modules[\\/]@mui[\\/]/ },
            { name: 'vendor-icons', test: /[\\/]node_modules[\\/]@tabler[\\/]/ },
            { name: 'vendor-other', test: /[\\/]node_modules[\\/]/ },
          ],
        },
      },
    },
    chunkSizeWarningLimit: 400,
  },
})
