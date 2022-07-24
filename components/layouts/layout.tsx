import React from 'react';
import MainNav from './main-nav';
import styles from './layout.module.scss';
import { useRecoilState } from 'recoil';
import { showUserOptionsAtom } from '../../store/atom';

interface LayoutProps {
  title?: string;
  hasNav?: boolean;
  hasTapBar?: boolean;
  seoTitle?: string;
  onlyLogo?: boolean;

  children: React.ReactNode;
}

function Layout({ title, hasNav, seoTitle, children, onlyLogo }: LayoutProps) {
  const [showUserOptions, setShowUserOptions] =
    useRecoilState(showUserOptionsAtom);
  function handleCloseUserOptions() {
    if (showUserOptions) {
      setShowUserOptions(false);
    }
  }
  return (
    <React.Fragment>
      <div className={styles.wrapper} onClick={handleCloseUserOptions}>
        <MainNav onlyLogo={onlyLogo} />
        <div className={styles['main-wrapper']}>{children}</div>
      </div>
    </React.Fragment>
  );
}

export default Layout;
