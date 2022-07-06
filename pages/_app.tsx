import '../styles/reset.scss';
import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import Script from 'next/script';
import { mutate, SWRConfig } from 'swr';
import UserProvider from '../store/user-provider';
import { useContext, useEffect } from 'react';
import UserCtx from '../store/user-context';
import useUser from '../lib/client/useUser';

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
    <SWRConfig
      value={{
        fetcher: (url: string) =>
          fetch(url).then((response) => response.json()),
      }}
    >
      <Component {...pageProps} />
      <Script
        src='https://developers.kakao.com/sdk/js/kakao.js'
        onLoad={kakaoInit}
      ></Script>
    </SWRConfig>
  );
}

export default App;
