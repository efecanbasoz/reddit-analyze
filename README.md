# Reddit Analyze

> Reddit topic analyzer for idea discovery and trend exploration.

[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue?style=flat-square)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)

Reddit Analyze is a Next.js app for discovering trends and idea opportunities across multiple subreddits. It aggregates Reddit posts by category, region scope, listing type, and timeframe, then helps you quickly inspect high-signal threads.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Security Notes](#security-notes)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Multi-subreddit discovery** — Category presets for quick exploration
- **Region scope filters** — `world` or `us` with English-only content focus
- **Listing controls** — Browse by `hot`, `top`, `new`, or `rising`
- **Time-based filtering** — From `hour` to `all`
- **Search & pagination** — Optional query and `after` token for deep browsing
- **Server-side validation** — Fetch + validation + basic request throttling
- **Security headers** — CSP and security headers configured in Next.js

---

## Tech Stack

- **Next.js 16** — App Router + Server Actions
- **React 19** + **TypeScript 5**
- **Tailwind CSS v4**
- **Reddit public JSON API** — No API key required

---

## Getting Started

```bash
git clone https://github.com/efecanbasoz/reddit-analyze.git
cd reddit-analyze
npm install
npm run dev
```

Open `http://localhost:3000`.

---

## Usage

### Scripts

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run linter
```

---

## Security Notes

- Input is validated and sanitized before API calls
- `after` token is restricted to a safe format
- Server action applies a minimum request interval (best effort)
- No secrets are committed — build artifacts and local environment files are ignored
- Do not expose additional private APIs without authentication/rate limiting

---

## Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Commit your changes
4. Push to the branch and open a Pull Request

---

## License

[Apache-2.0](./LICENSE)
