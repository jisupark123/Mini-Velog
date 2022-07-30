import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import Layout from '../components/layouts/layout';
import LoadingSvg from '../components/svg/loading-svg';
import useUser from '../lib/client/useUser';
import styles from './kakao.module.scss';

interface ResponseType {
  ok: boolean;
  error?: any;
}

const Kakao: NextPage = () => {
  const { mutate } = useUser();
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
        mutate();
        router.push('/');
      } else {
        router.push('/notifications/authentication-failed');
      }
    },
    [router, mutate]
  );

  useEffect(() => {
    if (authCode) {
      loginHandler(authCode);
    } else if (kakaoServerError) {
      router.push('/notifications/authentication-failed');
    }
  }, [loginHandler, authCode, kakaoServerError, router]);

  return (
    <div className={styles.wrapper}>
      <Layout onlyLogo={true}>
        <div className={styles.container}>
          <div className={styles['msg-box']}>
            <h2>로그인 중입니다...</h2>
          </div>
          <LoadingSvg width={80} speed='fast' />
        </div>
      </Layout>
    </div>
  );
};

export default Kakao;
