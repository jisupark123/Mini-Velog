import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';

interface IPostDetailProps {
  params: string;
}

const postDetail = (props: IPostDetailProps) => {
  console.log(props.params);
  return <h1>HI</h1>;
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    fallback: 'blocking',
    paths: [{ params: { userId: 'a', postId: '124' } }],
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  console.log(ctx);
  return {
    props: { params: { postId: ctx.params!.postId } },
  };
};

export default postDetail;
