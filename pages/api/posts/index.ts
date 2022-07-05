import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../lib/server/client';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  if (method === 'POST') {
    const { user } = req.session;
    const { title, contents } = req.body;
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

export default handler;
