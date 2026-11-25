export type Site = {
  TITLE: string
  DESCRIPTION: string
  EMAIL: string
  NUM_POSTS_ON_HOMEPAGE: number
  POSTS_PER_PAGE: number
  SITEURL: string
}

export type Link = {
  href: string
  label: string
}

export const SITE: Site = {
  TITLE: 'Sasank Reddy',
  DESCRIPTION:
    'Sasank Reddy is a design engineer who designs and builds software: Neumann, Panopticon, Tethra and other small tools.',
  EMAIL: 'hello@decentparadox.me',
  NUM_POSTS_ON_HOMEPAGE: 2,
  POSTS_PER_PAGE: 3,
  SITEURL: 'https://decentparadox.me',
}

export const NAV_LINKS: Link[] = [
  { href: '/blog', label: 'blog' },
  { href: '/microblog', label: 'microblog' },
  { href: '/guestbook', label: 'guestbook' },
]

export const SOCIAL_LINKS: Link[] = [
  { href: 'https://github.com/crazyparadox', label: 'GitHub' },
  { href: 'https://twitter.com/decentparadox', label: 'Twitter' },
  { href: 'hello@decentparadox.me', label: 'Email' },
  { href: '/rss.xml', label: 'RSS' },
]
