import Head from 'next/head';
import Link from 'next/link';

import { Button } from '@/components/ui';
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
            <div className="inline-flex w-fit items-center rounded-full border border-white/12 bg-slate-900 px-4 py-2 text-sm text-slate-200">
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
              <span className="rounded-full border border-white/10 bg-slate-900 px-3 py-1">
                TV Show hub
              </span>
              <span className="rounded-full border border-white/10 bg-slate-900 px-3 py-1">
                Editorial workspace
              </span>
              <span className="rounded-full border border-white/10 bg-slate-900 px-3 py-1">
                Blockchain API
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/tv-shows">Explore TV shows</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/manage/tv-shows">Open workspace</Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="rounded-3xl border border-white/10 bg-slate-950 p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Public layer
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">
                Editorial discovery through series cards and curated sections.
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                The catalog surface is meant for browsing, context, and
                community-facing discovery.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Editorial layer
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">
                Administrative workspace with tables, CRUD actions, and audit.
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                The MVP focuses on the editorial workspace while preserving the
                public product narrative.
              </p>
            </div>
          </div>
        </section>
      </PageShell>
    </>
  );
}
