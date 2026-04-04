import Link from 'next/link';
import { PencilLine, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { TvShowManagementDetailsModal } from '@/components/tv-shows/tv-show-management-details-modal';
import { Button } from '@/components/ui';
import type { TvShowViewModel } from '@/modules/tv-shows/types/tv-show.types';

interface TvShowManagementTableProps {
  onDelete: (tvShow: TvShowViewModel) => void;
  onEdit: (tvShow: TvShowViewModel) => void;
  tvShows: TvShowViewModel[];
}

export function TvShowManagementTable({
  onDelete,
  onEdit,
  tvShows,
}: TvShowManagementTableProps) {
  const [selectedTvShow, setSelectedTvShow] = useState<TvShowViewModel | null>(
    null,
  );

  function openDetails(tvShow: TvShowViewModel) {
    setSelectedTvShow(tvShow);
  }

  function closeDetails() {
    setSelectedTvShow(null);
  }

  function handleRowKeyDown(
    event: React.KeyboardEvent<HTMLTableRowElement>,
    tvShow: TvShowViewModel,
  ) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openDetails(tvShow);
    }
  }

  return (
    <>
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-[#2a2c31]">
              <tr className="text-left text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <th className="px-5 py-4 font-medium">TV show</th>
                <th className="px-5 py-4 font-medium">Description</th>
                <th className="px-5 py-4 font-medium">Recommended age</th>
                <th className="px-5 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {tvShows.map((tvShow) => (
                <tr
                  key={tvShow.key}
                  tabIndex={0}
                  onClick={() => openDetails(tvShow)}
                  onKeyDown={(event) => handleRowKeyDown(event, tvShow)}
                  className="cursor-pointer align-top transition hover:bg-white/5 focus-visible:bg-white/5 focus-visible:outline-none"
                >
                  <td className="px-5 py-4">
                    <div className="space-y-2">
                      <p className="font-medium text-white">{tvShow.title}</p>
                      <div
                        className="max-w-55 truncate text-xs text-muted-foreground"
                        title={tvShow.key}
                      >
                        {tvShow.key}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div
                      className="max-w-[320px] truncate text-sm leading-6 text-muted-foreground"
                      title={tvShow.description}
                    >
                      {tvShow.description}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#d5d0c5]">
                    {tvShow.recommendedAge}+
                  </td>
                  <td className="min-w-49 px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        onClick={(event) => {
                          event.stopPropagation();
                        }}
                      >
                        <Link
                          href={`/manage/tv-shows/${encodeURIComponent(tvShow.title)}`}
                        >
                          <span>Manage</span>
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(event) => {
                          event.stopPropagation();
                          onEdit(tvShow);
                        }}
                      >
                        <PencilLine className="size-4" />
                        <span>Edit</span>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(event) => {
                          event.stopPropagation();
                          onDelete(tvShow);
                        }}
                      >
                        <Trash2 className="size-4" />
                        <span>Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTvShow ? (
        <TvShowManagementDetailsModal
          tvShow={selectedTvShow}
          onClose={closeDetails}
        />
      ) : null}
    </>
  );
}
