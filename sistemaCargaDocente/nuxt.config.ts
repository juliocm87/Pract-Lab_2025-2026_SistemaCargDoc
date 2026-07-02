export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  future: {
    compatibilityVersion: 4,
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001'
    }
  },
  modules: [
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxtjs/tailwindcss',
  ],
  srcDir: 'app/'
})