// Second half of the one-time sign-in: swaps Spotify's code for a refresh token and shows it once,
// to be copied into .env and Netlify. Local dev server only: it is a 404 once deployed.
import type { APIContext } from 'astro'
import { basic, creds, redirectUri, TOKEN_URL } from '@/lib/spotify'

export const prerender = false

const page = (body: string, status = 200) =>
  new Response(`<!doctype html><meta charset="utf-8"><title>Spotify sign-in</title><body style="font:16px/1.5 system-ui;max-width:640px;margin:48px auto;padding:0 16px">${body}`, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  })

export async function GET({ url }: APIContext) {
  if (!import.meta.env.DEV) return new Response('Not found', { status: 404 })
  const { id, secret } = creds()
  if (!id || !secret) return page('<p>SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET is missing from .env.</p>', 500)
  const code = url.searchParams.get('code')
  if (!code) return page(`<p>Spotify did not send a code: ${url.searchParams.get('error') || 'no reason given'}.</p>`, 400)

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { Authorization: basic(id, secret), 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: redirectUri(url) }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.refresh_token) return page(`<p>Spotify refused the code (${res.status}): ${data.error_description || data.error || 'unknown error'}.</p>`, 502)

  return page(`<h1>Signed in</h1>
<p>Copy this value into <code>SPOTIFY_REFRESH_TOKEN</code> in <code>.env</code> and in Netlify's environment variables. It is shown only here.</p>
<textarea readonly rows="4" style="width:100%;font:13px ui-monospace,monospace" onclick="this.select()">${data.refresh_token}</textarea>`)
}
