import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // The iStreams ERP SOAP endpoint doesn't send CORS headers, so in dev
      // we proxy through Vite instead of calling it directly from the
      // browser. VITE_SOAP_ENDPOINT is set to "/public" in .env.development
      // to route through here; production calls the absolute URL directly
      // (see .env.production).
      '/public': {
        target: 'https://apps.istreams-erp.com:4439/iStreamsSmartPublic.asmx',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/public/, ''),
      },
    },
  },
})
