import type { APIRoute } from 'astro'
import {
  OAUTH_STATE_COOKIE,
  createSessionToken,
  setSessionCookie,
} from '@/lib/auth'

export const prerender = false

/** GitHub redirects here with ?code & ?state. Exchange them for a session. */
export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const expectedState = cookies.get(OAUTH_STATE_COOKIE)?.value
  cookies.delete(OAUTH_STATE_COOKIE, { path: '/' })

  if (!code || !state || !expectedState || state !== expectedState) {
    return redirect('/ask?error=invalid_oauth_state', 302)
  }

  const clientId =
    import.meta.env.GITHUB_CLIENT_ID || process.env.GITHUB_CLIENT_ID
  const clientSecret =
    import.meta.env.GITHUB_CLIENT_SECRET || process.env.GITHUB_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    return new Response('GitHub OAuth is not configured', { status: 500 })
  }

  try {
    const redirectUri = new URL('/api/auth/callback', request.url).toString()
    const tokenRes = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: redirectUri,
        }),
      },
    )
    const tokenData = (await tokenRes.json()) as {
      access_token?: string
      error?: string
    }
    if (!tokenData.access_token) {
      return redirect('/ask?error=token_exchange_failed', 302)
    }

    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'decentparadox.me',
      },
    })
    if (!userRes.ok) {
      return redirect('/ask?error=user_fetch_failed', 302)
    }
    const ghUser = (await userRes.json()) as {
      id: number
      login: string
      name: string | null
      avatar_url: string | null
    }

    const token = await createSessionToken({
      id: String(ghUser.id),
      login: ghUser.login,
      name: ghUser.name,
      avatar: ghUser.avatar_url,
    })
    setSessionCookie(cookies, token)

    return redirect('/ask', 302)
  } catch {
    return redirect('/ask?error=oauth_error', 302)
  }
}
