# NextMove (MVP v2)

This version adds:
- Cleaner UI (cards, sidebar workspace)
- Templates (Deep work / Admin / Quick wins)
- History dashboard with summary stats
- Privacy/Terms pages
- `public/` folder (helps if Vercel output settings are misconfigured)

## Setup
1) Create a Supabase project  
2) Copy `.env.example` to `.env.local` and fill keys  
3) Run the SQL in `supabase/schema.sql`  
4) Install deps and run:
```bash
npm install
npm run dev
```

## Deploy (Vercel)
- Framework: Next.js
- Add env vars from `.env.local`
- In Supabase Auth:
  - Site URL: your Vercel URL
  - Redirect URL: `https://YOURDOMAIN.vercel.app/app/login`

## Notes
- Decision selection uses deterministic rules.
- If `OPENAI_API_KEY` is set, it only rewrites explanations (does not change the selected task).
