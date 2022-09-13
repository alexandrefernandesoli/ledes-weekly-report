import '../styles/globals.css';
import type { AppProps } from 'next/app';

import { AuthProvider } from '../lib/AuthContext';
import NextNProgress from 'nextjs-progressbar';
import { DataProvider } from '../lib/DataContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <DataProvider>
        <NextNProgress />
        <Component {...pageProps} />
      </DataProvider>
    </AuthProvider>
  );
}

export default MyApp;
