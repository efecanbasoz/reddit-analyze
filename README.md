# Reddit Analyze

Reddit Analyze is a Next.js app for discovering trends and idea opportunities across multiple subreddits.

It aggregates Reddit posts by category, region scope, listing type, and timeframe, then helps you quickly inspect high-signal threads.

## Features

- Multi-subreddit discovery with category presets
- Region scope filters (`world`, `us`) with English-only content focus
- Listing controls (`hot`, `top`, `new`, `rising`)
- Time-based filtering (`hour` to `all`)
- Optional search query and pagination (`after` token)
- Server-side fetch + validation + basic request throttling
- Security headers and CSP configured in Next.js

## Tech Stack

- Next.js 16 (App Router + Server Actions)
- React 19 + TypeScript 5
- Tailwind CSS v4
- Reddit public JSON API

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Security Notes

- Input is validated/sanitized before API calls.
- `after` token is restricted to a safe format.
- Server action applies a minimum request interval (best effort).
- Do not expose additional private APIs without authentication/rate limiting.

## Open Source Hygiene

- No private workspace paths are required.
- No secrets are committed.
- Build artifacts and local environment files are ignored.

## License

MIT
