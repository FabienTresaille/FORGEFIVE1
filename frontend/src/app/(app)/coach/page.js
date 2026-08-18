'use client';
import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';

export default function CoachPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [convId, setConvId] = useState(null);
  const endRef = useRef(null);

  useEffect(() => {
    async function loadConv() {
      try {
        const convs = await api.coach.getConversations();
        if (convs && convs.length > 0) {
          setConvId(convs[0].id);
          setMessages(convs[0].messages || []);
        } else {
          setMessages([{ role: 'ai', content: 'Bonjour ! Je suis votre coach IA. Comment puis-je vous aider aujourd\'hui ?' }]);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadConv();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await api.coach.chat(userMsg, convId);
      setMessages(prev => [...prev, { role: 'ai', content: response.message }]);
      if (response.conversation_id && !convId) {
        setConvId(response.conversation_id);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'ai', content: 'Désolé, une erreur est survenue.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = () => {
    setInput('Peux-tu analyser ma dernière séance ?');
    setTimeout(handleSend, 100);
  };

  return (
    <div className="container page flex-col fade-in" style={{ height: '100dvh', paddingBottom: '0' }}>
      <header className="mb-md" style={{ flexShrink: 0, marginTop: '16px' }}>
        <h1 className="text-xl">Coach IA</h1>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '80px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="flex justify-center mb-md">
          <button className="btn btn-secondary text-sm" onClick={handleAnalyze}>
            📊 Analyser ma dernière séance
          </button>
        </div>

        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '80%',
              padding: '12px 16px',
              borderRadius: '16px',
              borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
              borderBottomLeftRadius: msg.role === 'ai' ? '4px' : '16px',
              backgroundColor: msg.role === 'user' ? 'var(--color-accent)' : 'var(--color-surface)',
              color: msg.role === 'user' ? 'var(--color-text-inverse)' : 'var(--color-text)',
              fontSize: '0.95rem'
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '12px 16px',
              borderRadius: '16px',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)'
            }}>
              <span className="text-muted">Le coach réfléchit...</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div style={{ position: 'fixed', bottom: 'var(--nav-height)', left: 0, right: 0, padding: '16px', backgroundColor: 'var(--color-bg)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container flex gap-sm" style={{ padding: 0 }}>
          <input 
            type="text" 
            placeholder="Posez votre question..." 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            style={{ borderRadius: '24px', paddingLeft: '20px' }}
          />
          <button 
            className="btn btn-primary btn-icon" 
            onClick={handleSend}
            disabled={loading || !input.trim()}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
