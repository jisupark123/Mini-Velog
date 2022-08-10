import { NextApiRequest, NextApiResponse } from 'next';
import { createSession } from '../../../lib/secret/createSession';
import client from '../../../lib/server/client';

import withHandler, { ResponseType } from '../../../lib/server/withHandler';
import { withApiSession } from '../../../lib/server/withSession';

export interface KakaoLoginResponse extends ResponseType {
  firstLogin: boolean;
}

interface TokenResponse {
  token_type: string;
  access_token: string;
  refresh_token: string;
  id_token: string;
  expires_in: number;
  refresh_token_expires_in: string;
  scope: string;
}

interface UserInfo {
  id: number;
  connected_at: string;
  properties: {
    nickname: string;
  };
}
async function getTokenFromKakao(authCode: string) {
  const tokenUrl = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${process.env.KAKAO_RESTAPI_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&code=${authCode}`;
  const response: TokenResponse = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }).then((res) => res.json());
  return response;
}
async function getUserFromKakao({ access_token }: TokenResponse) {
  const userInfoUrl = 'https://kapi.kakao.com/v2/user/me';
  const response: UserInfo = await fetch(userInfoUrl, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
  }).then((res) => res.json());
  return response;
}
async function getUser(kakaoId: number) {
  const user = await client.user.findUnique({
    where: { kakaoId },
  });
  console.log('getUser');
  return user;
}
async function createOrUpdateSession(userId: number, newSessionId: string) {
  const user = await client.user.update({
    where: { id: userId },
    data: {
      session: {
        upsert: {
          update: { sessionId: newSessionId },
          create: { sessionId: newSessionId },
        },
      },
    },
  });
  console.log('createOrUpdateSession');
  return user;
}
// async function createSessionAndConnectToUser(
//   kakaoId: number,
//   newSessionId: string
// ) {
//   const user = await client.user.update({
//     where: {
//       kakaoId: kakaoId,
//     },
//     data: { session: { update: { sessionId: newSessionId } } },
//   });
//   console.log(`try2: ${user}`);
//   return user;
// }
async function createUser({ id: kakaoId, properties: { nickname } }: UserInfo) {
  const user = await client.user.create({
    data: {
      name: nickname,
      kakaoId,
      loggedFrom: 'Kakao',
    },
  });
  const newSessionId = createSession(user.id);
  await client.user.update({
    where: { id: user.id },
    data: { session: { create: { sessionId: newSessionId } } },
  });
  console.log(`아이디 생성 끝: ${user}`);
  return newSessionId;
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const { authCode } = req.body;

  const tokenResponse = await getTokenFromKakao(authCode);
  const userInfo = await getUserFromKakao(tokenResponse);
  const {
    id: kakaoId,
    properties: { nickname },
  } = userInfo;
  let user = await getUser(kakaoId);
  let newSessionId;
  let firstLogin = false;

  if (user) {
    newSessionId = createSession(user.id);
    await createOrUpdateSession(user.id, newSessionId);
  } else {
    newSessionId = await createUser(userInfo);
    firstLogin = true;
  }

  req.session.user = { id: newSessionId };
  await req.session.save();
  console.log('firstLogin', firstLogin);

  return res.json({ ok: true, firstLogin });
};
export default withApiSession(withHandler({ methods: ['POST'], handler }));
