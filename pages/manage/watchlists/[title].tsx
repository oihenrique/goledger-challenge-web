import Head from 'next/head';
import { useRouter } from 'next/router';

import { ManageWatchlistDetailPage } from '@/features/watchlists/manage-watchlist-detail-page';

export default function ManageWatchlistDetailRoute() {
  const router = useRouter();
  const title = router.query.title;

  if (typeof title !== 'string') {
    return null;
  }

  return (
    <>
      <Head>
        <title>{decodeURIComponent(title)} | Watchlist Workspace | GoStream</title>
      </Head>
      <ManageWatchlistDetailPage title={decodeURIComponent(title)} />
    </>
  );
}
