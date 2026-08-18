'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';

export default function DashboardPage() {
  const { user } = useAuth();
  const [streak, setStreak] = useState(0);
  const [dailyWorkout, setDailyWorkout] = useState(null);
  const [dailyTip, setDailyTip] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const streakRes = await api.gamification.getStreak().catch(() => null);
        setStreak(streakRes?.current_streak || streakRes?.streak || (typeof streakRes === 'number' ? streakRes : 0));
      } catch (e) { /* silent */ }

      try {
        const workoutRes = await api.coach.getDailyWorkout().catch(() => null);
        setDailyWorkout(workoutRes);
      } catch (e) { /* silent */ }

      try {
        const tipRes = await api.coach.getDailyTip().catch(() => null);
        setDailyTip(tipRes?.tip || '');
      } catch (e) { /* silent */ }

      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="container page fade-in">
      <header className="flex justify-between items-center" style={{ marginBottom: '24px' }}>
        <div>
          <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', margin: 0 }}>Bonjour,</p>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--color-accent)', margin: 0 }}>
            {user?.display_name || user?.name || 'Athlète'}
          </h1>
        </div>
        <div className="card" style={{ padding: '8px 16px', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--color-secondary)', fontWeight: 700 }}>🔥 {streak}</span>
          <span style={{ fontSize: '0.75rem' }}>Jours</span>
        </div>
      </header>

      {/* Séance IA du Jour */}
      <section style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>Séance du Jour IA</h3>
        {loading ? (
          <div className="card skeleton" style={{ height: '200px' }}></div>
        ) : dailyWorkout && dailyWorkout.exercises ? (
          <div className="card" style={{ background: 'rgba(31, 48, 68, 0.85)' }}>
            <p style={{ fontSize: '0.875rem', marginBottom: '16px', color: 'var(--color-text-muted)' }}>
              {dailyWorkout.recovery_note || 'Basé sur votre récupération, voici une séance adaptée.'}
            </p>
            
            {dailyWorkout.focus_muscles && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {dailyWorkout.focus_muscles.map((m, i) => (
                  <span key={i} className="badge-recovery-fresh">🟢 {m}</span>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {dailyWorkout.exercises.map((ex, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--color-surface)', borderRadius: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 500 }}>{ex.name}</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{ex.sets}x{ex.reps}</span>
                </div>
              ))}
            </div>

            <button className="btn btn-primary btn-full" style={{ fontSize: '1.1rem' }}>
              Lancer cette séance
            </button>
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }}>
              Renseignez votre profil pour recevoir des séances personnalisées.
            </p>
            <button className="btn btn-primary" onClick={() => window.location.href = '/onboarding'}>
              Compléter mon profil
            </button>
          </div>
        )}
      </section>

      {/* Conseil du Coach IA */}
      <section style={{ marginBottom: '24px' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--color-accent)' }}>
          <h3 style={{ color: 'var(--color-accent)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🤖 Conseil du Coach IA
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', margin: 0 }}>
            {dailyTip || "Pensez à bien vous hydrater et à vous étirer après l'effort pour maximiser votre récupération."}
          </p>
        </div>
      </section>

      {/* Activité Récente */}
      <section>
        <h3 style={{ marginBottom: '16px' }}>Activité Récente</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <strong style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)' }}>Haut du Corps</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Hier</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>14 séries • 45 min • 12 450 kg</p>
          </div>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <strong style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)' }}>Jambes (Force)</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Il y a 3 jours</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>16 séries • 55 min • 14 200 kg</p>
          </div>
        </div>
      </section>
    </div>
  );
}
