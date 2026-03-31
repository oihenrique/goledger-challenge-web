import {
  ChevronDown,
  CircleUserRound,
  Clapperboard,
  List,
  Shield,
} from 'lucide-react';

const workspaceItems = [
  'Series',
  'Seasons',
  'Episodes',
  'Watchlists',
];

export function ProfileMenu() {
  return (
    <details className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/8">
        <CircleUserRound className="size-5 text-cyan-200" />
        <span className="hidden sm:inline">Henrique</span>
        <ChevronDown className="size-4 transition group-open:rotate-180" />
      </summary>
      <div className="absolute right-0 top-[calc(100%+0.75rem)] z-20 w-72 rounded-2xl border border-white/10 bg-slate-950/95 p-3 shadow-2xl shadow-black/40 backdrop-blur">
        <div className="border-b border-white/10 px-3 pb-3">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/80">
            Editorial workspace
          </p>
          <p className="mt-2 text-sm text-slate-300">
            Community catalog management and technical tools live here.
          </p>
        </div>
        <div className="py-3">
          {workspaceItems.map((item) => (
            <button
              key={item}
              type="button"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-white/5"
            >
              <Clapperboard className="size-4 text-slate-400" />
              <span>{item}</span>
            </button>
          ))}
        </div>
        <div className="border-t border-white/10 pt-3">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-white/5"
          >
            <Shield className="size-4 text-slate-400" />
            <span>Technical audit</span>
          </button>
          <button
            type="button"
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-white/5"
          >
            <List className="size-4 text-slate-400" />
            <span>Community roadmap</span>
          </button>
        </div>
      </div>
    </details>
  );
}
