import { Comment, Post, User } from '@prisma/client';
import {
  GetServerSideProps,
  GetStaticPaths,
  GetStaticProps,
  NextPage,
} from 'next';

import { useRouter } from 'next/router';
import Layout from '../../../components/layouts/layout';
import MypageHeader from '../../../components/layouts/mypage-header';
import client from '../../../lib/server/client';
import styles from './dashboard.module.scss';

interface WithUser extends User {
  posts: Post[];
  comments: Comment[];
}

interface DashboardProps {
  user: WithUser;
}

const Dashboard: NextPage<DashboardProps> = ({ user }) => {
  return (
    <Layout>
      <MypageHeader
        user={user}
        postNumber={user.posts.length}
        tabName={'Dashboard'}
      />
      <main className={styles['page-content']}>
        <div className={styles.container}>
          <section className={styles['section-box']}>
            <div className={styles.split}>
              <h4>등급</h4>
              <div className={styles['user-rank']}>새싹</div>
            </div>
            <div className={styles.split}>
              <h4>포스트</h4>
              <div className={styles['user-posts']}>
                {`${user.posts.length}개`}
              </div>
            </div>
            <div className={styles.split}>
              <h4>댓글</h4>
              <div className={styles['user-comments']}>
                {`${user.comments.length}개`}
              </div>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
};

export default Dashboard;

export const getStaticPaths: GetStaticPaths = async () => {
  const users = await client.user.findMany({ select: { id: true } });

  return {
    fallback: 'blocking',
    paths: users.map((user) => ({
      params: { id: user.id.toString() },
    })),
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const user = await client.user.findUnique({
    where: { id: Number(ctx.params!.id) },
    select: {
      posts: true,
      comments: true,
      id: true,
      name: true,
      createdAt: true,
      loggedFrom: true,
      avatar: true,
      introduction: true,
    },
  });
  return {
    props: { user: JSON.parse(JSON.stringify(user)) },
    revalidate: 3, // 3초
  };
};

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const user = await client.user.findUnique({
//     where: { id: Number(ctx.params!.id) },
//     select: {
//       posts: true,
//       comments: true,
//       id: true,
//       name: true,
//       createdAt: true,
//       loggedFrom: true,
//       avatar: true,
//       introduction: true,
//     },
//   });
//   return {
//     props: { user: JSON.parse(JSON.stringify(user)) },
//   };
// };
