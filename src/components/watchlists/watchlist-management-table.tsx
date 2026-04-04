import { useRouter } from 'next/router';
import { MoreHorizontal, PencilLine, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui';
import { formatDate } from '@/lib/date';
import type { WatchlistViewModel } from '@/modules/watchlists/types/watchlist.types';

interface WatchlistManagementTableProps {
  onDelete: (watchlist: WatchlistViewModel) => void;
  onEdit: (watchlist: WatchlistViewModel) => void;
  watchlists: WatchlistViewModel[];
}

export function WatchlistManagementTable({
  onDelete,
  onEdit,
  watchlists,
}: WatchlistManagementTableProps) {
  const router = useRouter();

  function getItemsLabel(itemCount: number) {
    return `${itemCount} ${itemCount === 1 ? 'title' : 'titles'}`;
  }

  function handleRowKeyDown(
    event: React.KeyboardEvent<HTMLLIElement>,
    watchlist: WatchlistViewModel,
  ) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      void router.push(
        `/manage/watchlists/${encodeURIComponent(watchlist.title)}`,
      );
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-card">
      <ul className="divide-y divide-white/10">
        {watchlists.map((watchlist) => (
          <li
            key={watchlist.key}
            role="link"
            tabIndex={0}
            aria-label={`Open watchlist ${watchlist.title} with ${getItemsLabel(
              watchlist.tvShowKeys.length,
            )}`}
            onKeyDown={(event) => handleRowKeyDown(event, watchlist)}
            onClick={() => {
              void router.push(
                `/manage/watchlists/${encodeURIComponent(watchlist.title)}`,
              );
            }}
            className="cursor-pointer transition hover:bg-white/5 focus-visible:bg-white/5 focus-visible:outline-none"
          >
            <div className="flex items-center gap-4 px-4 py-4 sm:px-5">
              <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#25272c]">
                <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(68,114,196,0.24),rgba(15,23,42,0.94))]" />
                <div className="relative flex h-full items-end p-2">
                  <span className="line-clamp-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/80">
                    {watchlist.title}
                  </span>
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-lg font-semibold text-white">
                  {watchlist.title}
                </p>
                <p className="text-base text-[#d5d0c5]">
                  {getItemsLabel(watchlist.tvShowKeys.length)}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  Modified {formatDate(watchlist.updatedAt)}
                </p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="shrink-0 text-muted-foreground hover:text-white"
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                  >
                    <MoreHorizontal className="size-5" />
                    <span className="sr-only">Open watchlist actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-44 rounded-xl border-white/10 bg-[#1f2126] text-[#ebe5d8]"
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <DropdownMenuItem
                    onClick={() => {
                      onEdit(watchlist);
                    }}
                  >
                    <PencilLine className="size-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => {
                      onDelete(watchlist);
                    }}
                  >
                    <Trash2 className="size-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
