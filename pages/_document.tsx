import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="description"
          content="GoStream is a TV catalog frontend built for the GoLedger blockchain challenge."
        />
        <meta name="theme-color" content="#0f172a" />
      </Head>
      <body className="dark antialiased font-sans">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
