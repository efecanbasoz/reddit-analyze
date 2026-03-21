# Security & Code Quality Review Findings

**Date**: 2026-03-21
**Reviewers**: Codex CLI (GPT-5.4, read-only sandbox) + Claude Opus 4.6
**Scope**: Full codebase (src/, ~1,544 LOC)

## Summary

| Severity | Count | Fixed |
|----------|-------|-------|
| HIGH | 2 | 2 |
| MEDIUM | 8 | 2 |
| LOW | 3 | 2 |
| **Total** | **13** | **6** |

## Fixed (Round 1)

- **SEC-001 (HIGH)**: Rate limit key simplified to client IP only
- **SEC-003 (MEDIUM)**: Category lookup guarded with Object.hasOwn
- **SEC-004 (LOW)**: Error catch returns generic message

## Fixed (Round 2 — Deferred)

- **QA-001 (HIGH)**: Multi-subreddit search now uses `/r/sub1+sub2/search.json`
  with `restrict_sr=1` instead of falling back to global `/search.json`.
- **SEC-002 (MEDIUM)**: Rate limit store capped at 10,000 entries with overflow
  pruning to prevent unbounded memory growth.

## Remaining

- **SEC-005 (LOW)**: CSP unsafe-inline — Next.js requirement
- **QA-002-010**: Type safety, accessibility, error handling, testing gaps

## Positive Findings

- No SSRF — Reddit host hardcoded, subreddit segments encoded
- No XSS — React text nodes, no dangerouslySetInnerHTML
- Strong input sanitization (subreddit regex, search query stripping)
- Dependencies up-to-date (no active CVEs for Next.js 16.1.7, React 19.2.3)
