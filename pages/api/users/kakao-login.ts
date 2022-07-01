import { NextApiRequest, NextApiResponse } from 'next';
import withHandler from '../../../lib/server/withHandler';

interface ITokenResponse {
  token_type: string;
  access_token: string;
  refresh_token: string;
  id_token: string;
  expires_in: number;
  refresh_token_expires_in: string;
  scope: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { authCode } = req.body;
  const tokenUrl = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${process.env.KAKAO_RESTAPI_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&code=${authCode}`;
  const tokenResponse: ITokenResponse = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }).then((res) => res.json());
  // console.log(tokenResponse);
  const userInfoUrl = 'https://kapi.kakao.com/v2/user/me';
  const userInfoResponse = await fetch(userInfoUrl, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenResponse.access_token}`,
    },
  }).then((res) => res.json());
  console.log(userInfoResponse);
  res.end();
  // const { token_type, access_token, expires_in, refresh_token, refresh_token_expires_in } =
  //   req.body;
  // const response = await fetch('"https://kauth.kakao.com/oauth/token"', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     token_type: res.token_type,
  //     access_token: res.access_token,
  //     expires_in: res.expires_in,
  //     refresh_token: res.refresh_token,
  //     refresh_token_expires_in: res.refresh_token_expires_in,
  //   }),
  // });
};
export default withHandler({ methods: ['POST'], handler });
