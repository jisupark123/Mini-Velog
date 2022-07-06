import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect } from 'react';
import Layout from '../components/layouts/layout';
import useUser from '../lib/client/useUser';
import styles from '../styles/Home.module.scss';

const Home: NextPage = () => {
  const { user } = useUser();
  useEffect(() => {
    console.log(user);
  }, [user]);
  return (
    <Layout>
      <div></div>
    </Layout>
  );
};

export default Home;
