import { NextApiRequest, NextApiResponse } from 'next';
import { getUserIdFromSession } from '../../../lib/secret/createSession';
import client from '../../../lib/server/client';
import withHandler from '../../../lib/server/withHandler';
import { withApiSession } from '../../../lib/server/withSession';

interface PostRequestBody {
  body: {
    title: string;
    subTitle: string;
    tags: string[];
    contents: string;
    images: string[];
    showLikes: boolean;
    allowComments: boolean;
  };
  session: {
    user?: {
      id: string;
    };
  };
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
    }: PostRequestBody = req;

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
          create: tags.map((tag) => ({
            name: tag,
          })),
        },
        images: {
          create: images.map((url) => ({
            url,
          })),
        },
        showLikes,
        allowComments,
      },
    });
    return res.json({ ok: true });
  }
  if (req.method === 'GET') {
    const posts = await client.post.findMany({
      select: {
        user: { select: { name: true, profileImage: true } },
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
  }
};

export default withApiSession(
  withHandler({ methods: ['GET', 'POST'], privateMethods: ['POST'], handler })
);
