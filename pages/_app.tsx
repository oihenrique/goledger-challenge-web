import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';

import { AppProviders } from '@/shared/providers/app-providers';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppProviders>
      <div className={`${inter.variable} font-sans`}>
        <Component {...pageProps} />
      </div>
    </AppProviders>
  );
}
