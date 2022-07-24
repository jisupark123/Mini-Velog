import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import useUser from '../../lib/client/useUser';
import styles from './main-nav.module.scss';
import ModeChangeBtn from '../btn/mode-change-btn';
import MakePost from '../newPost/make-post';
import { IoPersonOutline } from 'react-icons/io5';
import { BsPlusSquare } from 'react-icons/bs';
import { useRecoilState } from 'recoil';
import { showUserOptionsAtom } from '../../store/atom';

interface MainNavProps {
  onlyLogo?: boolean;
}

interface OptionList {
  name: string;
  link: string;
}

const MainNav: React.FC<MainNavProps> = ({ onlyLogo = false }) => {
  const { user, isLoading: userIsLoading } = useUser();
  const router = useRouter();

  const [showNewPost, setShowNewPost] = useState(false);
  const [showUserOptions, setShowUserOptions] =
    useRecoilState(showUserOptionsAtom);

  const optionList: OptionList[] = [
    { name: '내 포스트', link: `/users/${user?.id}` },
    { name: '설정', link: `/setting` },
    { name: '로그아웃', link: '/api/users/logout' },
  ];

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
            {/* <ModeChangeBtn /> */}

            {user && (
              <button
                className={styles['post-upload-btn']}
                onClick={clickNewPostHandler}
              >
                {/* <BsPlusSquare /> */}
                <svg
                  aria-label='새로운 게시물'
                  color='#262626'
                  fill='#262626'
                  height='24'
                  role='img'
                  viewBox='0 0 24 24'
                  width='24'
                >
                  <path
                    d='M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552z'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                  ></path>
                  <line
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    x1='6.545'
                    x2='17.455'
                    y1='12.001'
                    y2='12.001'
                  ></line>
                  <line
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    x1='12.003'
                    x2='12.003'
                    y1='6.545'
                    y2='17.455'
                  ></line>
                </svg>
              </button>
            )}
            {(user || userIsLoading) && (
              <button
                className={styles['user-btn']}
                onClick={() => setShowUserOptions(true)}
              >
                <IoPersonOutline />
              </button>
            )}
            {user && (
              <div className={styles.options}>
                {showUserOptions && (
                  <ul>
                    {optionList.map((option, i) => (
                      <li key={i}>
                        <Link href={option.link}>
                          <a>{option.name}</a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {!userIsLoading && !user && (
              <button
                className={styles['login-btn']}
                onClick={() => onBtnClick('/login')}
              >
                로그인
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainNav;
