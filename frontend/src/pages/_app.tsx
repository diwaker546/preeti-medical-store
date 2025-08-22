import type { AppProps } from 'next/app';
import '../styles/globals.css';
import '../lib/i18n';
import '../lib/auth';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
