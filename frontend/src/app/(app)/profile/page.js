'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const ach = await api.gamification.getAchievements();
        setAchievements(ach || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="container page fade-in">
      <div className="flex-col items-center mb-lg pt-lg">
        <div style={{
          width: '100px', height: '100px', borderRadius: '50%',
          backgroundColor: 'var(--color-surface-hover)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '16px',
          border: '4px solid var(--color-accent)'
        }}>
          {user?.display_name?.substring(0, 2).toUpperCase() || user?.name?.substring(0, 2).toUpperCase() || 'U'}
        </div>
        <h1 className="text-xl mb-xs flex items-center gap-sm">
          {user?.display_name || user?.name || 'Utilisateur'}
          <span className="badge-recovery-active" style={{ backgroundColor: 'var(--color-or)', color: '#000' }}>{user?.rank || 'Or'}</span>
        </h1>
        <p className="text-muted">{user?.email}</p>
      </div>

      <div className="grid-2 mb-lg">
        <div className="card text-center">
          <div className="text-sm text-muted mb-xs">Poids</div>
          <div className="font-mono text-lg">{user?.weight_kg || '-'} kg</div>
        </div>
        <div className="card text-center">
          <div className="text-sm text-muted mb-xs">Taille</div>
          <div className="font-mono text-lg">{user?.height_cm || '-'} cm</div>
        </div>
        <div className="card text-center" style={{ gridColumn: 'span 2' }}>
          <div className="text-sm text-muted mb-xs">Objectif</div>
          <div className="font-mono text-lg text-accent">{user?.goal || 'Non défini'}</div>
        </div>
      </div>

      <section className="mb-lg">
        <h2 className="mb-md">Succès</h2>
        {loading ? (
          <div className="card skeleton" style={{ height: '120px' }}></div>
        ) : achievements.length > 0 ? (
          <div className="flex-col gap-sm">
            {achievements.map((ach, i) => (
              <div key={i} className="card flex items-center gap-md" style={{ padding: '12px 16px' }}>
                <div style={{ fontSize: '2rem' }}>{ach.icon || '🏆'}</div>
                <div>
                  <h3 className="font-heading text-md">{ach.title}</h3>
                  <p className="text-sm text-muted">{ach.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center text-muted">Aucun succès débloqué.</div>
        )}
      </section>

      <section>
        <h2 className="mb-md">Réglages</h2>
        <div className="flex-col gap-sm">
          <button className="btn btn-secondary w-full" style={{ justifyContent: 'flex-start' }}>Modifier le profil</button>
          <button className="btn btn-secondary w-full" style={{ justifyContent: 'flex-start' }} onClick={() => router.push('/change-password')}>Changer le mot de passe</button>
          {user?.role === 'admin' && (
            <button className="btn btn-secondary w-full text-warning" style={{ justifyContent: 'flex-start' }} onClick={() => router.push('/admin')}>Panneau Admin</button>
          )}
          <button className="btn btn-danger w-full mt-md" onClick={handleLogout}>Se déconnecter</button>
        </div>
      </section>
    </div>
  );
}
