import '../styles/reset.scss';
import '../styles/globals.scss';
// import '../styles/_variables.scss';
import type { AppProps } from 'next/app';
import Layout from '../components/layout/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
