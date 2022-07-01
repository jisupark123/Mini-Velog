import { NextApiRequest, NextApiResponse } from 'next';
type method = 'GET' | 'POST' | 'DELETE';

interface ConfigType {
  methods: method[];
  handler: (req: NextApiRequest, res: NextApiResponse) => void;
}
function withHandler({ methods, handler }: ConfigType) {
  return async function (
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<any> {
    // 잘못된 타입의 요청이 들어오면 종료
    if (req.method && !methods.includes(req.method as any)) {
      return res.status(405).end();
    }
    try {
      await handler;
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  };
}

export default withHandler;
