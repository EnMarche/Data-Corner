import { defineConfig, splitVendorChunkPlugin } from 'vite'
import EnvironmentPlugin from 'vite-plugin-environment'
import VitePluginHtmlEnv from 'vite-plugin-html-env'
import react from '@vitejs/plugin-react'

const path = require('path')

export default defineConfig(generateConfig)

export function generateConfig({ mode }) {
  return {
    resolve: {
      alias: {
        api: path.resolve(__dirname, 'src/api'),
        components: path.resolve(__dirname, 'src/components'),
        domain: path.resolve(__dirname, 'src/domain'),
        providers: path.resolve(__dirname, 'src/providers'),
        assets: path.resolve(__dirname, 'src/assets'),
        services: path.resolve(__dirname, 'src/services'),
        style: path.resolve(__dirname, 'src/style'),
        shared: path.resolve(__dirname, 'src/shared'),
        ui: path.resolve(__dirname, 'src/ui'),
      },
    },
    plugins: [
      react(),
      VitePluginHtmlEnv({
        envPrefixes: ['REACT_APP_'],
      }),
      EnvironmentPlugin('all', { prefix: 'REACT_APP_' }),
      splitVendorChunkPlugin(),
    ],
    server: {
      open: true,
    },
    build: {
      outDir: 'build',
      sourcemap: mode === 'production' ? 'hidden' : true,
    },
  }
}
