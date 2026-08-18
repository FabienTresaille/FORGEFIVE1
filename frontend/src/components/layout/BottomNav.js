'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const icons = {
  dashboard: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  workout: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m14.4 14.4 5.6 5.6"/><path d="M2 22 22 2"/><path d="m4.8 4.8 14.4 14.4"/><path d="M8.2 8.2 2 14.4"/><path d="M15.8 15.8 22 9.6"/></svg>,
  feed: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  recovery: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
  coach: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
};

export default function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { name: 'Accueil', path: '/dashboard', icon: icons.dashboard },
    { name: 'Séance', path: '/workout', icon: icons.workout },
    { name: 'Activité', path: '/feed', icon: icons.feed },
    { name: 'Récup', path: '/recovery', icon: icons.recovery },
    { name: 'Coach', path: '/coach', icon: icons.coach },
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: 'var(--nav-height)',
      background: 'var(--color-surface)',
      borderTop: '1px solid var(--color-border)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 1000,
      paddingBottom: 'env(safe-area-inset-bottom)'
    }}>
      {tabs.map((tab) => {
        const isActive = pathname && pathname.startsWith(tab.path);
        return (
          <Link key={tab.path} href={tab.path} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
            textDecoration: 'none',
            fontSize: '12px',
            fontWeight: 500,
            transition: 'color 0.2s'
          }}>
            {tab.icon}
            <span>{tab.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
