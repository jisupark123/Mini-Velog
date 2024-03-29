import { Comment, Post, Tag, User } from '@prisma/client';
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import Layout from '../../../components/layouts/layout';
import MypageHeader from '../../../components/layouts/mypage-header';
import { getDateDiff } from '../../../lib/client/utils';
import client from '../../../lib/server/client';
import { PostsResponse } from '../../api/users/me/posts';
import styles from './posts.module.scss';

interface WithPost extends Post {
  tags: Tag[];
  comments: Comment[];
}

interface WithUser extends User {
  posts: WithPost[];
}

interface PostsProps {
  user: WithUser;
}

const Posts: React.FC<PostsProps> = () => {
  const { data, error } = useSWR<PostsResponse>('/api/users/me/posts');
  const [user, setUser] = useState<WithUser | null>(null);
  useEffect(() => {
    if (data?.user) {
      setUser(data.user);
    }
  }, [data]);
  return (
    <Layout>
      {user && (
        <>
          <MypageHeader
            user={user}
            postNumber={user.posts.length}
            tabName={'Post'}
          />
          <main className={styles['page-content']}>
            <div className={styles.container}>
              {user.posts.slice(0, 10).map((post) => (
                <section key={post.id} className={styles['post-card']}>
                  <Link href={`/posts/${post.id}`}>
                    <a className={styles.title}>{post.title}</a>
                  </Link>
                  <div className={styles.subTitle}>
                    <p>
                      {post.subTitle}
                      {post.subTitle.length === 150 &&
                      !['.', '?', '!'].includes(
                        post.subTitle[post.subTitle.length - 1]
                      )
                        ? '...'
                        : ''}
                    </p>
                  </div>
                  <div className={styles.wrapper}>
                    <div className={styles.tags}>
                      {post.tags.map((tag) => (
                        <Link key={tag.id} href={'#'}>
                          <a className={styles.tag}>{`#${tag.tag}`}</a>
                        </Link>
                      ))}
                    </div>
                    <div className={styles['sub-info']}>
                      <span>{`${getDateDiff(
                        new Date(),
                        new Date(post.createdAt)
                      )} 전`}</span>
                      <span className={styles.seperator}>&#183;</span>
                      <span>{`댓글 ${post.comments.length}개`}</span>
                    </div>
                  </div>
                </section>
              ))}
            </div>
          </main>
        </>
      )}
    </Layout>
  );
};

export default Posts;

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
      posts: {
        include: { tags: true, comments: true },
        orderBy: { createdAt: 'desc' },
      },
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
//       posts: {
//         include: { tags: true, comments: true },
//         orderBy: { createdAt: 'desc' },
//       },
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
