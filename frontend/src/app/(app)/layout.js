'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/layout/BottomNav';
import { api } from '@/lib/api';

function AuthProvider({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      try {
        await api.auth.me();
        setLoading(false);
      } catch (err) {
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  if (loading) {
    return <div className="page container flex items-center justify-center">Chargement...</div>;
  }

  return children;
}

export default function AppLayout({ children }) {
  return (
    <AuthProvider>
      <div style={{ paddingBottom: 'calc(var(--nav-height) + env(safe-area-inset-bottom))' }}>
        {children}
      </div>
      <BottomNav />
    </AuthProvider>
  );
}
