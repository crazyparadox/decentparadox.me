import type { APIRoute } from 'astro'
import { OAUTH_STATE_COOKIE } from '@/lib/auth'

export const prerender = false

/** Kick off the GitHub OAuth flow by redirecting to the authorize screen. */
export const GET: APIRoute = ({ request, cookies, redirect }) => {
  const clientId =
    import.meta.env.GITHUB_CLIENT_ID || process.env.GITHUB_CLIENT_ID
  if (!clientId) {
    return new Response('GitHub OAuth is not configured', { status: 500 })
  }

  // CSRF protection: stash a random state in a cookie and echo it in the URL.
  const state = crypto.randomUUID()
  cookies.set(OAUTH_STATE_COOKIE, state, {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    maxAge: 60 * 10,
  })

  const redirectUri = new URL('/api/auth/callback', request.url).toString()
  const authorize = new URL('https://github.com/login/oauth/authorize')
  authorize.searchParams.set('client_id', clientId)
  authorize.searchParams.set('redirect_uri', redirectUri)
  authorize.searchParams.set('scope', 'read:user')
  authorize.searchParams.set('state', state)
  authorize.searchParams.set('allow_signup', 'false')

  return redirect(authorize.toString(), 302)
}
