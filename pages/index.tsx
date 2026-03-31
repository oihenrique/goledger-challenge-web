import Head from 'next/head';

import { Button } from '@/components/ui/button';
import { PageShell } from '@/layout/page-shell';

export default function Home() {
  return (
    <>
      <Head>
        <title>GoStream</title>
      </Head>
      <PageShell>
        <section className="grid gap-10 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:py-24">
          <div className="space-y-6">
            <div className="inline-flex w-fit items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
              IMDb community-like
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                GoStream
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                Community-driven TV catalog with a public-facing discovery layer
                and a separate editorial workspace for managing series, seasons,
                episodes, watchlists, and blockchain-backed audit details.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                TV Show hub
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                Editorial workspace
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                Blockchain API
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="lg">Explore the catalog</Button>
              <Button variant="outline" size="lg">
                Open workspace
              </Button>
            </div>
          </div>
        </section>
      </PageShell>
    </>
  );
}
