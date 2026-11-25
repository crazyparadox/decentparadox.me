// What Sasank is playing on Spotify right now, or failing that the last thing played. The home page's
// "last played" card reads this. Needs SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET and SPOTIFY_REFRESH_TOKEN
// (the token comes from the one-time sign-in at /api/spotify/login on a local dev server).
// Answers { track: { name, artist, art, url, playing } } or a 5xx the card treats as "no card".
import { basic, creds, TOKEN_URL } from '@/lib/spotify'

export const prerender = false

let cached: { token: string; until: number } | null = null

async function accessToken(id: string, secret: string, refresh: string) {
  if (cached && cached.until > Date.now()) return cached.token
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { Authorization: basic(id, secret), 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refresh }),
  })
  if (!res.ok) throw new Error(`Spotify token refresh answered ${res.status}`)
  const data = await res.json()
  cached = { token: data.access_token, until: Date.now() + (data.expires_in - 60) * 1000 }
  return cached.token
}

const shape = (item: any, playing: boolean) => ({
  name: item.name,
  artist: (item.artists || []).map((a: any) => a.name).join(', '),
  art: item.album?.images?.[1]?.url || item.album?.images?.[0]?.url || '',
  url: item.external_urls?.spotify || '',
  playing,
})

export async function GET() {
  const json = (body: unknown, status: number, cache = 'no-store') =>
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': cache } })

  const { id, secret, refresh } = creds()
  if (!id || !secret || !refresh) return json({ error: 'Spotify is not set up on the server (missing env vars)' }, 500)

  try {
    const headers = { Authorization: `Bearer ${await accessToken(id, secret, refresh)}` }
    const now = await fetch('https://api.spotify.com/v1/me/player/currently-playing', { headers })
    if (now.status === 200) {
      const data = await now.json()
      // item is null for podcasts and ads; fall through to the last real track
      if (data?.item?.name && data.currently_playing_type === 'track') return json({ track: shape(data.item, !!data.is_playing) }, 200, 'public, max-age=30')
    } else if (now.status !== 204) {
      return json({ error: `Spotify answered ${now.status}` }, 502)
    }
    const recent = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', { headers })
    if (!recent.ok) return json({ error: `Spotify answered ${recent.status}` }, 502)
    const item = (await recent.json())?.items?.[0]?.track
    if (!item) return json({ error: 'No recent track' }, 502)
    return json({ track: shape(item, false) }, 200, 'public, max-age=30')
  } catch (error) {
    console.error('Spotify fetch failed:', error)
    return json({ error: 'Could not reach Spotify' }, 502)
  }
}
