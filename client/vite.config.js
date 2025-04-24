import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  //adding proxy because our frontend and be on different ports and when we fetch '/api/auth/signup' we need to add proxy i.e whenever we are trying to fetch something starting with '/api' on FE we simply add proxy for server
  server:{
  proxy:{
    '/api':{
      target:'http://localhost:3000',
      secure:false,
    }
  }
  },
  plugins: [react()]
})
