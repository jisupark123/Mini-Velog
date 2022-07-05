import KakaoBtn from '../components/btn/kakao-btn';
import styles from './login.module.scss';

const Login = () => {
  function kakaoLogin() {
    window.Kakao.Auth.authorize({
      redirectUri: 'http://localhost:3000/kakao',
    });
  }

  function plusAgree() {
    window.Kakao.Auth.authorize({
      redirectUri: 'http://localhost:3000/kakao',
      scope: 'profile_image',
    });
  }
  return (
    <div className={styles.container}>
      <KakaoBtn title='카카오 로그인' onClickBtn={kakaoLogin} />
      <button onClick={plusAgree}>추가 항목 동의</button>
    </div>
  );
};

export default Login;
