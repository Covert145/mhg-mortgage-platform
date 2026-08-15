# Mobile Home Guy Mortgage Platform

A new, independent mortgage technology platform for Mobile Home Guy, purpose-built for manufactured/mobile-home lending. This repository is separate from, and has no dependency on, the existing Base44 Mobile Home Guy application.

See `docs/project-overview.md` for product scope and `docs/architecture/phase-1-implementation-spec.md` for the current build specification.

## Monorepo layout

```
/apps
  /marketing        # public website (Next.js)
  /platform         # authenticated app: CRM + all portals (Next.js)
/packages
  /ui               # design system (Tailwind + shadcn/ui based), Storybook
  /db               # Prisma schema, migrations, seed scripts
  /core             # service layer: business logic, DTOs, org-scoped query helpers
  /auth             # Auth.js config, session/permission guards
  /comms            # provider-agnostic SMS/email interfaces (Noop in Phase 1)
  /ai               # AI agent registry interfaces (Noop in Phase 1)
  /property-intel   # provider-agnostic property data interface (Mock in Phase 1)
  /rates            # provider-agnostic rate-engine interface (Mock in Phase 1)
  /config           # shared tsconfig/eslint/tailwind config
```

## Getting started

```bash
cp .env.example .env   # fill in a local Postgres connection string at minimum
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
```

`apps/platform` runs on `:3001`, `apps/marketing` on `:3000`.

## Scripts

- `pnpm build` / `pnpm dev` / `pnpm lint` / `pnpm typecheck` / `pnpm test` — run across every app/package via Turborepo.
- `pnpm db:migrate` / `pnpm db:seed` — Prisma migrate + seed reference data (roles, permissions, default pipeline, document types, declaration questions).
