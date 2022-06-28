import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './main-nav.module.scss';
import ModeChangeBtn from './mode-change-btn';

const MainNav = () => {
  const router = useRouter();
  function writeBtnHandler() {
    router.push('/posts/upload');
  }
  return (
    <nav className={styles.nav}>
      <div className={styles.innerNav}>
        <div className={styles.logo}>
          <Link href='/'>
            <a>큰거온다</a>
          </Link>
        </div>
        <div className={styles.btns}>
          <ModeChangeBtn />

          <button className={styles['post-upload-btn']} onClick={writeBtnHandler}>
            New
          </button>
        </div>
      </div>
    </nav>
  );
};

export default MainNav;
