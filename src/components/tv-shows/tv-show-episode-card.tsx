import { CalendarDays, Star } from 'lucide-react';

import { AppImage } from '@/components/shared/app-image';
import { Card } from '@/components/ui';
import { formatTimestamp } from '@/lib/date';
import type { EpisodeRelationViewModel } from '@/modules/episodes/types/episode.types';

interface TvShowEpisodeCardProps {
  episode: EpisodeRelationViewModel & {
    episodeImageUrl?: string;
  };
}

export function TvShowEpisodeCard({ episode }: TvShowEpisodeCardProps) {
  const episodeCode = episode.seasonNumber
    ? `S${episode.seasonNumber}E${episode.episodeNumber}`
    : `E${episode.episodeNumber}`;

  return (
    <Card className="rounded-[1.25rem] border border-white/10 bg-card py-0 shadow-none transition hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:rounded-2xl">
      <div className="flex flex-col gap-4 p-3 sm:flex-row sm:gap-4 sm:p-4">
        <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#2a2c31] sm:w-64">
          {episode.episodeImageUrl ? (
            <AppImage
              src={episode.episodeImageUrl}
              alt={`${episode.title} still`}
              fill
              sizes="(max-width: 640px) 100vw, 256px"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
              No image
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs">
              <span className="inline-flex rounded-full border border-white/10 bg-[#25272c] px-2 py-1 text-[#d5d0c5]">
                {episodeCode}
              </span>

              {typeof episode.rating === 'number' && episode.rating > 9 ? (
                <span className="inline-flex rounded-full border border-[#c59a52]/40 bg-[#c59a52] px-2 py-1 font-medium text-black">
                  Top rated
                </span>
              ) : null}

              {typeof episode.rating === 'number' ? (
                <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-[#25272c] px-2 py-1 text-[#d5d0c5]">
                  <Star className="size-3 text-[#c59a52]" />
                  {episode.rating}/10
                </div>
              ) : null}
            </div>

            <h3 className="line-clamp-2 text-sm font-semibold text-white sm:text-base">
              {episode.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#d5d0c5] sm:text-xs">
            <CalendarDays className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="min-w-0 truncate">
              {formatTimestamp(episode.releaseDate, {
                dateStyle: 'medium',
                timeStyle: undefined,
              })}
            </span>
          </div>

          <p className="line-clamp-3 text-sm leading-6 text-[#d5d0c5] sm:line-clamp-3">
            {episode.description}
          </p>
        </div>
      </div>
    </Card>
  );
}
