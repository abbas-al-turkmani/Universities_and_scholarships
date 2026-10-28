# Manhal architecture

## Layers and MVC mapping

- **Domain (Model):** pure TypeScript entities, value types, repository contracts, eligibility matching, and domain errors. It contains no framework or UI imports.
- **Application (Use cases):** single-purpose operations receive repository and port interfaces through constructors. Permission checks live here rather than in view components.
- **Infrastructure (Adapters):** seed data, in-memory repository implementations, and the composition root in `src/infrastructure/di/container.ts`.
- **Presentation (Controller / View model):** controllers in `src/presentation/controllers` mediate between repositories/use cases and route handlers or server pages. Routes handle HTTP/session concerns; pages render localized controller view models. Shared view components live in `src/components`.
- **Next.js App Router (View):** pages are Server Components by default; only the sign-in form owns client state.

The public experience is available at `/ar` and `/en`. Arabic is the default language and uses RTL layout. Translation dictionaries live in `src/messages`.

## Replacing mock repositories with Supabase

1. Add Supabase-backed classes that implement the contracts in `src/domain/repositories.ts`.
2. Keep Supabase client setup and row-to-domain mapping in `src/infrastructure`.
3. Replace the mock repository construction in `src/infrastructure/di/container.ts`; leave use cases and presentation code unchanged.
4. Configure server-only Supabase credentials using environment variables, then add integration tests for the adapters.

The current cookie session and in-memory repositories are demo-only and are not intended for production identity or persistence. A `globalThis` singleton keeps the mock container shared across local route bundles; it does not provide durable or cross-instance production storage.
