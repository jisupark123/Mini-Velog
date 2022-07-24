import React from 'react';
import MainNav from './main-nav';
import styles from './layout.module.scss';

interface LayoutProps {
  title?: string;
  hasNav?: boolean;
  hasTapBar?: boolean;
  seoTitle?: string;
  onlyLogo?: boolean;

  children: React.ReactNode;
}

function Layout({ title, hasNav, seoTitle, children, onlyLogo }: LayoutProps) {
  return (
    <React.Fragment>
      <MainNav onlyLogo={onlyLogo} />
      {children}
    </React.Fragment>
  );
}

export default Layout;
