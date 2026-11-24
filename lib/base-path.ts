// Set at build time when the site is served from a sub-path (GitHub Pages project site).
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export const withBase = (path: string) => BASE_PATH + path
