import { useRouter } from 'next/router';
import { useEffect } from 'react';

const KakaoCallback = () => {
  const router = useRouter();
  const { code: authCode, error } = router.query;
  async function sendAuthCode(code: string | string[]) {
    await fetch('/api/users/kakao-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        authCode: code,
      }),
    });
  }
  useEffect(() => {
    if (authCode) {
      sendAuthCode(authCode);
    } else if (error) {
      alert(error);
      router.push('/');
    }
  }, [router, authCode, error]);
  return <div></div>;
};

export default KakaoCallback;
