import '../styles/reset.scss';
import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import Script from 'next/script';
import { SWRConfig } from 'swr';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useNotice } from '../store/notice-context';
import Notice from '../components/notification/notice';
import Confirm from '../components/ui/confirm';
import NoticeProvider from '../store/notice-context';
import ConfirmProvider, { useConfirm } from '../store/confirm-context';

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
      <NoticeProvider>
        <ConfirmProvider>
          <div id='overlay'></div>
          <Notice />
          <Confirm />
          <Component {...pageProps} />
          <Script
            src='https://developers.kakao.com/sdk/js/kakao.js'
            onLoad={kakaoInit}
          ></Script>
        </ConfirmProvider>
      </NoticeProvider>
    </SWRConfig>
  );
}

export default App;
