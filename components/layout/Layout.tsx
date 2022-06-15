import React from 'react';
import MainNav from './MainNav';
import styles from './Layout.module.scss';

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
