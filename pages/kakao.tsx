import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import MainNav from '../components/layouts/main-nav';
import styles from './kakao.module.scss';

interface ResponseType {
  ok: boolean;
  error?: any;
}

const Kakao: NextPage = () => {
  const router = useRouter();
  const { code: authCode, error: kakaoServerError } = router.query;

  const loginHandler = useCallback(
    async (code: string | string[]) => {
      const response: ResponseType = await fetch('/api/users/kakao-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authCode: code,
        }),
      }).then((res) => res.json());
      if (response.ok) {
        router.push('/');
      } else {
        router.push('/notifications/authentication-failed');
      }
    },
    [router]
  );

  useEffect(() => {
    if (authCode) {
      console.log('시작');
      loginHandler(authCode);
    } else if (kakaoServerError) {
      router.push('/notifications/authentication-failed');
    }
  }, [loginHandler, authCode, kakaoServerError, router]);

  return (
    <div className={styles.container}>
      <MainNav onlyLogo={true} />
      <main className={styles.main}>
        <div className={styles['msg-box']}>
          <h2>로그인 중입니다..</h2>
        </div>
      </main>
    </div>
  );
};

export default Kakao;
