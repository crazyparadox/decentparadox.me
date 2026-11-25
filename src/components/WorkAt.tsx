import * as HoverCardPrimitive from '@radix-ui/react-hover-card'
import { ArrowUpRight } from '@phosphor-icons/react'
import { motion, type Variants } from 'motion/react'
import flamMark from '@/components/micro/flam-mark.svg?raw'

const SITE = 'https://flamapp.ai'

const Mark = ({ className }: { className?: string }) => (
  <span
    className={`inline-flex [&>svg]:h-full [&>svg]:w-auto ${className ?? ''}`}
    aria-hidden="true"
    dangerouslySetInnerHTML={{ __html: flamMark }}
  />
)

// Same blur-in-up as the TextAnimate intro sentence, picking up right where
// it ends (intro: 15 words staggered over 0.3s).
const container: Variants = {
  hidden: {},
  show: { transition: { delayChildren: 0.3, staggerChildren: 0.05 } },
}
const word: Variants = {
  hidden: { opacity: 0, filter: 'blur(10px)', y: 20 },
  show: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: { y: { duration: 0.3 }, opacity: { duration: 0.4 }, filter: { duration: 0.3 } },
  },
}
const Word = ({ children }: { children: React.ReactNode }) => (
  <motion.span variants={word} className="inline-block">
    {children}
  </motion.span>
)

/** "Currently working at <Flam>" with a website preview on hover. */
const WorkAt = () => (
  <motion.span
    variants={container}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
  >
    <Word>Currently</Word> <Word>working</Word> <Word>at</Word>{' '}
    <Word>
    <HoverCardPrimitive.Root openDelay={150} closeDelay={100}>
      <HoverCardPrimitive.Trigger asChild>
        <a
          href={SITE}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-baseline gap-[0.3em] whitespace-nowrap text-accent transition-opacity hover:opacity-75"
        >
          <Mark className="h-[0.9em] self-center" />
          Flam
        </a>
      </HoverCardPrimitive.Trigger>
      <HoverCardPrimitive.Portal>
        <HoverCardPrimitive.Content
          side="bottom"
          align="start"
          sideOffset={8}
          className="z-[100] w-72 rounded-[4px] border border-foreground/20 bg-background p-1 text-foreground shadow-xs outline-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
        >
          <div className="relative overflow-hidden rounded-[3px] border border-foreground/10">
            <img
              src="/static/images/flam-og.png"
              alt="flamapp.ai homepage preview"
              width={1200}
              height={630}
              className="aspect-[1200/630] w-full object-cover"
            />
          </div>
          <div className="px-1 pb-1 pt-2">
            <span className="inline-flex items-center gap-1.5 text-accent">
              <Mark className="h-3.5" />
              Flam
            </span>
            <p className="mt-1.5 text-sm leading-snug text-foreground/75">
              AI models and products for interactive content — the internet beyond video.
            </p>
          </div>
          <a
            href={SITE}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-x-1 rounded-sm bg-accent py-1 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            Visit website
            <ArrowUpRight className="shrink-0" aria-hidden={true} />
          </a>
        </HoverCardPrimitive.Content>
      </HoverCardPrimitive.Portal>
    </HoverCardPrimitive.Root>
    .
    </Word>
  </motion.span>
)

export default WorkAt
