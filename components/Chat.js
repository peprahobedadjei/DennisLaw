import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);
  const router = useRouter();
  const { chatId } = router.query;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const { initialMessage, initialResponse } = router.query;
    if (initialMessage && initialResponse) {
      const parsedResponse = JSON.parse(initialResponse);
      setMessages([
        { sender: 'human', text: initialMessage },
        { sender: 'ai', text: parsedResponse[1].ai },
      ]);
      router.replace('/chat', undefined, { shallow: true });
    } else if (chatId && user) {
      fetchChat(chatId);
    }
  }, [router.query, chatId, user]);

  const fetchChat = async (id) => {
    if (!user) return;
    try {
      const response = await axios.post('https://dennislaw-xr6xja66ya-uk.a.run.app/get_chat', {
        user_id: user.user_id,
        chat_id: id,
      });
      if (response.data.success) {
        setMessages(response.data.conversation);
      }
    } catch (error) {
      console.error('Error fetching chat:', error);
    }
  };

  const handleSend = async () => {
    if (input.trim() && user) {
      const newMessage = { sender: 'human', text: input };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInput('');
      setIsTyping(true);

      try {
        const response = await axios.post('https://dennislaw-xr6xja66ya-uk.a.run.app/query', { query: input });
        const aiResponse = response.data.find((msg) => msg.ai)?.ai || 'No response from AI.';
        const aiMessage = { sender: 'ai', text: aiResponse };

        setMessages((prevMessages) => [...prevMessages, aiMessage]);
        setIsTyping(false);

        await axios.post('https://dennislaw-xr6xja66ya-uk.a.run.app/update_history', {
          user_id: user.user_id,
          chat_id: chatId,
          message: newMessage,
        });

        await axios.post('https://dennislaw-xr6xja66ya-uk.a.run.app/update_history', {
          user_id: user.user_id,
          chat_id: chatId,
          message: aiMessage,
        });
      } catch (error) {
        console.error('Error querying the backend:', error);
        setIsTyping(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!user) {
    return <div>Loading...</div>; // Or redirect to login page
  }

  return (

    <div className='mx-auto flex h-full flex-col lg:w-3/4'>
      <div className='flex-1 space-y-4 overflow-y-auto p-4'>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === 'human' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'human' ? (
              <div className='flex items-end space-x-2'>
                <div className='rounded-lg bg-gray-200 p-4 text-sm text-black'>
                  {message.text}
                </div>
              </div>
            ) : (
              <div className='flex items-end space-x-2'>
                <Image
                  src='/ailogo.png'
                  width={40}
                  height={40}
                  alt='AI Avatar'
                  className='h-10 w-10 rounded-full border-2 border-gray-100 bg-white'
                />
                <div className='rounded-lg bg-blue-100 p-4 text-sm text-black'>
                  {message.text}
                </div>
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className='flex justify-start space-x-2'>
            <Image
              src='/ailogo.png'
              width={40}
              height={40}
              alt='AI Avatar'
              className='h-10 w-10 rounded-full border-2 border-gray-100 bg-white'
            />
            <div className='rounded-lg p-4 text-sm text-black'>Typing...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className='border-t border-gray-200 p-4'>
        <div className='flex space-x-2'>
          <input
            type='text'
            className='flex-grow rounded-lg border border-gray-300 px-2 py-3'
            placeholder='Type your message...'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={handleSend}
            className='rounded-lg bg-blue-500 px-4 py-2 text-white'
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}