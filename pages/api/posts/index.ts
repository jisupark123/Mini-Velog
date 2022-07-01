import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../lib/server/client';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  if (method === 'POST') {
    const { title, contents } = req.body;
    const post = await client.post.create({
      data: {
        title,
        contents,
      },
    });
    console.log(post);
  }
};

export default handler;
