# Manhal

Manhal is a bilingual university, scholarship and student-application demo built with Next.js App Router, TypeScript and Tailwind CSS. Arabic is the default locale and the interface supports RTL.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root route redirects to Arabic at `/ar`; English is at `/en`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create the production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run the strict TypeScript check |
| `npm test` | Run domain and use-case tests with Vitest |

## Demo sign-in

The demo password is `Demo@1234`.

| Role | Email |
| --- | --- |
| Student | `student@example.com` |
| Super admin | `admin@manhal.edu` |
| Admin | `operations@manhal.edu` |
| Reviewer | `rana@manhal.edu` |

The demo auth endpoint accepts the shared mock password for seeded active accounts. Sessions use an HTTP-only cookie and are not production authentication.

## Project map

- `src/domain` — entities, repository contracts, errors and deterministic eligibility matching
- `src/application` — use cases and service ports
- `src/infrastructure/mock-data` — reproducible seed data for universities, programs, students, applications, users and notifications
- `src/infrastructure/repositories/mock` — in-memory repository adapters
- `src/infrastructure/di` — composition root
- `src/presentation/controllers` — controller view models and repository/use-case coordination
- `src/app/[locale]` — Arabic and English App Router pages
- `src/components` — shared interactive UI
- `src/messages` — UI dictionaries for `ar` and `en`
- `src/tests` — domain and use-case tests

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the MVC/Clean Architecture mapping and Supabase migration outline.

## Supabase migration

Implement the repository contracts with Supabase adapters, then replace the mock adapters in `src/infrastructure/di/container.ts`. The mock session, cookie login and seeded data are for local demonstration only.
