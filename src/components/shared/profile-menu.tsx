import Link from 'next/link';
import { ChevronDown, CircleUserRound, Clapperboard } from 'lucide-react';

const workspaceItems = [
  { href: '/manage/tv-shows', label: 'Manage Series' },
  { href: '/manage/watchlists', label: 'Manage Watchlists' },
];

export function ProfileMenu() {
  return (
    <details className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-3 rounded-full border border-white/10 bg-[#26282d] px-3 py-2 text-sm text-[#ebe5d8] transition hover:border-white/20 hover:bg-[#2d3035]">
        <CircleUserRound className="size-5 text-[#c59a52]" />
        <span className="hidden sm:inline">Username</span>
        <ChevronDown className="size-4 transition group-open:rotate-180" />
      </summary>
      <div className="absolute right-0 top-[calc(100%+0.75rem)] z-20 w-72 rounded-2xl border border-white/10 bg-[#1d1f23] p-3 shadow-2xl shadow-black/40">
        <div className="border-b border-white/10 px-3 pb-3">
          <p className="mt-2 text-sm text-[#d5d0c5]">
            Community catalog management and technical tools live here.
          </p>
        </div>
        <div className="py-3">
          {workspaceItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-[#ebe5d8] transition hover:bg-white/5"
            >
              <Clapperboard className="size-4 text-muted-foreground" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </details>
  );
}
