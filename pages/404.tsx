import Link from 'next/link';
import React from 'react';
import Layout from '../components/layouts/layout';
import styles from './404.module.scss';

const PageNotFound = () => {
  return (
    <Layout>
      <div className={styles.container}>
        <h1>404 Not Found</h1>
        <Link href={'/'}>
          <a>홈으로</a>
        </Link>
      </div>
    </Layout>
  );
};

export default PageNotFound;
