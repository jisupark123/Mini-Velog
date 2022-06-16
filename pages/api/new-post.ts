import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  if (method == 'POST') {
    const { title, contents } = req.body;
    await dbConnect();
  }
};

export default handler;
