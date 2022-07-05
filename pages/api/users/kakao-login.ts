import { NextApiRequest, NextApiResponse } from 'next';
import { createSession } from '../../../lib/secret/createSession';
import client from '../../../lib/server/client';

import withHandler, { ResponseType } from '../../../lib/server/withHandler';
import { withApiSession } from '../../../lib/server/withSession';

interface ITokenResponse {
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
    profile_image?: string; // 640x640
    thumbnail_image?: string; // 110x110
  };
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const { authCode } = req.body;
  const tokenUrl = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${process.env.KAKAO_RESTAPI_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&code=${authCode}`;
  const tokenResponse: ITokenResponse = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }).then((res) => res.json());

  const userInfoUrl = 'https://kapi.kakao.com/v2/user/me';
  const userInfo: UserInfo = await fetch(userInfoUrl, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenResponse.access_token}`,
    },
  })
    .then((res) => res.json())
    .catch((error) => {
      console.log(error);
      return res.status(401).json({ ok: false, error });
    });

  const {
    id: kakaoId,
    properties: { nickname, profile_image, thumbnail_image },
  } = userInfo;

  let session;
  let user;
  let first = false;
  const newSessionId = createSession(kakaoId);

  try {
    // 세션이 존재하면 업데이트만 해주면 됨
    session = await client.session.update({
      where: {
        kakaoId,
      },
      data: {
        sessionId: newSessionId,
      },
    });
    console.log(`try1: ${session}`);
  } catch {
    // 유저는 존재하는데 세션이 없는 경우 (세션이 해킹당했다고 의심되면 세션 저장소를 없애야 한다)
    // 유저의 세션 값만 업데이트 해준다.
    try {
      user = await client.user.update({
        where: {
          kakaoId,
        },
        data: {
          session: {
            create: { kakaoId, sessionId: newSessionId },
          },
        },
      });
      console.log(`try2: ${user}`);

      // 유저가 존재하지 않으면 새로운 계정을 생성한다.
    } catch {
      user = await client.user.create({
        data: {
          name: nickname,
          kakaoId,
          loggedFrom: 'Kakao',
          profileImage: profile_image || null,
          session: {
            create: { kakaoId, sessionId: newSessionId },
          },
        },
      });
      console.log(`catch: ${user}`);
    }
  }

  req.session.user = { id: newSessionId };
  await req.session.save();
  return res.json({ ok: true });

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
export default withApiSession(withHandler({ methods: ['POST'], handler }));
