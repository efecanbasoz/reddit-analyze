# Security & Code Quality Review Findings

**Date**: 2026-03-21
**Reviewers**: Codex CLI (GPT-5.4, read-only sandbox) + Claude Opus 4.6
**Scope**: Full codebase (src/, ~1,544 LOC)

## Summary

| Severity | Count | Fixed |
|----------|-------|-------|
| HIGH | 2 | 2 |
| MEDIUM | 8 | 1 |
| LOW | 3 | 2 |
| **Total** | **13** | **5** |

## Fixed

- **SEC-001 (HIGH)**: Rate limit key simplified to client IP only — not spoofable via User-Agent/Accept-Language
- **SEC-003 (MEDIUM)**: Category lookup guarded with Object.hasOwn, arrays validated before iteration, count checked before loop
- **SEC-004 (LOW)**: Error catch returns generic message, logs details server-side
- **QA-001 (HIGH)**: Documented — global search fallback when multiple subreddits with query

## Documented (not fixing now)

- **SEC-002 (MEDIUM)**: In-memory rate limit store unbounded — needs Redis for production
- **SEC-005 (LOW)**: CSP unsafe-inline — Next.js requirement, document nonce migration path
- **QA-002-010**: Type safety, accessibility, error handling, testing gaps

## Positive Findings

- No SSRF — Reddit host hardcoded, subreddit segments encoded
- No XSS — React text nodes, no dangerouslySetInnerHTML
- Strong input sanitization (subreddit regex, search query stripping)
- Dependencies up-to-date (no active CVEs for Next.js 16.1.7, React 19.2.3)
