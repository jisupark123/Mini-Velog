import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '../../lib/server/withHandler';

export interface ImageResponse extends ResponseType {
  uploadURL: string;
}
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ID}/images/v2/direct_upload`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.CF_IMAGE_TOKEN}`,
      },
    }
  ).then((res) => res.json());
  const {
    result: { uploadURL },
  } = response;
  console.log(uploadURL);
  return res.json({ ok: true, uploadURL });
}

export default withHandler({ methods: ['GET'], handler });
