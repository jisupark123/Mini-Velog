import { Comment, Post, Tag, User } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserIdFromSession } from '../../../../lib/secret/createSession';
import client from '../../../../lib/server/client';
import withHandler, { ResponseType } from '../../../../lib/server/withHandler';
import { withApiSession } from '../../../../lib/server/withSession';

interface WithPost extends Post {
  tags: Tag[];
  comments: Comment[];
}
interface WithUser extends User {
  posts: WithPost[];
}

export interface PostsResponse extends ResponseType {
  user: WithUser;
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { id } = req.session.user!;
  const userId = getUserIdFromSession(id);
  const user = await client.user.findUnique({
    where: { id: userId },
    select: {
      posts: {
        include: { tags: true, comments: true },
        orderBy: { createdAt: 'desc' },
      },
      id: true,
      name: true,
      createdAt: true,
      loggedFrom: true,
      avatar: true,
      introduction: true,
    },
  });

  return res.json({ ok: true, user });
}

export default withApiSession(withHandler({ methods: ['GET'], handler }));
