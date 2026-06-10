import type { APIRoute } from 'astro'
import { clearSessionCookie } from '@/lib/auth'

export const prerender = false

export const GET: APIRoute = ({ cookies, redirect }) => {
  clearSessionCookie(cookies)
  return redirect('/ask', 302)
}

export const POST: APIRoute = ({ cookies }) => {
  clearSessionCookie(cookies)
  return new Response(null, { status: 204 })
}
