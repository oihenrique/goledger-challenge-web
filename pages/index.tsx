import Head from 'next/head';

import { HomePage } from '@/features/home/home-page';

export default function Home() {
  return (
    <>
      <Head>
        <title>GoStream</title>
      </Head>
      <HomePage />
    </>
  );
}
