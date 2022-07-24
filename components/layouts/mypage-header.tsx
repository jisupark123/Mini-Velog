import { User } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import styles from './mypage-header.module.scss';
import { AiOutlineSetting } from 'react-icons/ai';

type TabName = 'Dashboard' | 'Post';

interface MypageHeaderProps {
  user: User;
  postNumber: number;
  tabName: TabName;
}
interface NavList {
  name: string;
  url: string;
}

const MypageHeader: React.FC<MypageHeaderProps> = ({
  user,
  postNumber,
  tabName,
}) => {
  const router = useRouter();
  const {
    query: { id },
  } = router;
  console.log(id);
  const navList: NavList[] = [
    {
      name: 'Dashboard',
      url: `/users/${id}/dashboard`,
    },
    {
      name: 'Post',
      url: `/users/${id}/posts`,
    },
  ];
  return (
    <header className={styles['page-header']}>
      <div className={styles['container']}>
        <div className={styles.icon}>
          <Image
            className={styles['user-icon']}
            src={
              user.profileImage?.length
                ? user.profileImage
                : '/default-avatar.jpeg'
            }
            alt='user-icon'
            layout='fill'
            objectFit='cover'
          ></Image>
        </div>
        <div className={styles.name}>{user.name}</div>
        <div className={styles.info}>
          <p className={styles['user-introduction']}>{user.introduction}</p>
          {/* <div className={styles['data-row']}>
            <b>{postNumber}</b>
            개의 포스트
          </div> */}
        </div>
        <div className={styles.actions}>
          <Link href={'/setting'}>
            <a className={styles.wrapper}>
              <AiOutlineSetting />
              <span>설정</span>
            </a>
          </Link>
        </div>
        <ul className={styles.nav}>
          {navList.map((list, i) => (
            <li
              key={i}
              className={`${styles['nav-item']} ${
                list.name === tabName ? styles['tab-focus'] : ''
              }`}
            >
              <Link href={list.url}>
                <a>{list.name}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default MypageHeader;
