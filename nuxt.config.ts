// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/color-mode'
  ],
  css: ['~/assets/css/main.css'],
  colorMode: {
    classSuffix: '',
    preference: 'dark',
    fallback: 'dark'
  },
  app: {
    head: {
      title: 'Wontolla Games - Subasta Benéfica',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Subasta benéfica de juegos de mesa por Wontolla Games' }
      ]
    }
  },
  // Add router configuration
  router: {
    options: {
      strict: true
    }
  },
  // Ensure SSR is enabled
  ssr: true,
  // Configure nitro for better routing
  nitro: {
    routeRules: {
      '/**': { ssr: true }
    }
  }
})