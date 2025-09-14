import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
// Note: We remove getChatbotResponse as the backend will handle it.
// import { getChatbotResponse } from '../services/geminiService';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { Card, CardContent } from './common/Card';
import { Spinner } from './common/Spinner';

// Use an environment variable for the API base URL.
// This is a placeholder and should be configured in your deployment environment.
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000/api';


const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'init', text: 'Hello! I am your AI Healthcare Assistant. How can I help you today? Remember, I cannot provide medical advice.', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // A new effect to load chat history when the component mounts
  useEffect(() => {
    const fetchHistory = async () => {
        try {
            // TODO: In a real app, you would need to pass authentication (e.g., a JWT token).
            const response = await fetch(`${API_BASE_URL}/chat/history`);
            if (response.ok) {
                const history = await response.json();
                // Prepend history, keeping the initial welcome message at the top.
                if (history.length > 0) {
                    setMessages(prev => [prev[0], ...history]);
                }
            }
        } catch (error) {
            console.error("Could not fetch chat history", error);
        }
    };
    // fetchHistory(); // TODO: Uncomment this when your backend history endpoint is ready.
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // The frontend now sends the message to your backend.
      const response = await fetch(`${API_BASE_URL}/chat/send`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // TODO: In a real app, you'd include an authorization header.
            // 'Authorization': `Bearer ${your_auth_token}`
        },
        body: JSON.stringify({ message: currentInput })
      });
      
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json(); // Expecting { response: "bot's reply" }
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'bot',
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error connecting to the server. Please try again.',
        sender: 'bot',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-[70vh] flex flex-col">
      <CardContent className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex items-end gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {message.sender === 'bot' && (
               <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white flex-shrink-0">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h.5a1.5 1.5 0 010 3h-.5a1 1 0 00-1 1v1.5a1.5 1.5 0 01-3 0V10a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3h.5a1 1 0 001-1V3.5zM8.5 5.5a1.5 1.5 0 11-3 0v-.5a1 1 0 011-1h1.5a1.5 1.5 0 010 3H7a1 1 0 01-1 1v1.5a1.5 1.5 0 11-3 0v-.5a1 1 0 011-1h.5a1.5 1.5 0 010-3h-.5a1 1 0 01-1-1v-1.5a1.5 1.5 0 113 0V5a1 1 0 001 1h.5a1.5 1.5 0 110 3h-.5a1 1 0 00-1 1v.5z"/></svg>
               </div>
            )}
            <div className={`max-w-xs md:max-w-md lg:max-w-2xl px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-slate-200 text-slate-800 rounded-bl-none'
              }`}
            >
              <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{message.text}</p>
            </div>
             {message.sender === 'user' && (
                 <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                 </div>
            )}
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                 <div className="flex items-center space-x-2">
                    <Spinner />
                    <p className="text-sm text-slate-500">Assistant is typing...</p>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      <div className="p-4 border-t bg-white rounded-b-lg">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a health-related question..."
            className="flex-grow"
            disabled={isLoading}
            aria-label="Chat input"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default Chatbot;