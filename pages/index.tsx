import { Comment, User } from '@prisma/client';
import type { GetStaticProps, NextPage } from 'next';
import Layout from '../components/layouts/layout';
import PostCard from '../components/ui/post-card';
import client from '../lib/server/client';
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

const Home: NextPage<{ posts: Post[] }> = ({ posts }) => {
  return (
    <Layout>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <main className={styles.main}>
            <div className={styles.posts}>
              {posts.map((post, index) => (
                <PostCard
                  key={index}
                  id={post.id}
                  userId={post.user.id}
                  title={post.title}
                  subTitle={post.subTitle}
                  name={post.user.name}
                  createdAt={post.createdAt}
                  likes={post.likes}
                  commentCount={post.comments.length}
                  profileImage={post.user.profileImage}
                />
              ))}
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async (ctx) => {
  try {
    const posts = await client.post.findMany({
      select: {
        user: { select: { id: true, name: true, profileImage: true } },
        id: true,
        createdAt: true,
        title: true,
        subTitle: true,
        comments: true,
        likes: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    console.log(posts);
    return {
      props: { posts: JSON.parse(JSON.stringify(posts)) },
    };
  } catch (error) {
    console.log('catch:', error);
    return {
      props: {
        posts: [
          {
            user: 'abc',
            createdAt: '2022-07-05',
            title: '뭐하냐',
            subTitle: '뭐긴뭐야',
            comments: [1, 2, 3],
            likes: 5,
          },
        ],
      },
    };
  }
};
