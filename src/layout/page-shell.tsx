import type { PropsWithChildren } from 'react';

import { SiteFooter } from '@/components/shared/site-footer';
import { SiteHeader } from '@/components/shared/site-header';

export function PageShell({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col text-white">
      <SiteHeader />
      <main className="mx-auto flex-1 w-full max-w-6xl px-6 sm:px-10">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
