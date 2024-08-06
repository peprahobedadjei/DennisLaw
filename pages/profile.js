import { useEffect, useState } from 'react';
import Layout from "../components/Layout";
import Head from 'next/head';

export default function Profile() {
  const [user, setUser] = useState({ username: '', full_name: '' });

  useEffect(() => {
    // Retrieve user details from local storage (or any other storage method)
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-full text-center">
      <Head>
        <title>Profile</title>
      </Head>
        <h2 className="text-2xl font-bold mb-4">User Profile</h2>
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <div className="mb-4 text-left">
            <label className="block text-sm font-semibold mb-1">Full Name</label>
            <input
              type="text"
              value={user.full_name}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
            />
          </div>
          <div className="text-left">
            <label className="block text-sm font-semibold mb-1">Username</label>
            <input
              type="text"
              value={user.username}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
