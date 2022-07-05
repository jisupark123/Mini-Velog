import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import styles from './main-nav.module.scss';
import ModeChangeBtn from './mode-change-btn';

interface MainNavProps {
  onlyLogo?: boolean;
}

const MainNav: React.FC<MainNavProps> = ({ onlyLogo = false }) => {
  const router = useRouter();
  function onBtnClick(url: string) {
    router.push(url);
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.innerNav}>
        <div className={styles.logo}>
          <Link href='/'>
            <a>큰거온다</a>
          </Link>
        </div>
        {!onlyLogo && (
          <div className={styles.btns}>
            <ModeChangeBtn />
            <button
              className={styles['post-upload-btn']}
              onClick={() => onBtnClick('/posts/upload')}
            >
              New
            </button>
            <button onClick={() => onBtnClick('/login')}>로그인</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default MainNav;
