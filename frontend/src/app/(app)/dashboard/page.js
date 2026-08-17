'use client';
import { useAuth } from '@/lib/auth';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="container animate-slide-up">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Welcome back,</h1>
          <h2 style={{ fontSize: '2rem', color: 'var(--color-accent)', margin: 0 }}>{user?.name || 'Athlete'}</h2>
        </div>
        <div style={{
          backgroundColor: 'var(--color-surface)',
          padding: '0.5rem 1rem',
          borderRadius: 'var(--border-radius-pill)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ color: 'var(--color-secondary)', fontWeight: 'bold' }}>🔥 5</span>
          <span style={{ fontSize: '0.875rem' }}>Day Streak</span>
        </div>
      </header>

      <section style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--color-accent)' }}>
          <h3 style={{ color: 'var(--color-accent)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🤖 AI Coach Tip
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Based on your last workout, consider increasing your rest time between heavy compound sets to 3 minutes for optimal recovery.
          </p>
        </div>
      </section>

      <section>
        <button style={{
          width: '100%',
          backgroundColor: 'var(--color-accent)',
          color: '#000',
          padding: '1.25rem',
          borderRadius: 'var(--border-radius-card)',
          fontWeight: 'bold',
          fontSize: '1.25rem',
          boxShadow: '0 4px 12px rgba(0,230,118,0.3)',
          marginBottom: '2rem',
          minHeight: '48px'
        }}>
          START WORKOUT
        </button>
      </section>
      
      <section>
        <h3 style={{ marginBottom: '1rem' }}>Recent Activity</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong style={{ fontSize: '1.1rem' }}>Push Day (Hypertrophy)</strong>
              <span style={{ color: 'var(--color-text-muted)' }}>Yesterday</span>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>14 sets • 45 min • 12,450 kg</p>
          </div>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong style={{ fontSize: '1.1rem' }}>Pull Day</strong>
              <span style={{ color: 'var(--color-text-muted)' }}>3 days ago</span>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>16 sets • 55 min • 14,200 kg</p>
          </div>
        </div>
      </section>
    </div>
  );
}
