import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null);
  const router = useRouter();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  useEffect(() => {
    const fetchHistory = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        try {
          const response = await axios.post('https://dennislaw-xr6xja66ya-uk.a.run.app/get_history', { user_id: user.user_id });
          if (response.data.success) {
            setHistory(response.data.history);
            const currentChatId = router.query.chatId;
            if (currentChatId) {
              setActiveChat(currentChatId);
            }
          }
        } catch (error) {
          console.error('Error fetching history:', error);
        }
      }
      setLoading(false);
    };
    fetchHistory();
  }, [router.query.chatId]);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className={`fixed inset-0 z-30 transition-transform transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:w-64 bg-white text-white`}>
        <div className="flex-1 overflow-y-auto pt-20 p-4 text-black">
          <h2 className="text-lg font-semibold mb-4">History</h2>
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-800"></div>
            </div>
          ) : (
            <ul>
              {history.map((chat, index) => (
                <li
                  key={chat.chat_id}
                  className={`py-2 cursor-pointer ${
                    activeChat === chat.chat_id ? 'font-bold text-blue-500' : ''
                  }`}
                >
                  <Link
                    href={`/chat?chatId=${chat.chat_id}`}
                    onClick={() => setActiveChat(chat.chat_id)}
                  >
                    Chat {index + 1}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="fixed bottom-0 left-0 w-full p-4 bg-gray-100 border-t border-gray-100 text-black">
          <ul>
            <li className={`py-2 cursor-pointer ${router.pathname === '/' ? 'font-bold' : ''}`}>
              <Link
                className={` ${router.pathname === '/' ? 'text-blue-500' : ''}`}
                href="/">New Chat</Link>
            </li>
            <li className={`py-2 cursor-pointer ${router.pathname === '/profile' ? 'font-bold' : ''}`}>
              <Link
                className={`${router.pathname === '/profile' ? 'text-blue-500' : ''}`}
                href="/profile">Profile</Link>
            </li>
            <li className="py-2 cursor-pointer" onClick={handleLogout}>Log Out</li>
          </ul>
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-4 border-gray-200 bg-white">
          <button className="md:hidden" onClick={toggleSidebar}>
            ☰
          </button>
          <h1 className="text-xl font-semibold">Dennis Law</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-4 bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}