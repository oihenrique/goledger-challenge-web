import Link from 'next/link';

import { AppImage } from '@/components/shared/app-image';
import { formatDate } from '@/lib/date';

interface EpisodeCardProps {
  episode: {
    key: string;
    title: string;
    episodeNumber: number;
    seasonNumber?: number;
    releaseDate: string;
    description: string;
    tvShowTitle?: string;
    coverImageUrl?: string;
    episodeImageUrl?: string;
  };
  href?: string;
}

export function EpisodeCard({ episode, href }: EpisodeCardProps) {
  const episodeCode = episode.seasonNumber
    ? `S${episode.seasonNumber}E${episode.episodeNumber}`
    : `E${episode.episodeNumber}`;

  const cardContent = (
    <div className="group rounded-2xl border border-white/10 bg-card py-0 shadow-none transition hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <div className="relative h-48 overflow-hidden rounded-t-2xl bg-[#2a2c31]">
        {episode.episodeImageUrl || episode.coverImageUrl ? (
          <AppImage
            src={episode.episodeImageUrl || episode.coverImageUrl}
            alt={`${episode.title} poster`}
            fill
            sizes="(min-width: 1024px) 25vw, 100vw"
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            No poster
          </div>
        )}
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-white line-clamp-2 mb-1">
            {episode.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {episode.tvShowTitle || 'Unknown TV show'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-white/10 bg-[#25272c] px-2 py-1 text-[#d5d0c5]">
            {episodeCode}
          </span>
          <span className="rounded-full border border-white/10 bg-[#25272c] px-2 py-1 text-[#d5d0c5]">
            {formatDate(episode.releaseDate)}
          </span>
        </div>

        <p className="text-sm text-[#d5d0c5] line-clamp-3 leading-6">
          {episode.description}
        </p>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{cardContent}</Link>;
  }

  return cardContent;
}
