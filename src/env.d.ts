/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly GOOGLE_GENERATIVE_AI_API_KEY: string
  readonly WAKATIME_API_KEY: string
  readonly SPOTIFY_CLIENT_ID?: string
  readonly SPOTIFY_CLIENT_SECRET?: string
  readonly SPOTIFY_REFRESH_TOKEN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
