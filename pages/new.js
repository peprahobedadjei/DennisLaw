import Layout from '../components/Layout';
import Empty from '../components/Empty';
import Head from 'next/head';
export default function New() {
  return (
    <Layout>
      <Head>
        <title>New Chat</title>
      </Head>
      <Empty />
    </Layout>
  );
}
