import { nodeResolve } from "@rollup/plugin-node-resolve";
import type { Plugin } from "nuxt/dist/app/nuxt";

export default defineNuxtConfig({
  css: [
    "vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.min.css",
    "emoji-mart-vue-fast/css/emoji-mart.css",
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/styles/_variables.scss";',
        },
      },
    },
    build: {
      // Set build targets to esnext to allow top-level awaits in ts files
      target: "esnext",
      rollupOptions: {
        // @NOTE: https://github.com/vitejs/vite/issues/7385
        plugins: [nodeResolve() as Plugin],
      },
    },
  },
  nitro: {
    esbuild: {
      options: {
        target: "esnext",
      },
    },
  },
  build: {
    transpile: ["vuetify"],
  },
  typescript: {
    shim: false,
    tsConfig: {
      compilerOptions: {
        // @NOTE: https://github.com/unjs/nitro/issues/273
        // typescript-json-deserializer
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
      },
    },
  },
  runtimeConfig: {
    public: {
      azureBlobUrl: process.env.AZURE_BLOB_URL,
      baseUrl: process.env.BASE_URL,
      facebookClientId: process.env.FACEBOOK_CLIENT_ID,
      nodeEnv: process.env.NODE_ENV,
      wsBaseUrl: process.env.WS_BASE_URL,
      wsPort: process.env.WS_PORT,
    },
  },
  experimental: {
    reactivityTransform: true,
  },
  // @NOTE: "@vueuse/sound/nuxt"
  modules: ["@nuxtjs/google-fonts", "@pinia/nuxt", "@sidebase/nuxt-auth", "@unocss/nuxt", "@vueuse/nuxt"],
  googleFonts: {
    families: {
      Montserrat: true,
    },
  },
  auth: {
    origin: process.env.BASE_URL,
  },
  unocss: {
    attributify: true,
    theme: {
      fontFamily: {
        Montserrat: ["Montserrat"],
      },
    },
    rules: [["break-word", { "word-break": "break-word" }]],
  },
});
