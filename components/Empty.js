import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function EmptyChat() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // Redirect to login if user is not found
        router.push('/login');
      }
    }
  }, [router]);

  const handleSend = async () => {
    if (message.trim() && user) {
      setIsLoading(true);
      try {
        const response = await axios.post('https://dennislaw-xr6xja66ya-uk.a.run.app/query', { query: message });
        const initialResponse = response.data.find(msg => msg.ai)?.ai || 'No response from AI.';

        const initChatResponse = await axios.post('https://dennislaw-xr6xja66ya-uk.a.run.app/init_chat', {
          user_id: user.user_id,
          initial_message: message,
          initial_response: initialResponse
        });

        if (initChatResponse.data.success) {
          router.push({
            pathname: '/chat',
            query: {
              chatId: initChatResponse.data.chat_id
            }
          });
        }
      } catch (error) {
        console.error('Error querying the backend:', error);
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className='flex h-full flex-col items-center justify-center text-center relative'>
      {!isLoading ? (
        <>
          <h1 className='mb-4 text-3xl font-bold'>Chat with DennisAI</h1>
          <p className='mx-auto mb-8 max-w-2xl text-lg'>
            Hi there! I am Dennis AI. I help you find your answers faster from our
            databases of reported cases, criminal cases, etc.
            How may I assist you today?
          </p>
          <div className="w-full max-w-md mx-auto flex space-x-2">
            <input
              type="text"
              className="flex-grow rounded-lg border-gray-300 p-4 shadow-sm"
              placeholder="Message Dennis AI"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={handleSend}
              className="px-5 py-3 bg-blue-800 text-white text-sm font-medium rounded-lg"
            >
              Send
            </button>
          </div>
          <p className="text-sm mt-4 max-w-2xl mx-auto text-gray-400">
            Or continue from your History
          </p>
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <div className="animate-spin rounded-full h-28 w-28 border-t-2 border-b-2 border-blue-800"></div>
        </div>
      )}
    </div>
  );
}
