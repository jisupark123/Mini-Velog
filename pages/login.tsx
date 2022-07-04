import KakaoBtn from '../components/btn/kakao-btn';

const Login = () => {
  async function kakaoLogin() {
    // window.Kakao.Auth.login({
    //   success: function (authObj: IAuthObj) {
    //     console.log(authObj);
    //     onSuccess(authObj);
    //   },
    //   fail: function (err: any) {
    //     console.log(err);
    //   },
    // });

    window.Kakao.Auth.authorize({
      redirectUri: 'http://localhost:3000/users/kakao-callback',
    });
  }
  // async function onSuccess(res: IAuthObj) {
  //   await fetch('/api/users/kakao-login', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       token_type: res.token_type,
  //       access_token: res.access_token,
  //       expires_in: res.expires_in,
  //       refresh_token: res.refresh_token,
  //       refresh_token_expires_in: res.refresh_token_expires_in,
  //     }),
  //   });
  // }
  function plusAgree() {
    window.Kakao.Auth.authorize({
      redirectUri: 'http://localhost:3000/users/kakao-callback',
      scope: 'profile_image',
    });
  }
  return (
    <div>
      <KakaoBtn title='카카오 로그인' onClickBtn={kakaoLogin} />
      <button onClick={plusAgree}>추가 항목 동의</button>
    </div>
  );
};

export default Login;
