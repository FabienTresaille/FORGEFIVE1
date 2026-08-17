'use client';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft, Bell, Settings } from 'lucide-react';

export default function TopBar({ title, showBack = false }) {
  const router = useRouter();
  
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem',
      backgroundColor: 'var(--color-surface)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: 'var(--shadow-main)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', width: '33%' }}>
        {showBack && (
          <button onClick={() => router.back()} style={{ padding: '0.5rem' }}>
            <ArrowLeft size={24} />
          </button>
        )}
      </div>
      <h1 style={{ fontSize: '1.2rem', margin: 0, width: '34%', textAlign: 'center' }}>
        {title || 'ForgeFive'}
      </h1>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '33%', gap: '1rem' }}>
        <button style={{ padding: '0.5rem' }}><Bell size={20} /></button>
        <button style={{ padding: '0.5rem' }}><Settings size={20} /></button>
      </div>
    </header>
  );
}
