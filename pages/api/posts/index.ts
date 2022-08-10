import { Post, User } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserIdFromSession } from '../../../lib/secret/createSession';
import client from '../../../lib/server/client';
import withHandler, { ResponseType } from '../../../lib/server/withHandler';
import { withApiSession } from '../../../lib/server/withSession';

interface WithPost extends Post {
  user: User;
  comments: Comment[];
}

export interface GetPostsResponse extends ResponseType {
  ok: boolean;
  posts: WithPost[];
}

export interface UploadPost {
  title: string;
  subTitle: string;
  tags: string[];
  contents: string;
  images: string[];
  showLikes: boolean;
  allowComments: boolean;
}

export interface PostRequestBody {
  body: UploadPost;
  session: {
    user?: {
      id: number;
    };
  };
}

export interface PostUploadResponse extends ResponseType {
  postId: number;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
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

    const post = await client.post.create({
      data: {
        user: {
          connect: {
            id: getUserIdFromSession(user!.id),
          },
        },
        title,
        subTitle,
        contents,
        tags: {
          create: tags.map((tag: string) => ({
            tag: tag,
          })),
        },
        images: {
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
  if (req.method === 'GET') {
    const posts = await client.post.findMany({
      select: {
        user: {
          select: { id: true, name: true, nickname: true, avatar: true },
        },
        id: true,
        createdAt: true,
        title: true,
        subTitle: true,
        comments: true,
        likes: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return res.json({ ok: true, posts });
  }
};

export default withApiSession(
  withHandler({ methods: ['GET', 'POST'], privateMethods: ['POST'], handler })
);
