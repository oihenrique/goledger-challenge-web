import type { PropsWithChildren } from 'react';

import { SiteHeader } from '@/layout/site-header';

export function PageShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen text-white">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-6 sm:px-10">{children}</main>
    </div>
  );
}
