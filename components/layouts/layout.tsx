import React from 'react';
import MainNav from './main-nav';
import styles from './layout.module.scss';
import Script from 'next/script';

type Props = { children: React.ReactNode };

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <React.Fragment>
      <MainNav />
      <main className={styles.main}>{children}</main>
    </React.Fragment>
  );
};

export default Layout;
