import '../styles/globals.css';
import type { AppProps } from 'next/app';
import NextNProgress from 'nextjs-progressbar';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react';
import { useState } from 'react';
import { Open_Sans } from '@next/font/google';
import { Database } from '../../types/supabase';
import Head from 'next/head';

const openSans = Open_Sans({ subsets: ['latin'] });

function MyApp({
  Component,
  pageProps,
}: AppProps<{ initialSession: Session }>) {
  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient<Database>()
  );

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <Head>
        <title>Ledes Weekly Report</title>
      </Head>
      <NextNProgress />
      <Component {...pageProps} />
    </SessionContextProvider>
  );
}

export default MyApp;
