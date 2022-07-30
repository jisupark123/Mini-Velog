import Layout from '../components/layouts/layout';
import styles from './login.module.scss';

const Login = () => {
  function kakaoLogin() {
    window.Kakao.Auth.authorize({
      redirectUri:
        process.env.NODE_ENV === 'production'
          ? 'https://mini-velog.vercel.app/kakao'
          : 'http://localhost:3000/kakao',
    });
  }

  // function plusAgree() {
  //   window.Kakao.Auth.authorize({
  //     redirectUri: 'http://localhost:3000/kakao',
  //     scope: 'profile_image',
  //   });
  // }
  return (
    <div className={styles.wrapper}>
      <Layout>
        <div className={styles.container}>
          <h1 className={styles.title}>
            로그인하고 더 많은 기능을 이용해보세요!
          </h1>
          <div className={styles['division-line']}>
            <div className={styles.line}></div>
            <span>Social Login</span>
            <div className={styles.line}></div>
          </div>
          <button className={styles['kakao-btn']} onClick={kakaoLogin}>
            <svg
              aria-hidden='true'
              focusable='false'
              data-prefix='fas'
              data-icon='comment'
              role='img'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 512 512'
            >
              <path
                fill='currentColor'
                d='M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z'
              ></path>
            </svg>
            카카오 로그인
          </button>
        </div>
      </Layout>
    </div>
  );
};

export default Login;
