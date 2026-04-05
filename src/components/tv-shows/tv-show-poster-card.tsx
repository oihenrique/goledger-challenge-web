import Link from 'next/link';

import { AppImage } from '@/components/shared/app-image';

interface TvShowPosterCardProps {
  tvShow: {
    key: string;
    title: string;
    coverImageUrl?: string;
  };
  href: string;
  roundedTop?: '2xl' | '3xl';
}

export function TvShowPosterCard({
  tvShow,
  href,
  roundedTop = '3xl',
}: TvShowPosterCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-white/10 bg-card py-0 shadow-none transition hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div
        className={`relative h-64 overflow-hidden rounded-t-${roundedTop} bg-[#2a2c31]`}
      >
        {tvShow.coverImageUrl ? (
          <AppImage
            src={tvShow.coverImageUrl}
            alt={`${tvShow.title} cover`}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            No image available
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-base font-semibold text-white line-clamp-2">
          {tvShow.title}
        </h3>
      </div>
    </Link>
  );
}
