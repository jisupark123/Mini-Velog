import '../styles/reset.scss';
import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import Script from 'next/script';
import { SWRConfig } from 'swr';
import NoticeProvider from '../store/notice-provider';
import { useContext } from 'react';
import NoticeCtx from '../store/notice-context';
import Notice from '../components/notification/notice';

declare global {
  interface Window {
    Kakao: any;
  }
}
function App({ Component, pageProps }: AppProps) {
  const noticeCtx = useContext(NoticeCtx);

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
      <NoticeProvider>
        <div id='overlay'></div>
        {noticeCtx && <Notice ctx={noticeCtx} />}
        <Component {...pageProps} />
        <Script
          src='https://developers.kakao.com/sdk/js/kakao.js'
          onLoad={kakaoInit}
        ></Script>
      </NoticeProvider>
    </SWRConfig>
  );
}

export default App;
