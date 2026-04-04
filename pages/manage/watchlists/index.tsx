import Head from 'next/head';

import { ManageWatchlistsPage } from '@/features/watchlists/manage-watchlists-page';

export default function ManageWatchlistsRoute() {
  return (
    <>
      <Head>
        <title>Manage Watchlists | GoStream</title>
      </Head>
      <ManageWatchlistsPage />
    </>
  );
}
