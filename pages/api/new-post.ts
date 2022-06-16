import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  if (method == 'POST') {
    const { title, contents } = req.body;
  }
};

export default handler;
