import { useEffect, useRef, useState } from 'react'

type Screen = {
  label: string
  src: string
  alt: string
  width: number
  height: number
}

type Project = {
  name: string
  mark: 'cue' | 'tethra' | 'bi0s' | 'neumann' | 'panopticon'
  body: string
  chips: string[]
  platform: string
  stack: string
  status: string
  href: string
  cta: string
  external?: boolean
  screens: Screen[]
}

const shot = (label: string, src: string, alt: string): Screen => ({
  label,
  src,
  alt,
  width: 1440,
  height: 900,
})

const PROJECTS: Project[] = [
  {
    name: 'Neumann',
    mark: 'neumann',
    body: 'A code editor where agents work across the codebase. They run on your machine, and you approve every change before it ships.',
    chips: ['Local-first', 'Git review', 'Any ACP agent', 'Desktop and web'],
    platform: 'Desktop · Web',
    stack: 'Native',
    status: 'Live',
    href: '/projects/neumann',
    cta: 'Case study',
    screens: [
      shot('Home', '/static/images/shots/neumann-home.png', 'Neumann homepage'),
      shot('Docs', '/static/images/shots/neumann-docs.png', 'Neumann documentation'),
      shot('Pricing', '/static/images/shots/neumann-pricing.png', 'Neumann pricing'),
    ],
  },
  {
    name: 'Panopticon',
    mark: 'panopticon',
    body: 'A Mac app that records the screen, skips idle and blocked apps, and turns the day into a timeline and a daily recap. Screenshots stay on the machine. Agents read the text over MCP.',
    chips: ['ScreenCaptureKit', 'Timeline', 'Daily recap', 'MCP'],
    platform: 'macOS',
    stack: 'SQLite · MCP',
    status: 'Live',
    href: '/projects/panopticon',
    cta: 'Case study',
    screens: [
      shot('Home', '/static/images/shots/panopticon-home.png', 'Panopticon homepage'),
      shot('How it works', '/static/images/shots/panopticon-how.png', 'How Panopticon records, distills, and serves a day'),
      shot('Changelog', '/static/images/shots/panopticon-changelog.png', 'Panopticon changelog'),
    ],
  },
  {
    name: 'Tethra',
    mark: 'tethra',
    body: 'A desktop chat for the models you already use. Conversations live in a local database, and any thread can become a public link.',
    chips: ['Local SQLite', 'Your providers', 'Public links', 'Tauri'],
    platform: 'Desktop',
    stack: 'Tauri · React',
    status: 'Beta',
    href: '/projects/tethra',
    cta: 'Case study',
    screens: [
      {
        label: 'Chat',
        src: '/static/images/shots/tethra-chat.png',
        alt: 'Tethra with an empty conversation',
        width: 1440,
        height: 874,
      },
    ],
  },
  {
    name: 'Cue',
    mark: 'cue',
    body: 'A native iOS port of ZeroClaw. Memory stays on the phone, skills run through iOS, and Apple Intelligence is the default. No account.',
    chips: ['On-device memory', 'Skill system', 'Apple Intelligence', 'Keychain'],
    platform: 'iOS',
    stack: 'SwiftUI · GRDB',
    status: 'In development',
    href: '/projects/cue',
    cta: 'Case study',
    screens: [],
  },
  {
    name: 'bi0s Meetups',
    mark: 'bi0s',
    body: 'The site for bi0s’s monthly infosec meetups. Each event gets its own look, with the page, the list, and the RSVP in one place.',
    chips: ['Monthly themes', 'RSVP', 'Admin', 'Posters'],
    platform: 'Web',
    stack: 'Next.js · TypeScript',
    status: 'Shipped',
    href: '/projects/bi0smeetups',
    cta: 'Case study',
    screens: [
      shot('Home', '/static/images/shots/bi0s-home.png', 'bi0s Meetups homepage'),
      shot('Meetups', '/static/images/shots/bi0s-meetups.png', 'bi0s Meetups calendar'),
      shot('Contact', '/static/images/shots/bi0s-contact.png', 'bi0s Meetups contact form'),
    ],
  },
]

function Mark({ project }: { project: Project }) {
  if (project.mark === 'bi0s') {
    return (
      <span className="relative inline-flex items-center px-2.5 py-1.5 font-supply text-[12px] leading-none tracking-wide text-foreground">
        <span aria-hidden="true" className="pointer-events-none absolute inset-0">
          <span className="absolute left-0 top-0 size-1.5 border-l border-t border-current" />
          <span className="absolute right-0 top-0 size-1.5 border-r border-t border-current" />
          <span className="absolute bottom-0 left-0 size-1.5 border-b border-l border-current" />
          <span className="absolute bottom-0 right-0 size-1.5 border-b border-r border-current" />
        </span>
        bi0s
      </span>
    )
  }

  const src =
    project.mark === 'cue'
      ? '/static/images/showcase/cue-logo.svg'
      : project.mark === 'neumann'
        ? '/static/images/shots/neumann-icon.png'
        : project.mark === 'tethra'
          ? '/static/images/shots/tethra-icon.png'
          : '/static/images/shots/panopticon-mark.png'

  return (
    <img
      src={src}
      alt=""
      draggable={false}
      className={
        project.mark === 'neumann' || project.mark === 'tethra'
          ? 'box-border size-8 shrink-0 object-contain p-[3px]'
          : project.mark === 'panopticon'
            ? 'size-8 shrink-0'
            : 'h-7 w-auto'
      }
    />
  )
}

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <div className="min-w-0">
      <div className="font-supply text-[10px] tracking-[0.16em] text-muted-foreground">{k}</div>
      <div className="mt-1 truncate font-sans text-[13px] leading-none text-foreground">{v}</div>
    </div>
  )
}

function railMask(edges: { left: boolean; right: boolean }) {
  if (!edges.left && !edges.right) return undefined
  const fade = 36
  const left = edges.left
    ? `transparent 0px, rgb(0 0 0 / 0.45) 8px, rgb(0 0 0 / 0.84) 18px, #000 ${fade}px`
    : '#000 0px'
  const right = edges.right
    ? `#000 calc(100% - ${fade}px), rgb(0 0 0 / 0.84) calc(100% - 18px), rgb(0 0 0 / 0.45) calc(100% - 8px), transparent 100%`
    : '#000 100%'
  const image = `linear-gradient(to right, ${left}, ${right})`
  return { maskImage: image, WebkitMaskImage: image }
}

function Filmstrip({ screens }: { screens: Screen[] }) {
  const rail = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ left: false, right: false })

  useEffect(() => {
    const el = rail.current
    if (!el) return

    const sync = () => {
      const cards = [...el.querySelectorAll<HTMLElement>('[data-screen]')]
      if (!cards.length) return
      const max = el.scrollWidth - el.clientWidth
      const left = el.scrollLeft
      const origin = cards[0].offsetLeft
      const viewRight = left + el.clientWidth
      let cutLeft = false
      let cutRight = false
      for (const card of cards) {
        const start = card.offsetLeft - origin
        const end = start + card.offsetWidth
        if (start < left - 1 && end > left + 1) cutLeft = true
        if (start < viewRight - 1 && end > viewRight + 1) cutRight = true
      }
      setEdges({ left: cutLeft, right: max > 4 && cutRight })
    }

    sync()
    el.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)
    return () => {
      el.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
    }
  }, [screens.length])

  return (
    <div className="min-w-0">
      <div className="relative">
        <div
          ref={rail}
          style={railMask(edges)}
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {screens.map((screen) => (
            <figure key={screen.src} data-screen className="shrink-0 snap-start">
              <img
                src={screen.src}
                alt={screen.alt}
                width={screen.width}
                height={screen.height}
                draggable={false}
                className="h-[220px] w-auto rounded-xl ring-1 ring-foreground/10 sm:h-[280px] lg:h-[320px]"
              />
            </figure>
          ))}
        </div>
      </div>
    </div>
  )
}

function Stage({ project }: { project: Project }) {
  return (
    <article className="text-foreground">
      <header className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <div className="flex min-w-0 items-center gap-2">
          <Mark project={project} />
          {project.mark !== 'cue' && (
            <h3 className="truncate font-instrument text-[28px] leading-none tracking-[-0.02em]">
              {project.name}
            </h3>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <div className="hidden items-start gap-8 md:flex">
            <Meta k="PLATFORM" v={project.platform} />
            <Meta k="STACK" v={project.stack} />
            <Meta k="STATUS" v={project.status} />
          </div>
          <a
            href={project.href}
            {...(project.external ? { target: '_blank', rel: 'noreferrer' } : {})}
            className="inline-flex shrink-0 items-center rounded-[0.4em] bg-foreground px-2 py-1 font-supply text-sm text-background"
          >
            {project.cta}
          </a>
        </div>
      </header>

      <div
        className={
          project.screens.length
            ? 'mt-4 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(220px,300px)_minmax(0,1fr)] lg:gap-10'
            : 'mt-4 max-w-xl'
        }
      >
        <div>
          <p className="mb-3 font-supply text-[10px] tracking-[0.16em] text-muted-foreground md:hidden">
            {project.platform} · {project.status}
          </p>
          <p className="max-w-[36ch] font-sans text-[14px] leading-relaxed text-foreground/70">
            {project.body}
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {project.chips.map((chip) => (
              <li
                key={chip}
                className="rounded-[0.4em] border border-foreground/15 px-3 py-1 font-supply text-[11px] tracking-wide text-foreground/75"
              >
                {chip}
              </li>
            ))}
          </ul>
        </div>
        {project.screens.length > 0 && <Filmstrip screens={project.screens} />}
      </div>
    </article>
  )
}

const Home = ({ limit }: { showDeco?: boolean; limit?: number }) => {
  const projects = limit ? PROJECTS.slice(0, limit) : PROJECTS
  return (
    <div className="my-16 w-full font-sans">
      <div className="flex items-center justify-between pb-10 font-geist opacity-75">
        <h2 className="font-serif text-accent">(Projects)</h2>
        <a href="/projects" className="text-right font-serif text-accent">
          (See all projects)
        </a>
      </div>
      <div className="flex flex-col gap-20">
        {projects.map((project) => (
          <Stage key={project.name} project={project} />
        ))}
      </div>
    </div>
  )
}

export default Home
