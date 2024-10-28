// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ["~/assets/css/main.css"],

  nitro: {
    preset: "node-server",
  },

  runtimeConfig: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  compatibilityDate: "2024-10-29",
});