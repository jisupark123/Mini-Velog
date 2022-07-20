import { Post } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../lib/server/client';
import withHandler, { ResponseType } from '../../../../lib/server/withHandler';

export interface PostDetailResponse extends ResponseType {
  post: Post;
}
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { id: postId },
  } = req;
  if (req.method === 'GET') {
    const post = await client.post.findUnique({
      where: { id: +postId },
      include: {
        user: {
          select: { id: true, name: true, profileImage: true, posts: true },
        },
        tags: true,
        images: true,
        comments: true,
      },
    });
    return res.json({ ok: true, post });
  }
  if (req.method === 'DELETE') {
    await client.post.delete({
      where: { id: +postId },
    });
    return res.json({ ok: true });
  }
};

export default withHandler({ methods: ['GET', 'DELETE'], handler });
