import { NextApiRequest, NextApiResponse } from 'next';
import { getKakaoIdFromSession } from '../../../../lib/secret/createSession';
import client from '../../../../lib/server/client';
import withHandler, { ResponseType } from '../../../../lib/server/withHandler';
import { withApiSession } from '../../../../lib/server/withSession';
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === 'GET') {
    const { id } = req.session.user!;
    const kakaoId = +getKakaoIdFromSession(id);
    const profile = await client.user.findUnique({
      where: { kakaoId },
    });

    res.json({
      ok: true,
      profile: { ...profile, kakaoId: String(profile?.kakaoId) },
    });
  }
}

export default withApiSession(withHandler({ methods: ['GET'], handler }));
