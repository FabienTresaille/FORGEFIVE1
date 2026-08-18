'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [streak, setStreak] = useState(0);
  const [dailyWorkout, setDailyWorkout] = useState(null);
  const [dailyTip, setDailyTip] = useState('');
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [launching, setLaunching] = useState(false);

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

      try {
        const workoutsList = await api.workouts.getAll().catch(() => []);
        setRecentWorkouts(workoutsList || []);
      } catch (e) { /* silent */ }

      setLoading(false);
    }
    loadData();
  }, []);

  const handleLaunchWorkout = async () => {
    if (launching) return;
    setLaunching(true);
    try {
      const workoutTitle = dailyWorkout?.title || 'Séance du Jour IA';
      
      // Save AI exercises into active workout plan in localStorage
      if (dailyWorkout && dailyWorkout.exercises && dailyWorkout.exercises.length > 0) {
        localStorage.setItem('active_workout_plan', JSON.stringify({
          title: workoutTitle,
          exercises: dailyWorkout.exercises,
          focus_muscles: dailyWorkout.focus_muscles || []
        }));
      }

      const workout = await api.workouts.create({
        notes: workoutTitle,
        date: new Date().toISOString()
      }).catch(() => null);

      const targetId = (workout && workout.id) ? workout.id : 'ia-session';
      router.push(`/workout/${targetId}`);
    } catch (err) {
      console.error('Error launching workout:', err);
      router.push('/workout/ia-session');
    } finally {
      setLaunching(false);
    }
  };

  const formatWorkoutDate = (dateString) => {
    if (!dateString) return 'Récemment';
    const d = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const calculateVolume = (sets) => {
    if (!sets || sets.length === 0) return 0;
    return sets.reduce((total, s) => total + ((s.weight || 0) * (s.reps || 0)), 0);
  };

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
            <h4 style={{ color: 'var(--color-accent)', marginBottom: '8px' }}>{dailyWorkout.title || 'Séance personnalisée'}</h4>
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

            <button 
              className="btn btn-primary btn-full" 
              style={{ fontSize: '1.1rem' }}
              onClick={handleLaunchWorkout}
              disabled={launching}
            >
              {launching ? 'Chargement de la séance...' : 'Lancer cette séance'}
            </button>
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }}>
              Renseignez votre profil pour recevoir des séances personnalisées.
            </p>
            <button className="btn btn-primary" onClick={() => router.push('/onboarding')}>
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
        {recentWorkouts.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentWorkouts.slice(0, 5).map((w, idx) => {
              const setsCount = w.sets?.length || 0;
              const totalVolume = calculateVolume(w.sets);
              const duration = w.duration_minutes || 45;
              return (
                <div key={w.id || idx} className="card card-elevated" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <strong style={{ fontSize: '1.05rem', fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
                      {w.notes || 'Entraînement'}
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 600 }}>
                      {formatWorkoutDate(w.date || w.started_at)}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
                    {setsCount} séries • {duration} min {totalVolume > 0 ? `• ${totalVolume.toLocaleString('fr-FR')} kg soulevés` : ''}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card text-center text-muted" style={{ padding: '24px' }}>
            Aucune séance terminée pour le moment.
          </div>
        )}
      </section>
    </div>
  );
}
