import '../styles/globals.css';
import type { AppProps } from 'next/app';

import { AuthProvider } from '../lib/AuthContext';

import { Amplify } from 'aws-amplify';
import config from '../aws-exports';

Amplify.configure({
  ...config,
  ssr: true,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
