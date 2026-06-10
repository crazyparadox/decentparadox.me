import type { APIRoute } from 'astro'
import { streamText, convertToModelMessages, type UIMessage } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { Fact0Client } from '@fact0/sdk'
import { getSession } from '@/lib/auth'

export const prerender = false

const SYSTEM_PROMPT = `You are "Ask Sasank", a friendly AI assistant embedded on the personal portfolio site of Sasank Reddy (handle: "decentparadox"). Your only job is to answer visitors' questions about Sasank — who he is, what he builds, his skills, projects, and interests.

About Sasank:
- Sasank Reddy, known online as "decentparadox".
- Computer Science student focused on Artificial Intelligence at Amrita School of Engineering, Bangalore.
- Works as a graphic and UI/UX designer with ~2 years of professional experience.
- Interests: reverse engineering, game hacking, web development, blockchain, app development, machine learning, and networking.
- Spends weekends on Capture The Flag (CTF) security challenges.
- A versatile problem solver who values being well-prepared. Outside tech, he reads books and manga for creative inspiration.
- Contact: hello@decentparadox.me · GitHub: github.com/decentparadox · Twitter/X: @0xdecentparadox

Selected projects:
- Tethra — a cross-platform desktop AI chat app built with Tauri and React 19 (TypeScript). Conversations stay local in SQLite, but any chat can be shared as a read-only public web link. Integrates OpenAI, Anthropic, Google, and DeepSeek via the Vercel AI SDK. Role: product, full-stack, UI/UX, Rust/Tauri backend.
- Cue, Bi0sMeetups, PiratedPixels, Orca — other projects featured on the site; if asked for details you don't have, point visitors to the /projects page.

Guidelines:
- Be warm, concise, and conversational. Speak about Sasank in the third person.
- If asked something you genuinely don't know about Sasank, say so honestly and suggest checking the relevant page (/about, /projects, /blog) or emailing him.
- Politely decline and redirect if asked about topics unrelated to Sasank or his work.
- Never invent facts, credentials, or contact details beyond what's stated here.`

const google = createGoogleGenerativeAI({
  apiKey:
    import.meta.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY,
})

function getFact0(): Fact0Client | null {
  const apiKey = import.meta.env.FACT0_API_KEY || process.env.FACT0_API_KEY
  if (!apiKey) return null
  return new Fact0Client({ apiKey })
}

export const POST: APIRoute = async ({ request, cookies }) => {
  // Gate behind GitHub login so visitors can't run up the model bill.
  const session = await getSession(cookies)
  if (!session) {
    return new Response(
      JSON.stringify({ error: 'You must sign in with GitHub to chat.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } },
    )
  }

  let messages: UIMessage[]
  try {
    const body = (await request.json()) as { messages?: UIMessage[] }
    messages = body.messages ?? []
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!messages.length) {
    return new Response(JSON.stringify({ error: 'No messages provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const fact0 = getFact0()
  const runId = crypto.randomUUID()
  const actor = {
    id: session.login,
    type: 'human' as const,
    email: undefined,
  }
  const lastUserText =
    [...messages]
      .reverse()
      .find((m) => m.role === 'user')
      ?.parts?.filter((p) => p.type === 'text')
      .map((p) => ('text' in p ? p.text : ''))
      .join(' ')
      .slice(0, 500) ?? ''

  // Fire-and-forget audit log so Fact0 latency never blocks the response.
  if (fact0) {
    void fact0.audit
      .log({
        actor,
        action: 'agent.run.started',
        resource: { id: runId, type: 'agent.run', name: 'ask-sasank' },
        outcome: 'success',
        metadata: {
          githubLogin: session.login,
          question: lastUserText,
          messageCount: messages.length,
        },
      })
      .catch((err) => console.error('Fact0 audit (start) failed:', err))
  }

  try {
    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: SYSTEM_PROMPT,
      messages: convertToModelMessages(messages),
      onFinish: ({ text, finishReason }) => {
        if (!fact0) return
        void fact0.audit
          .log({
            actor,
            action: 'agent.run.completed',
            resource: { id: runId, type: 'agent.run', name: 'ask-sasank' },
            outcome: 'success',
            metadata: {
              githubLogin: session.login,
              question: lastUserText,
              answer: text.slice(0, 2000),
              finishReason,
              responseLength: text.length,
            },
          })
          .catch((err) => console.error('Fact0 audit (finish) failed:', err))
      },
    })

    return result.toUIMessageStreamResponse()
  } catch (error: any) {
    if (fact0) {
      void fact0.audit
        .log({
          actor,
          action: 'agent.run.completed',
          resource: { id: runId, type: 'agent.run', name: 'ask-sasank' },
          outcome: 'error',
          metadata: { githubLogin: session.login, error: error?.message },
        })
        .catch(() => {})
    }
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }
}
