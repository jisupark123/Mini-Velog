import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import useUser from '../../lib/client/useUser';
import styles from './main-nav.module.scss';
import ModeChangeBtn from '../btn/mode-change-btn';
import MakePost from '../newPost/make-post';

interface MainNavProps {
  onlyLogo?: boolean;
  hasTapBar?: boolean;
}

const MainNav: React.FC<MainNavProps> = ({
  onlyLogo = false,
  hasTapBar = true,
}) => {
  const { user } = useUser();
  const router = useRouter();

  const [showNewPost, setShowNewPost] = useState(false);

  function onBtnClick(url: string) {
    router.push(url);
  }
  function logoutHandler() {}
  function clickNewPostHandler() {
    setShowNewPost(true);
  }
  function closeNewPost() {
    setShowNewPost(false);
  }

  return (
    <div className={styles.container}>
      {showNewPost && <MakePost closeNewPost={closeNewPost} update={false} />}
      <div className={styles.nav}>
        <div className={styles.logo}>
          <Link href='/'>
            <a>큰거온다</a>
          </Link>
        </div>
        {!onlyLogo && (
          <div className={styles.btns}>
            <ModeChangeBtn />
            {user && (
              <button
                className={styles['post-upload-btn']}
                onClick={clickNewPostHandler}
              >
                New
              </button>
            )}
            {!user && (
              <button onClick={() => onBtnClick('/login')}>로그인</button>
            )}
            {user && (
              <button onClick={() => onBtnClick('/api/users/logout')}>
                로그아웃
              </button>
            )}
          </div>
        )}
      </div>
      {hasTapBar && <div className={styles['tab-bar']}></div>}
    </div>
  );
};

export default MainNav;
