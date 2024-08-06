import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import Head from 'next/head';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('https://dennislaw-xr6xja66ya-uk.a.run.app/login', { username: email, password });
      console.log(response)
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setLoading(false);
      router.push('/');
    } catch (err) {
      setLoading(false);
      setError('Invalid username or password');
    }
  };

  return (
    <div className='mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8'>
                  <Head>
        <title>Login</title>
      </Head>
      <div className='mx-auto max-w-lg'>
        <h1 className='text-center text-2xl font-bold text-blue-800 sm:text-3xl'>
          Welcome
        </h1>

        <form
          onSubmit={handleSubmit}
          className='mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8'
        >
          <p className='text-center text-lg font-medium'>
            Login into to your account
          </p>

          {error && <p className='text-center text-red-500'>{error}</p>}

          <div>
            <label htmlFor='Username' className='sr-only'>
              Username
            </label>
            <div className='relative'>
              <input
                type='text'
                className='w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm'
                placeholder='Enter username'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor='password' className='sr-only'>
              Password
            </label>

            <div className='relative'>
              <input
                type='password'
                className='w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm'
                placeholder='Enter password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type='submit'
            className='block w-full rounded-lg bg-blue-800 px-5 py-3 text-sm font-medium text-white'
            disabled={loading}
          >
            {loading ? (
              <div className='text-sm'>
                Authenticating ..
              </div> // Add your loader/spinner component here
            ) : (
              'Sign in'
            )}
          </button>

          <p className='text-center text-sm text-gray-500'>
            No account?{' '}
            <Link className='underline' href='/signup'>
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
