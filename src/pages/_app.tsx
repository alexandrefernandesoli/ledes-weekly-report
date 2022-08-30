import '../styles/globals.css';
import type { AppProps } from 'next/app';

import { AuthProvider } from '../lib/AuthContext';
import NextNProgress from 'nextjs-progressbar';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <NextNProgress />
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
