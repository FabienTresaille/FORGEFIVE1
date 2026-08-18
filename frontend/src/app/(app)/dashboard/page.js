'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';

export default function DashboardPage() {
  const { user } = useAuth();
  const [streak, setStreak] = useState(0);
  const [dailyWorkout, setDailyWorkout] = useState(null);
  const [dailyTip, setDailyTip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [streakData, workoutData, tipData] = await Promise.all([
          api.gamification?.getStreak ? api.gamification.getStreak() : Promise.resolve(0),
          api.coach?.getDailyWorkout ? api.coach.getDailyWorkout() : Promise.resolve(null),
          api.coach?.getDailyTip ? api.coach.getDailyTip() : Promise.resolve(null)
        ]);
        setStreak(streakData || 0);
        setDailyWorkout(workoutData);
        setDailyTip(tipData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="container page fade-in">
      <header className="flex justify-between items-center mb-lg">
        <div>
          <h1 className="text-lg text-muted">Bonjour,</h1>
          <h2 className="text-accent font-heading">{user?.display_name || user?.name || 'Athlète'}</h2>
        </div>
        <div className="card" style={{ padding: '8px 16px', borderRadius: 'var(--border-radius-pill)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="text-secondary font-mono">🔥 {streak}</span>
          <span className="text-xs">Jours</span>
        </div>
      </header>

      <section className="mb-lg">
        <h3 className="mb-md">Séance du Jour IA</h3>
        {loading ? (
          <div className="card skeleton" style={{ height: '200px' }}></div>
        ) : dailyWorkout ? (
          <div className="card card-elevated animate-scale-in">
            <p className="text-sm mb-md">{dailyWorkout.recovery_note || 'Basé sur votre récupération, voici une séance adaptée.'}</p>
            
            <div className="flex gap-sm mb-md" style={{ flexWrap: 'wrap' }}>
              <span className="badge-recovery-fresh">🟢 Pectoraux</span>
              <span className="badge-recovery-active">🟠 Épaules</span>
              <span className="badge-recovery-rest">🔴 Jambes</span>
            </div>

            <div className="flex-col gap-sm mb-lg">
              {(dailyWorkout.exercises || [{name: 'Développé Couché', sets: 4, reps: '8-10'}, {name: 'Tractions', sets: 3, reps: 'Max'}]).map((ex, i) => (
                <div key={i} className="flex justify-between items-center" style={{ padding: '8px', background: 'var(--color-surface)', borderRadius: 'var(--radius-sm)' }}>
                  <span className="font-heading">{ex.name}</span>
                  <span className="text-sm text-muted">{ex.sets} séries x {ex.reps}</span>
                </div>
              ))}
            </div>

            <button className="btn btn-primary btn-full text-lg">Lancer cette séance</button>
          </div>
        ) : (
          <div className="card text-center">
            <p className="text-muted mb-md">Aucune séance générée pour aujourd'hui.</p>
            <button className="btn btn-primary">Générer une séance</button>
          </div>
        )}
      </section>

      <section className="mb-lg">
        <div className="card" style={{ borderLeft: '4px solid var(--color-accent)' }}>
          <h3 className="text-accent mb-sm flex items-center gap-sm">
            🤖 Conseil du Coach IA
          </h3>
          <p className="text-sm text-muted">
            {dailyTip || "Pensez à bien vous hydrater. Prenez le temps de vous étirer après l'effort pour maximiser votre récupération."}
          </p>
        </div>
      </section>

      <section>
        <h3 className="mb-md">Activité Récente</h3>
        <div className="flex-col gap-md">
          <div className="card">
            <div className="flex justify-between items-center mb-sm">
              <strong className="text-lg font-heading">Haut du Corps</strong>
              <span className="text-xs text-muted">Hier</span>
            </div>
            <p className="text-sm text-muted">14 séries • 45 min • 12,450 kg</p>
          </div>
          <div className="card">
            <div className="flex justify-between items-center mb-sm">
              <strong className="text-lg font-heading">Jambes (Force)</strong>
              <span className="text-xs text-muted">Il y a 3 jours</span>
            </div>
            <p className="text-sm text-muted">16 séries • 55 min • 14,200 kg</p>
          </div>
        </div>
      </section>
    </div>
  );
}
