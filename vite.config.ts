import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fixReactVirtualized from 'esbuild-plugin-react-virtualized'

// https://vitejs.dev/config/
export default defineConfig({
    optimizeDeps: {
        esbuildOptions: {
            plugins: [fixReactVirtualized],
        },
    },
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
})
