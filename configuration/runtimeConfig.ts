import type { NuxtConfig } from "nuxt/schema";

export const runtimeConfig: NuxtConfig["runtimeConfig"] = {
  auth: {
    secret: process.env.AUTH_SECRET,
  },
  azure: {
    storageAccountConnectionString: process.env.AZURE_STORAGE_ACCOUNT_CONNECTION_STRING,
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  facebook: {
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  public: {
    azure: {
      blobUrl: process.env.AZURE_BLOB_URL,
    },
    baseUrl: process.env.BASE_URL,
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID,
    },
  },
};
