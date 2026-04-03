import { CalendarDays, Star } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { formatTimestamp } from '@/lib/date';
import type { EpisodeViewModel } from '@/modules/episodes/types/episode.types';

interface TvShowEpisodeCardProps {
  episode: EpisodeViewModel;
}

export function TvShowEpisodeCard({ episode }: TvShowEpisodeCardProps) {
  return (
    <Card className="rounded-3xl border border-white/10 bg-card py-0 shadow-none ring-0">
      <CardHeader className="space-y-3 px-5 pt-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <div className="inline-flex rounded-full border border-white/10 bg-[#2a2c31] px-3 py-1">
            Episode {episode.episodeNumber}
          </div>
          {typeof episode.rating === 'number' ? (
            <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-[#2a2c31] px-3 py-1 text-[#d5d0c5]">
              <Star className="size-3.5 text-[#c59a52]" />
              {episode.rating}/10
            </div>
          ) : null}
        </div>
        <CardTitle className="text-lg font-semibold text-white">
          {episode.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-5 pb-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#2a2c31] px-3 py-1 text-xs text-[#d5d0c5]">
          <CalendarDays className="size-3.5 text-muted-foreground" />
          Released{' '}
          {formatTimestamp(episode.releaseDate, {
            dateStyle: 'medium',
            timeStyle: undefined,
          })}
        </div>
        <p className="text-sm leading-7 text-[#d5d0c5]">
          {episode.description}
        </p>
      </CardContent>
    </Card>
  );
}
