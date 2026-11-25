// Spotify plumbing shared by the /api/spotify routes.
export const SCOPES = 'user-read-currently-playing user-read-recently-played'
export const TOKEN_URL = 'https://accounts.spotify.com/api/token'

export const creds = () => ({
  id: import.meta.env.SPOTIFY_CLIENT_ID as string | undefined,
  secret: import.meta.env.SPOTIFY_CLIENT_SECRET as string | undefined,
  refresh: import.meta.env.SPOTIFY_REFRESH_TOKEN as string | undefined,
})

export const basic = (id: string, secret: string) => `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`

// the one-time sign-in only ever runs on a local dev server, so the redirect is always this origin
export const redirectUri = (url: URL) => `${url.origin}/api/spotify/callback`
