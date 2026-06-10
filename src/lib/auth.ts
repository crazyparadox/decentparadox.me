import type { AstroCookies } from 'astro'

/**
 * Minimal stateless session handling for GitHub OAuth.
 *
 * A session is a JSON payload signed with HMAC-SHA256 using SESSION_SECRET and
 * stored in an HttpOnly cookie. No database is needed — the signature is what
 * makes the cookie tamper-proof, so we can trust the GitHub identity inside it
 * when gating the chat API against API-bill abuse.
 */

export const SESSION_COOKIE = 'dp_session'
export const OAUTH_STATE_COOKIE = 'dp_oauth_state'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export interface SessionUser {
  id: string
  login: string
  name: string | null
  avatar: string | null
  /** Unix seconds when the session was issued. */
  iat: number
}

function getSecret(): string {
  const secret = import.meta.env.SESSION_SECRET || process.env.SESSION_SECRET
  if (!secret) {
    throw new Error('SESSION_SECRET is not configured')
  }
  return secret
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(input: string): Uint8Array {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function hmac(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(payload),
  )
  return toBase64Url(new Uint8Array(sig))
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return result === 0
}

export async function createSessionToken(
  user: Omit<SessionUser, 'iat'>,
): Promise<string> {
  const payload: SessionUser = { ...user, iat: Math.floor(Date.now() / 1000) }
  const encoded = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)))
  const signature = await hmac(encoded)
  return `${encoded}.${signature}`
}

export async function verifySessionToken(
  token: string | undefined,
): Promise<SessionUser | null> {
  if (!token) return null
  const [encoded, signature] = token.split('.')
  if (!encoded || !signature) return null

  const expected = await hmac(encoded)
  if (!timingSafeEqual(signature, expected)) return null

  try {
    const payload = JSON.parse(
      new TextDecoder().decode(fromBase64Url(encoded)),
    ) as SessionUser
    if (Math.floor(Date.now() / 1000) - payload.iat > SESSION_MAX_AGE) {
      return null
    }
    return payload
  } catch {
    return null
  }
}

/** Resolve the logged-in GitHub user from request cookies, or null. */
export async function getSession(
  cookies: AstroCookies,
): Promise<SessionUser | null> {
  return verifySessionToken(cookies.get(SESSION_COOKIE)?.value)
}

export function setSessionCookie(cookies: AstroCookies, token: string): void {
  cookies.set(SESSION_COOKIE, token, {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
  })
}

export function clearSessionCookie(cookies: AstroCookies): void {
  cookies.delete(SESSION_COOKIE, { path: '/' })
}
