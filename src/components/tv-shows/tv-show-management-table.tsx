import type { TvShowViewModel } from '@/modules/tv-shows/types/tv-show.types';

interface TvShowManagementTableProps {
  tvShows: TvShowViewModel[];
}

export function TvShowManagementTable({
  tvShows,
}: TvShowManagementTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-card">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-[#2a2c31]">
            <tr className="text-left text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <th className="px-5 py-4 font-medium">Title</th>
              <th className="px-5 py-4 font-medium">Recommended age</th>
              <th className="px-5 py-4 font-medium">Last transaction</th>
              <th className="px-5 py-4 font-medium">Updated at</th>
              <th className="px-5 py-4 font-medium">Key</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {tvShows.map((tvShow) => (
              <tr key={tvShow.key} className="align-top">
                <td className="px-5 py-4">
                  <div className="space-y-2">
                    <p className="font-medium text-white">{tvShow.title}</p>
                    <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                      {tvShow.description}
                    </p>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-[#d5d0c5]">
                  {tvShow.recommendedAge}+
                </td>
                <td className="px-5 py-4 text-sm text-[#d5d0c5]">
                  {tvShow.lastTransaction}
                </td>
                <td className="px-5 py-4 text-sm text-[#d5d0c5]">
                  {tvShow.updatedAt}
                </td>
                <td className="px-5 py-4 text-sm text-muted-foreground">
                  {tvShow.key}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
