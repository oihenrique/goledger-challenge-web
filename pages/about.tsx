import Link from 'next/link';

import { Button } from '@/components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { PageShell } from '@/layout/page-shell';
import Head from 'next/head';

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About GoStream</title>
      </Head>
      <PageShell>
        <section className="space-y-8 py-14 sm:py-16">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Project overview
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              GoStream · IMDb-like catalog powered by blockchain
            </h1>
            <p className="max-w-3xl text-base leading-8 text-[#d5d0c5]">
              GoStream was built as a community-facing catalog for TV series
              with an editorial workspace behind the scenes. The public side
              focuses on discovery, watchlists, and a premium catalog
              experience. The editorial side lets curators manage titles,
              seasons, episodes, and watchlists with operational controls.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="rounded-3xl border border-white/10 bg-card shadow-none">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  Two domains
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-[#d5d0c5]">
                <p>
                  <span className="font-semibold text-white">
                    Community view
                  </span>{' '}
                  — public catalog, watchlists, and editorial hero sections,
                  focused on discovery and inspiration.
                </p>
                <p>
                  <span className="font-semibold text-white">
                    Admin/editorial view
                  </span>{' '}
                  — workspace to create and update TV shows, seasons, episodes,
                  and watchlists, with modals for details and CRUD actions.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border border-white/10 bg-card shadow-none">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  Blockchain integration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-[#d5d0c5]">
                <p>
                  Every asset (tv show, season, episode, watchlist) is
                  registered on the GoLedger blockchain. The frontend talks to
                  it through a BFF in `pages/api/*`, keeping credentials
                  server-side.
                </p>
                <p>
                  Detail modals show the technical record (last transaction,
                  hash, timestamps) and a history tab that calls
                  <code className="mx-1 rounded bg-white/10 px-1 py-0.5 text-xs text-white">
                    readAssetHistory
                  </code>
                  .
                </p>
                <p>
                  Updates use the gateway `invoke` endpoints to keep full audit
                  traceability.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-3xl border border-white/10 bg-card shadow-none">
            <CardHeader>
              <CardTitle className="text-xl text-white">Tech stack</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-[#d5d0c5]">
              <p>
                Next.js (Pages Router), TypeScript, shadcn/ui, Tailwind,
                TanStack Query, React Hook Form + Zod. BFF em `pages/api/*` fala
                com a GoLedger usando Basic Auth do lado servidor.
              </p>
              <p>
                Imagens e metadados visuais opcionalmente enriquecidos via TMDB,
                com cache via TanStack Query.
              </p>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" asChild>
              <Link href="/tv-shows">Explore the catalog</Link>
            </Button>
            <Button asChild>
              <Link href="/manage/tv-shows">Open editorial workspace</Link>
            </Button>
          </div>
        </section>
      </PageShell>
    </>
  );
}
