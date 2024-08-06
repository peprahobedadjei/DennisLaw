import '../styles/globals.css'
import Layout from '../components/Layout'
import ProtectedRoute from '../components/ProtectedRoute'
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isProtectedRoute = Component.auth;

  return isProtectedRoute ? (
    <ProtectedRoute>
      <Component {...pageProps} />
    </ProtectedRoute>
  ) : (
    <Component {...pageProps} />

  );
}

export default MyApp
