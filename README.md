# GoStream

GoStream is a frontend application built for the GoLedger challenge with a clear product narrative: an `IMDb-like` catalog experience designed for a community-driven platform.

Instead of treating the challenge as a simple CRUD panel, the project was designed around **two contextual domains**:

- the **community-facing experience**, where users browse the catalog, discover TV shows, explore seasons and episodes, and save titles into watchlists
- the **editorial/admin experience**, where a responsible operator maintains the catalog, curates data, manages relationships, and audits blockchain records

This separation was intentional. It makes the product easier to understand, improves usability, and better reflects how a real content platform works in practice: one surface is optimized for discovery, while the other is optimized for operations and maintenance.

Live project:

- https://goledger-challenge-web-seven.vercel.app/

## Product Vision

The application was shaped as a `community catalog` rather than a generic management dashboard.

That means:

- `/tv-shows` and the homepage behave like a public discovery layer
- `/manage/*` routes behave like the editorial workspace
- Watchlists are an exception to the rule, because although they are in the management domain, they are part of each user's personal management
- blockchain information exists, but as a secondary technical layer, not as the main user experience

The final result is a product that can be explained as:

> “A streaming catalog experience inspired by IMDb, with a public-facing discovery layer and a management workspace for administrators responsible for maintaining the content requested by the community.”

## Main Features

- public homepage with editorial sections
- public TV show catalog with detail pages
- full CRUD for:
  - `tvShows`
  - `seasons`
  - `episodes`
  - `watchlists`
- contextual management flow for seasons and episodes inside the selected TV show
- watchlist management with add/remove title flow
- optional blockchain audit details and asset history
- responsive UI
- accessibility and usability improvements inspired by WCAG and Nielsen heuristics

## Running The Project

### 1. Clone and install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file based on the example below:

```bash
API_BASE_URL=http://ec2-50-19-36-138.compute-1.amazonaws.com/api
API_BASIC_AUTH_USER=your_user
API_BASIC_AUTH_PASSWORD=your_password
TMDB_API_TOKEN=your_tmdb_token
TMDB_IMAGE_SEARCH_ENABLED=true # switcher for image fetching from TMDB, set false if you don't have a API key.
```

Notes:

- GoLedger credentials stay on the server side through `pages/api/*`
- `TMDB_API_TOKEN` is optional for catalog visual enrichment, but recommended

### 3. Start the development server

```bash
npm run dev
```

Open:

- http://localhost:3000

### 4. Production build

```bash
npm run build
npm run start
```

## Project Structure

The project follows a market-friendly frontend structure, combining shared layers with domain-oriented modules:

```txt
pages/
  api/
  manage/
  tv-shows/

src/
  components/
  features/
  hooks/
  layout/
  lib/
  modules/
  shared/
```

### Layer responsibilities

- `pages/`
  - route entrypoints
  - `pages/api/*` works as a BFF to protect credentials and proxy the GoLedger API

- `features/`
  - page-level orchestration
  - composition of data, interactions and UI states

- `modules/`
  - domain logic by entity
  - types, services, hooks, schemas, query keys, mappers and utilities

- `components/`
  - reusable UI and domain components
  - organized by domain when the component belongs to a specific feature area

- `lib/`
  - low-level shared infrastructure
  - internal API client, gateway client, date utils, helpers and integrations

- `layout/`
  - application shell, header, footer and structural layout pieces

- `shared/`
  - shared types and cross-domain helpers

## Architecture Summary

### 1. BFF with `pages/api/*`

The GoLedger API uses `Basic Auth`, so credentials cannot be exposed to the browser.

Because of that, the frontend does **not** call the GoLedger API directly.

The request flow is:

1. React UI calls internal routes such as `/api/tv-shows/search`
2. `pages/api/*` validates payloads and proxies the request
3. the server-side gateway client calls the real GoLedger API with credentials
4. the response comes back to the frontend in a safe and controlled way

Why:

- protects secrets
- centralizes validation
- reduces coupling between UI and external API

### 2. Domain-driven frontend organization

Each main entity has its own module:

- `tv-shows`
- `seasons`
- `episodes`
- `watchlists`

Each module contains:

- types
- schemas
- services
- TanStack Query hooks
- query keys
- mappers
- domain-specific helpers

Why:

- avoids scattering domain logic across pages
- improves reuse
- keeps code easier to reason about

### 3. TanStack Query instead of Redux/Zustand

The project uses `TanStack Query` as the main server-state solution.

Why:

- the application is mostly driven by remote data
- caching, invalidation and loading states are already solved by the library
- global client state needs were small enough to be handled with local state and custom hooks

That is why neither `Redux` nor `Zustand` was necessary for this MVP.

### 4. React Hook Form + Zod

All major create/edit forms were implemented with:

- `React Hook Form`
- `Zod`

Why:

- strong input validation
- better control over form state
- reusable and predictable form behavior
- easier inline error handling

### 5. shadcn/ui as the UI foundation

The project uses `shadcn/ui` primitives as the main UI base.

Why:

- fast to compose
- accessible primitives
- good alignment with a modern product look

## UX and Product Decisions

Some of the most important product decisions were:

### Public vs admin contexts

- public routes focus on discovery
- manage routes focus on operations

This prevents the product from feeling like a raw CRUD panel and gives the application a more realistic product identity.

### TV show as the content hub

`tvShows` was treated as the root entity of the experience.

Why:

- seasons and episodes are naturally organized around a TV show
- the detail page becomes a meaningful content hub
- navigation is more intuitive for both community and admin users

### Contextual management

Seasons and episodes are managed in relation to the selected TV show instead of being treated only as isolated entities.

Why:

- lower cognitive load
- better usability
- fewer mistakes during content maintenance

### Blockchain audit as optional depth

Blockchain metadata and asset history are present, but kept secondary.

Why:

- they should not pollute the main catalog experience
- they are more useful as technical inspection tools for devs than as core UX content

## Security and Reliability Decisions

The project also includes practical decisions inspired by OWASP recommendations:

- credentials are server-side only
- input validation happens before forwarding data to the gateway
- internal API routes reduce the exposed surface area
- technical errors are not blindly leaked into the UI

## Accessibility and Usability

The application was refined with a pragmatic MVP approach to accessibility:

- keyboard-friendly interactive surfaces
- accessible dialogs
- inline form errors
- loading and error feedback states
- contrast-aware dark UI
- improved empty states and focus handling

This was guided by:

- WCAG-inspired minimum requirements
- Nielsen heuristics adapted for frontend execution

## Final Notes

The main goal was to deliver a frontend that demonstrates:

- product thinking
- architectural clarity
- safe API integration
- usability concerns
- a realistic content-platform narrative

If this were evolved further, the next natural steps would be:

- stronger optimistic concurrency handling in the BFF
- persisted query cache
- richer public community features
- authentication and role separation
- improved media enrichment and editorial personalization
