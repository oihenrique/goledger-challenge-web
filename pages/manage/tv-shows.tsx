import Head from 'next/head';

import { ManageTvShowsPage } from '@/features/tv-shows/manage-tv-shows-page';

export default function ManageTvShowsRoute() {
  return (
    <>
      <Head>
        <title>Manage TV Shows | GoStream</title>
      </Head>
      <ManageTvShowsPage />
    </>
  );
}
