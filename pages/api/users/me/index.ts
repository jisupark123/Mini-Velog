import { User } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserIdFromSession } from '../../../../lib/secret/createSession';
import client from '../../../../lib/server/client';
import withHandler, { ResponseType } from '../../../../lib/server/withHandler';
import { withApiSession } from '../../../../lib/server/withSession';

export interface UserResponse {
  ok: boolean;
  profile: User;
}
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === 'GET') {
    const { id } = req.session.user!;
    const userId = getUserIdFromSession(id);
    const profile = await client.user.findUnique({
      where: { id: userId },
    });

    res.json({
      ok: true,
      profile: { ...profile, kakaoId: String(profile?.kakaoId) },
    });
  }
  if (req.method === 'POST') {
    const {
      session: { user },
      body: { avatarId, introduction, nickname },
    } = req;
    const userId = getUserIdFromSession(user!.id);
    if (avatarId || avatarId == '') {
      await client.user.update({
        where: { id: userId },
        data: { avatar: avatarId, introduction, nickname },
      });
      console.log(avatarId, '아바타 업데이트');
    } else {
      await client.user.update({
        where: { id: userId },
        data: { introduction, nickname },
      });
      console.log(avatarId, '아바타 업데이트X');
    }
    return res.json({ ok: true });
  }
}

export default withApiSession(
  withHandler({ methods: ['GET', 'POST'], privateMethods: ['POST'], handler })
);
