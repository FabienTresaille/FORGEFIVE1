'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function RankingsPage() {
  const [tab, setTab] = useState('Assiduité');
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRanking() {
      setLoading(true);
      try {
        const data = tab === 'Assiduité' 
          ? await api.gamification.getAttendanceRanking() 
          : await api.rankings.getGroup();
        setRanking(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadRanking();
  }, [tab]);

  return (
    <div className="container page fade-in">
      <h1 className="mb-md">Classements</h1>
      
      <div className="flex gap-sm mb-lg">
        <button 
          className={`btn flex-1 ${tab === 'Assiduité' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setTab('Assiduité')}
        >
          Assiduité
        </button>
        <button 
          className={`btn flex-1 ${tab === 'Force' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setTab('Force')}
        >
          Force
        </button>
      </div>

      {loading ? (
        <div className="flex-col gap-sm">
          <div className="card skeleton" style={{ height: '200px' }}></div>
          <div className="card skeleton" style={{ height: '80px' }}></div>
        </div>
      ) : ranking.length > 0 ? (
        <>
          {/* Podium for top 3 */}
          <div className="flex items-end justify-center gap-sm mb-xl" style={{ height: '200px', paddingTop: '40px' }}>
            {ranking[1] && (
              <div className="flex-col items-center" style={{ width: '30%' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-argent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#000', marginBottom: '8px' }}>
                  {ranking[1].user_name?.substring(0, 2).toUpperCase()}
                </div>
                <div className="text-sm font-bold text-center truncate w-full">{ranking[1].user_name}</div>
                <div className="text-xs text-muted mb-xs">{ranking[1].score || ranking[1].points} pts</div>
                <div style={{ width: '100%', height: '80px', backgroundColor: 'var(--color-surface)', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '8px', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-argent)' }}>2</div>
              </div>
            )}
            
            {ranking[0] && (
              <div className="flex-col items-center" style={{ width: '35%' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--color-or)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#000', marginBottom: '8px', border: '2px solid var(--color-or)', boxShadow: '0 0 16px rgba(255,215,0,0.4)' }}>
                  {ranking[0].user_name?.substring(0, 2).toUpperCase()}
                </div>
                <div className="text-md font-bold text-center truncate w-full">{ranking[0].user_name}</div>
                <div className="text-sm text-accent mb-xs">{ranking[0].score || ranking[0].points} pts</div>
                <div style={{ width: '100%', height: '120px', backgroundColor: 'var(--color-surface)', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '8px', fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-or)' }}>1</div>
              </div>
            )}

            {ranking[2] && (
              <div className="flex-col items-center" style={{ width: '30%' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-bronze)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#000', marginBottom: '8px' }}>
                  {ranking[2].user_name?.substring(0, 2).toUpperCase()}
                </div>
                <div className="text-sm font-bold text-center truncate w-full">{ranking[2].user_name}</div>
                <div className="text-xs text-muted mb-xs">{ranking[2].score || ranking[2].points} pts</div>
                <div style={{ width: '100%', height: '60px', backgroundColor: 'var(--color-surface)', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '8px', fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-bronze)' }}>3</div>
              </div>
            )}
          </div>

          <div className="flex-col gap-xs">
            {ranking.slice(3).map((user, index) => (
              <div key={user.id || index} className="card flex items-center justify-between" style={{ padding: '12px 16px' }}>
                <div className="flex items-center gap-md">
                  <div className="font-mono text-muted text-lg" style={{ width: '32px' }}>{index + 4}</div>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.875rem' }}>
                    {user.user_name?.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="font-heading">{user.user_name}</div>
                </div>
                <div className="text-accent font-mono">{user.score || user.points} pts</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="card text-center text-muted">
          Aucun classement disponible.
        </div>
      )}
    </div>
  );
}
