import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '../../../lib/server/withHandler';
import { withApiSession } from '../../../lib/server/withSession';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  req.session.destroy();
  await req.session.save();
  return res.redirect('/');
}

export default withApiSession(withHandler({ methods: ['GET'], handler }));
