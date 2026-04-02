import Head from 'next/head';
import type { GetServerSidePropsContext } from 'next';

import { TvShowDetailPage } from '@/features/tv-shows/tv-show-detail-page';

interface TvShowDetailRouteProps {
  title: string;
}

export default function TvShowDetailRoute({
  title,
}: TvShowDetailRouteProps) {
  return (
    <>
      <Head>
        <title>{title} | GoStream</title>
      </Head>
      <TvShowDetailPage title={title} />
    </>
  );
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  const rawTitle = context.params?.title;

  if (typeof rawTitle !== 'string' || !rawTitle.trim()) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      title: decodeURIComponent(rawTitle),
    },
  };
}
