# Yellow Studio

Chat‑driven AI website builder with live preview, project persistence, and session‑based token/billing tracking. Built for hackathon demo flow.

## Tech stack
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS
- Supabase Postgres
- OpenAI (chat generation)
- MetaMask for wallet connect

## Features (MVP)
- Split‑screen builder: chat + live code/preview
- Streaming HTML generation
- Projects + messages + generations stored in Supabase
- Session tracking (balance + tokens)
- Yellow SDK stubs for state channels (Nitrolite sandbox)
- Sessions list page

## Project structure (key paths)
- `app/user/projects/[projectId]/page.tsx` – main builder UI
- `app/user/projects/page.tsx` – builder UI for new users
- `app/user/sessions/page.tsx` – sessions list
- `app/api/chat/generate/route.ts` – OpenAI generation (streaming)
- `app/api/db/**` – Supabase persistence endpoints
- `lib/hooks/*` – wallet/session, projects, generation hooks
- `public/submission/*` – logo + cover assets
- `yellow/yellow.ts` – Yellow SDK integration helpers

## Local setup
1) Install deps
```bash
pnpm install
```

2) Create `.env.local`
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
OPENAI_API_KEY=...
```

3) Apply Supabase schema  
Run the SQL from `supabase/schema.sql` in your Supabase SQL editor.

4) Run dev server
```bash
pnpm dev
```

Open http://localhost:3000

## Demo flow
1) Connect wallet (MetaMask).
2) Start session.
3) Create a project.
4) Prompt → generate → preview updates.
5) End session.

## Yellow SDK (Nitrolite sandbox)
- Integration helpers live in `yellow/yellow.ts`.
- Current integration is a stub to be wired into session start/pay/settle flows.
- Uses the Yellow sandbox websocket for testing.

## Build
```bash
pnpm run build
```

Note: Build uses webpack (`next build --webpack`) to avoid Turbopack port binding issues in restricted environments.

## Tips
- If you see “no projects,” use **New Project** to create one.
- Tokens in the header are session‑wide.
- Project names won’t be overwritten once set (unless still “Untitled Project”).

## Assets
- Logo: `public/submission/logo.svg`
- Cover: `public/submission/cover.svg`
- Favicon/App icon: `app/icon.svg`
