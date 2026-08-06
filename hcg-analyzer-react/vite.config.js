// https://vitejs.dev/config/
export default {
  esbuild: {
    jsx: 'automatic',
  },
  base: '/hCG-analyzer-website/react/',
  build: {
    outDir: '../react',
    emptyOutDir: true,
  }
}
