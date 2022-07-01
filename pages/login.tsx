import KakaoBtn from '../components/btn/kakao-btn';

interface IAuthObj {
  token_type: string;
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
}

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

    // * 변경할 사항 *
    // 먼저 백엔드에 로그인을 요청하고 세션이 없거나 만료되었다면 그때 카카오 url로 리다이렉트 시킴
    const res = await window.Kakao.Auth.authorize({
      // client_id: process.env.NEXT_PUBLIC_KAKAO_RESTAPI_KEY,
      redirectUri: 'http://localhost:3000/users/kakao-callback',
      // response_type: 'code',
    });
    console.log(res);
  }
  async function onSuccess(res: IAuthObj) {
    await fetch('/api/users/kakao-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token_type: res.token_type,
        access_token: res.access_token,
        expires_in: res.expires_in,
        refresh_token: res.refresh_token,
        refresh_token_expires_in: res.refresh_token_expires_in,
      }),
    });
  }
  return (
    <div>
      <KakaoBtn title='카카오 로그인' onClickBtn={kakaoLogin} />
    </div>
  );
};

export default Login;
