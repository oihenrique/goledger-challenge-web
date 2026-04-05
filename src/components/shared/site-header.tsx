import Image from 'next/image';
import Link from 'next/link';
import { BookmarkPlus, Tv } from 'lucide-react';

import { ProfileMenu } from '@/components/shared/profile-menu';
import { Button } from '@/components/ui';

export function SiteHeader() {
  return (
    <header className="border-b border-white/10 bg-[#191a1d]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-10 w-32">
            <Image
              src="/logo.png"
              alt="GoStream logo"
              fill
              sizes="128px"
              className="object-contain"
              priority
            />
          </div>
        </Link>
        <div className="flex items-center gap-3 sm:gap-5">
          <Button variant="outline" size="sm" asChild>
            <Link href="/tv-shows" className="flex items-center gap-2">
              <Tv className="size-4 text-[#7aa2ff]" />
              <span className="hidden sm:inline">TV Shows</span>
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/manage/watchlists" className="flex items-center gap-2">
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
