import Head from 'next/head';

import { PublicTvShowsPage } from '@/features/tv-shows/public-tv-shows-page';

export default function TvShowsPage() {
  return (
    <>
      <Head>
        <title>TV Shows | GoStream</title>
      </Head>
      <PublicTvShowsPage />
    </>
  );
}
