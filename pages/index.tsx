import { Comment, User } from '@prisma/client';
import type { GetServerSideProps, GetStaticProps, NextPage } from 'next';
import { useEffect } from 'react';
import useSWR from 'swr';
import Layout from '../components/layouts/layout';
import PostCard from '../components/ui/post-card';
import client from '../lib/server/client';
import { GetPostsResponse } from './api/posts';
import styles from './index.module.scss';

interface Post {
  id: number;
  user: User;
  createdAt: Date;
  title: string;
  subTitle: string;
  comments: Comment[];
  likes: number;
}
// <{ posts: Post[] }>
const Home: NextPage = () => {
  const { data, error, mutate } = useSWR<GetPostsResponse>('/api/posts');
  useEffect(() => {
    mutate();
  }, [mutate]);

  return (
    <Layout>
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.posts}>
            {data?.posts &&
              data.posts.map((post, index) => (
                <PostCard
                  key={index}
                  id={post.id}
                  userId={post.user.id}
                  title={post.title}
                  subTitle={post.subTitle}
                  nickname={post.user.nickname || post.user.name}
                  createdAt={post.createdAt}
                  likes={post.likes}
                  commentCount={post.comments.length}
                  avatar={post.user.avatar || ''}
                />
              ))}
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default Home;

// export const getStaticProps: GetStaticProps = async (ctx) => {
//   try {
//     const posts = await client.post.findMany({
//       select: {
//         user: {
//           select: { id: true, name: true, nickname: true, avatar: true },
//         },
//         id: true,
//         createdAt: true,
//         title: true,
//         subTitle: true,
//         comments: true,
//         likes: true,
//       },
//       orderBy: {
//         createdAt: 'desc',
//       },
//     });
//     return {
//       props: { posts: JSON.parse(JSON.stringify(posts)) },
//       revalidate: 3, // 3초마다 변경
//     };
//   } catch (error) {
//     console.log('catch:', error);
//     return {
//       props: {
//         posts: [
//           {
//             user: 'abc',
//             createdAt: '2022-07-05',
//             title: '뭐하냐',
//             subTitle: '뭐긴뭐야',
//             comments: [1, 2, 3],
//             likes: 5,
//           },
//         ],
//       },
//     };
//   }
// };

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   try {
//     const posts = await client.post.findMany({
//       select: {
//         user: {
//           select: { id: true, name: true, nickname: true, avatar: true },
//         },
//         id: true,
//         createdAt: true,
//         title: true,
//         subTitle: true,
//         comments: true,
//         likes: true,
//       },
//       orderBy: {
//         createdAt: 'desc',
//       },
//     });
//     return {
//       props: { posts: JSON.parse(JSON.stringify(posts)) },
//     };
//   } catch (error) {
//     console.log('catch:', error);
//     return {
//       props: {
//         posts: [
//           {
//             user: 'abc',
//             createdAt: '2022-07-05',
//             title: '뭐하냐',
//             subTitle: '뭐긴뭐야',
//             comments: [1, 2, 3],
//             likes: 5,
//           },
//         ],
//       },
//     };
//   }
// };
