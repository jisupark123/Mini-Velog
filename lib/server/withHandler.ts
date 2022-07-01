import { NextApiRequest, NextApiResponse } from 'next';
type method = 'GET' | 'POST' | 'DELETE';

interface ConfigType {
  methods: method[];
  handler: (req: NextApiRequest, res: NextApiResponse) => void;
}
/**
 * 회원 전용 페이지인지 확인하고, try,catch 같은 진부한 코드를 처리한다.
 */
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
