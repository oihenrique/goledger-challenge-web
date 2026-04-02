import Link from 'next/link';
import { BookmarkPlus } from 'lucide-react';

import { ProfileMenu } from '@/components/shared/profile-menu';
import { Button } from '@/components/ui';

export function SiteHeader() {
  return (
    <header className="border-b border-white/10 bg-[#191a1d]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-white"
        >
          GoStream
        </Link>
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="hidden rounded-full border border-white/10 bg-[#26282d] px-3 py-2 text-xs uppercase tracking-[0.22em] text-muted-foreground lg:inline-flex">
            Community catalog
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="#" className="flex items-center gap-2">
              <BookmarkPlus className="size-4 text-[#c59a52]" />
              <span className="hidden sm:inline">Watchlists</span>
            </Link>
          </Button>
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
