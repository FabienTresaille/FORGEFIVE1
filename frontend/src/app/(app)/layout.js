'use client';
import BottomNav from '@/components/layout/BottomNav';
import { useAuth } from '@/lib/auth';

export default function AppLayout({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="page container flex items-center justify-center" style={{ minHeight: '100dvh' }}>
        <div style={{ color: 'var(--color-accent)', fontWeight: 600 }}>Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <div style={{ paddingBottom: 'calc(var(--nav-height) + env(safe-area-inset-bottom) + 16px)' }}>
        {children}
      </div>
      <BottomNav />
    </>
  );
}
