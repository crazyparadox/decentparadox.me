// One-time sign-in that produces SPOTIFY_REFRESH_TOKEN. Local dev server only: it is a 404 once deployed.
import type { APIContext } from 'astro'
import { creds, redirectUri, SCOPES } from '@/lib/spotify'

export const prerender = false

export function GET({ url, redirect }: APIContext) {
  if (!import.meta.env.DEV) return new Response('Not found', { status: 404 })
  const { id } = creds()
  if (!id) return new Response('SPOTIFY_CLIENT_ID is missing from .env', { status: 500 })
  const q = new URLSearchParams({ client_id: id, response_type: 'code', redirect_uri: redirectUri(url), scope: SCOPES })
  return redirect(`https://accounts.spotify.com/authorize?${q}`)
}
