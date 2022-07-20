import { NextApiRequest, NextApiResponse } from 'next';
import { getUserIdFromSession } from '../../../../lib/secret/createSession';
import client from '../../../../lib/server/client';
import withHandler, { ResponseType } from '../../../../lib/server/withHandler';
import { withApiSession } from '../../../../lib/server/withSession';
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
}

export default withApiSession(withHandler({ methods: ['GET'], handler }));
