import { Post } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import withHandler, { ResponseType } from '../../../lib/server/withHandler';
import client from '../../../lib/server/client';
import { withApiSession } from '../../../lib/server/withSession';

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
          select: { id: true, name: true, avatar: true, posts: true },
        },
        tags: true,
        images: true,
        comments: true,
      },
    });
    return res.json({ ok: true, post });
  }

  // 게시물 수정
  if (req.method === 'POST') {
    const {
      body: {
        title,
        subTitle,
        tags,
        contents,
        images,
        showLikes,
        allowComments,
      },
      session: { user },
    } = req;

    const post = await client.post.update({
      where: { id: +postId },
      data: {
        title,
        subTitle,
        contents,
        tags: {
          deleteMany: {},
          create: tags.map((tag: string) => ({
            tag: tag,
          })),
        },
        images: {
          deleteMany: {},
          create: images.map((imageId: string) => ({
            imageId,
          })),
        },
        showLikes,
        allowComments,
      },
    });
    return res.json({ ok: true, postId: post.id });
  }

  if (req.method === 'DELETE') {
    await client.post.delete({
      where: { id: +postId },
    });
    return res.json({ ok: true });
  }
};

export default withApiSession(
  withHandler({
    methods: ['GET', 'POST', 'DELETE'],
    privateMethods: ['POST', 'DELETE'],
    handler,
  })
);
