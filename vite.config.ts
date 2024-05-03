import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),wasm(), topLevelAwait()],
  optimizeDeps: {
    // Don't optimize these packages as they contain web workers and WASM files.
    // https://github.com/vitejs/vite/issues/11672#issuecomment-1415820673
    exclude: ['@journeyapps/wa-sqlite', '@powersync/web'],
    //include: ['js-logger', 'can-ndjson-stream', 'lodash/throttle', 'event-iterator'],
    include: ['js-logger', 'can-ndjson-stream', 'lodash/throttle','event-iterator', 'uuid', 'lodash', 'can-ndjson-stream']
    //'object-hash'
  },
  worker: {
    format: 'es',
    plugins: () => [wasm(), topLevelAwait()]
  }
})
