import { IronSessionOptions } from 'iron-session';
import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: string;
    };
  }
}

const cookieConfig: IronSessionOptions = {
  cookieName: 'mini-insta-session',
  password: process.env.COOKIE_PASSWORD!,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 2, // 이틀,
    httpOnly: true,
  },
};

export function withApiSession(fn: any) {
  return withIronSessionApiRoute(fn, cookieConfig);
}

export function withSsrSession(handler: any) {
  return withIronSessionSsr(handler, cookieConfig);
}
