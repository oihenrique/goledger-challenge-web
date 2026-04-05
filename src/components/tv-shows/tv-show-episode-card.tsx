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
    <Card className="rounded-2xl border border-white/10 bg-card py-0 shadow-none transition hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <div className="flex gap-4 p-4">
        <div className="relative w-64 shrink-0 aspect-video overflow-hidden rounded-xl border border-white/10 bg-[#2a2c31]">
          {episode.episodeImageUrl ? (
            <AppImage
              src={episode.episodeImageUrl}
              alt={`${episode.title} still`}
              fill
              sizes="256px"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
              No image
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex rounded-full border border-white/10 bg-[#25272c] px-2 py-1 text-[#d5d0c5]">
                {episodeCode}
              </span>
              {typeof episode.rating === 'number' ? (
                <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-[#25272c] px-2 py-1 text-[#d5d0c5]">
                  <Star className="size-3 text-[#c59a52]" />
                  {episode.rating}/10
                </div>
              ) : null}
            </div>
            <h3 className="text-base font-semibold text-white line-clamp-2">
              {episode.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#d5d0c5]">
            <CalendarDays className="size-3.5 text-muted-foreground" />
            <span>
              {formatTimestamp(episode.releaseDate, {
                dateStyle: 'medium',
                timeStyle: undefined,
              })}
            </span>
          </div>

          <p className="text-sm text-[#d5d0c5] line-clamp-3 leading-6">
            {episode.description}
          </p>
        </div>
      </div>
    </Card>
  );
}
