'use client';
import { useState } from 'react';

export default function ProgressPage() {
  const [tab, setTab] = useState('Vue d\'ensemble');

  const volumeData = [
    { day: 'Lun', volume: 12000 },
    { day: 'Mar', volume: 14500 },
    { day: 'Mer', volume: 0 },
    { day: 'Jeu', volume: 15200 },
    { day: 'Ven', volume: 0 },
    { day: 'Sam', volume: 18000 },
    { day: 'Dim', volume: 0 },
  ];
  const maxVolume = Math.max(...volumeData.map(d => d.volume), 1);

  return (
    <div className="container page fade-in">
      <h1 className="mb-md">Progression</h1>
      
      <div className="flex gap-sm mb-lg">
        <button 
          className={`btn flex-1 ${tab === 'Vue d\'ensemble' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setTab('Vue d\'ensemble')}
        >
          Vue d'ensemble
        </button>
        <button 
          className={`btn flex-1 ${tab === 'Exercices' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setTab('Exercices')}
        >
          Exercices
        </button>
      </div>

      {tab === 'Vue d\'ensemble' && (
        <div className="animate-slide-up">
          <div className="card mb-lg card-elevated">
            <h2 className="text-lg mb-md">Volume Total (7 jours)</h2>
            <div className="flex items-end justify-between gap-sm" style={{ height: '200px', paddingTop: '20px' }}>
              {volumeData.map((d, i) => {
                const height = (d.volume / maxVolume) * 100;
                return (
                  <div key={i} className="flex-col items-center" style={{ flex: 1, gap: '8px' }}>
                    <div style={{
                      width: '100%',
                      height: `${height}%`,
                      backgroundColor: 'var(--color-accent)',
                      borderRadius: '4px',
                      minHeight: d.volume > 0 ? '4px' : '0'
                    }}></div>
                    <span className="text-xs text-muted">{d.day}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-md text-sm">
              <span className="text-muted">Total hebdo</span>
              <span className="font-mono text-accent">59 700 kg</span>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg mb-md">Carte Musculaire</h2>
            <div className="text-center text-muted" style={{ padding: '40px 0' }}>
              <p>Répartition du volume par groupe musculaire</p>
              <div className="flex justify-center gap-sm mt-md" style={{ flexWrap: 'wrap' }}>
                <span className="badge-recovery-rest">Pectoraux 35%</span>
                <span className="badge-recovery-active">Dos 25%</span>
                <span className="badge-recovery-fresh">Jambes 40%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'Exercices' && (
        <div className="animate-slide-up card text-center text-muted">
          Sélectionnez un exercice pour voir son évolution.
        </div>
      )}
    </div>
  );
}
