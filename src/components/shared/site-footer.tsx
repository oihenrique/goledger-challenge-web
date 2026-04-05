import Image from 'next/image';
import Link from 'next/link';

const productLinks = [
  { href: '/manage/tv-shows', label: 'Editorial Workspace' },
  { href: '/tv-shows', label: 'Series Catalog' },
];

const projectLinks = [{ href: '/about', label: 'About' }];

const socialLinks = [
  {
    href: 'https://github.com/oihenrique/goledger-challenge-web',
    label: 'GitHub',
  },
  { href: 'https://www.linkedin.com/in/oihenriquegomes', label: 'LinkedIn' },
  { href: 'https://x.com', label: 'X' },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#191a1d]">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-32">
              <Image
                src="/logo.png"
                alt="GoStream logo"
                fill
                sizes="128px"
                className="object-contain"
                priority
              />
            </div>
          </Link>
          <p className="max-w-sm text-sm leading-7 text-muted-foreground">
            Community-driven TV catalog with a public discovery layer and a
            dedicated editorial workspace powered by blockchain-backed records.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Product
          </p>
          <div className="mt-4 space-y-3">
            {productLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block text-sm text-[#d5d0c5] transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Project
          </p>
          <div className="mt-4 space-y-3">
            {projectLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block text-sm text-[#d5d0c5] transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Follow us
          </p>
          <div className="mt-4 space-y-3">
            {socialLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block text-sm text-[#d5d0c5] transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-4 text-sm text-muted-foreground sm:px-10 sm:flex-row sm:items-center sm:justify-center">
          <p>© 2026 GoStream. Built for the GoLedger challenge.</p>
        </div>
      </div>
    </footer>
  );
}
