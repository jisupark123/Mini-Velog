import '../styles/reset.scss';
import '../styles/globals.scss';
// import '../styles/_variables.scss';
import type { AppProps } from 'next/app';
import Layout from '../components/layouts/layout';
import Script from 'next/script';

declare global {
  interface Window {
    Kakao: any;
  }
}
function App({ Component, pageProps }: AppProps) {
  function kakaoInit() {
    window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
    console.log(window.Kakao.isInitialized());
  }

  return (
    <Layout>
      <Component {...pageProps} />
      <Script src='https://developers.kakao.com/sdk/js/kakao.js' onLoad={kakaoInit}></Script>
    </Layout>
  );
}

export default App;
