import Link from 'next/link';
import { BookmarkPlus } from 'lucide-react';

import { ProfileMenu } from '@/layout/profile-menu';

export function SiteHeader() {
  return (
    <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-white"
        >
          GoStream
        </Link>
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.22em] text-slate-400 lg:inline-flex">
            Community catalog
          </div>
          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/8"
          >
            <BookmarkPlus className="size-4 text-cyan-200" />
            <span className="hidden sm:inline">Watchlists</span>
          </button>
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
