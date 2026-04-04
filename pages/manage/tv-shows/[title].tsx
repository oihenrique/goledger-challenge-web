import Head from 'next/head';
import type { GetServerSidePropsContext } from 'next';

import { ManageTvShowRelationsPage } from '@/features/tv-shows/manage-tv-show-relations-page';

interface ManageTvShowRelationsRouteProps {
  title: string;
}

export default function ManageTvShowRelationsRoute({
  title,
}: ManageTvShowRelationsRouteProps) {
  return (
    <>
      <Head>
        <title>Manage {title} | GoStream</title>
      </Head>
      <ManageTvShowRelationsPage title={title} />
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
