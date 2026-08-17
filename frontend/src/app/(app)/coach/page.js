'use client';
import { useState } from 'react';
import ChatBubble from '@/components/chat/ChatBubble';
import ChatInput from '@/components/chat/ChatInput';
import Button from '@/components/ui/Button';

export default function CoachPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hi! I am your ForgeFive AI Coach. How can I help you today?' },
    { id: 2, sender: 'user', text: 'I feel my bench press is stuck.' },
    { id: 3, sender: 'ai', text: 'Let\'s analyze your recent volume. You might want to switch to a 5x5 rep scheme to build more strength.' }
  ]);

  const handleSend = (text) => {
    setMessages([...messages, { id: Date.now(), sender: 'user', text }]);
    // Simulate AI response
    setTimeout(() => {
      setMessages(m => [...m, { id: Date.now(), sender: 'ai', text: 'That sounds like a good plan. Make sure to rest well!' }]);
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 150px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0 }}>AI Coach</h2>
        <Button variant="secondary" style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.75rem' }}>
          Analyze Last Workout
        </Button>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0' }}>
        {messages.map(msg => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
      </div>
      
      <ChatInput onSend={handleSend} />
    </div>
  );
}
