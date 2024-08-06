import Layout from '../components/Layout'
import Chat from '../components/Chat'
import Head from 'next/head';
export default function New() {
    return (
      <Layout>
                    <Head>
        <title>Chat</title>
      </Head>
<Chat/>
      </Layout>
    );
  }
  