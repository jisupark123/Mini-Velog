import { NextApiRequest, NextApiResponse } from 'next';
import { getKakaoIdFromSession } from '../../../lib/secret/createSession';
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
            kakaoId: getKakaoIdFromSession(user!.id),
          },
        },
        title,
        subTitle,
        contents,
        tags: {
          create: tags.map((tag) => ({
            tag,
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
};

export default withApiSession(
  withHandler({ methods: ['POST'], privateMethods: ['POST'], handler })
);
