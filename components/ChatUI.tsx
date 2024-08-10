'use client'
import { useState, useRef, useEffect } from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { sendRequest } from '@/services/api';
import { Spinner } from '@radix-ui/themes';

export interface textObj{
  role: "user" | "assistant"
  content: string
}

const ChatUI = () => {
  const [messages, setMessages] = useState<textObj[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    try{
      setLoading(true)
      if (input.trim()) {
        const updatedMessages : textObj[] = [...messages, {role: "user", content: input}]
        setMessages(updatedMessages)
        setInput('');
        //send request to chatbot api here and then return the message
        const respond : textObj = await sendRequest(updatedMessages)
        setMessages(prev => [...prev, { content: `${respond.content}`, role: 'assistant' }]);
      }

    }
    catch(err){
      console.error(err)
      throw err
    }
    finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTo(0, scrollViewportRef.current.scrollHeight);
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto">
      <ScrollArea.Root className="flex-grow">
        <ScrollArea.Viewport ref={scrollViewportRef} className="h-full w-full">
          <div className="p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-lg max-w-xs ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
      <Spinner size="3" loading={loading}/>
      {/* {loading && <p>Loading is setted to true</p>} */}
      <div className="p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;