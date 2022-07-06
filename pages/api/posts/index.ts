import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../lib/server/client';
import withHandler from '../../../lib/server/withHandler';
import { withApiSession } from '../../../lib/server/withSession';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  if (method === 'POST') {
    // const { user } = req.session;
    const { title, contents } = req.body;
    console.log(req.session.user?.id);
    // const post = await client.post.create({
    //   data: {
    //     // userId:user?.id,
    //     title,
    //     contents,
    //   },
    // });
    // console.log(post);
  }
};

export default withApiSession(withHandler({ methods: ['POST'], handler }));
