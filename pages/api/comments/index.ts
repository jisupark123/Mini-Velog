import { Comment, User } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserIdFromSession } from '../../../lib/secret/createSession';
import client from '../../../lib/server/client';
import withHandler, { ResponseType } from '../../../lib/server/withHandler';
import { withApiSession } from '../../../lib/server/withSession';

export interface CommentWithUser extends Comment {
  user: User;
}

export interface PostCommentResponse extends ResponseType {
  newComment?: CommentWithUser;
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
    body: { postId, comment },
  } = req;
  const userId = getUserIdFromSession(user!.id);

  const newComment = await client.comment.create({
    data: {
      user: {
        connect: { id: userId },
      },
      post: {
        connect: { id: +postId },
      },
      comment,
    },
    include: {
      user: { select: { id: true, name: true, profileImage: true } },
    },
  });
  return res.json({ ok: true, newComment });
}

export default withApiSession(withHandler({ methods: ['POST'], handler }));
