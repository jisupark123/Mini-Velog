import Link from 'next/link';
import React, { useEffect } from 'react';
import Layout from '../../components/layouts/layout';
import { useNotice } from '../../store/notice-context';
import styles from './authentication-failed.module.scss';

const AuthenticationFailed = () => {
  const { failed } = useNotice();
  useEffect(() => {
    failed('오류가 발생했습니다.');
  }, []);
  return (
    <Layout>
      <div className={styles.container}>
        <h1>Authentication Failed</h1>
        <Link href={'/login'}>
          <a>다시 시도하기→</a>
        </Link>
      </div>
    </Layout>
  );
};

export default AuthenticationFailed;
