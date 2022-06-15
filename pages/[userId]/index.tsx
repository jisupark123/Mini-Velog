import { GetStaticPaths, GetStaticProps } from 'next';

interface IUserDetailProps {
  userId: string;
}

const userDetail = (props: IUserDetailProps) => {
  return;
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    fallback: 'blocking',
    paths: [{ params: { userId: 'a' } }],
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  return {
    props: { userId: ctx.params!.userId },
  };
};

export default userDetail;
