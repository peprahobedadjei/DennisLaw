import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout'
import EmptyChat from '../components/Empty'
import Chat from '../components/Chat'
import Head from 'next/head';

const Index = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <Layout>
                  <Head>
        <title>Home</title>
      </Head>
      <EmptyChat/>
    </Layout>
  );
};

Index.auth = true;

export default Index;

