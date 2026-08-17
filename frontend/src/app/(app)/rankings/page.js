'use client';
import { useState } from 'react';
import Card from '@/components/ui/Card';
import Tabs from '@/components/ui/Tabs';

export default function RankingsPage() {
  const [activeTab, setActiveTab] = useState('attendance');
  
  const tabs = [
    { id: 'attendance', label: 'Attendance' },
    { id: 'strength', label: 'Strength' }
  ];

  const rankings = [
    { rank: 1, name: 'Alex M.', score: '24 days', isMe: false },
    { rank: 2, name: 'Sarah K.', score: '22 days', isMe: false },
    { rank: 3, name: 'You', score: '18 days', isMe: true },
    { rank: 4, name: 'John D.', score: '15 days', isMe: false },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Leaderboards</h2>
      
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      
      <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
        {rankings.map(user => (
          <Card key={user.rank} style={{ 
            display: 'flex', alignItems: 'center', padding: '1rem',
            border: user.isMe ? '1px solid var(--color-accent)' : 'none'
          }}>
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '50%', 
              backgroundColor: user.rank <= 3 ? 'var(--color-secondary)' : 'var(--color-surface-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 'bold', marginRight: '1rem'
            }}>
              {user.rank}
            </div>
            <div style={{ flex: 1, fontWeight: user.isMe ? 'bold' : 'normal' }}>
              {user.name}
            </div>
            <div style={{ fontWeight: 'bold', color: 'var(--color-accent)' }}>
              {user.score}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
