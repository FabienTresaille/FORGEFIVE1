'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function ExercisesPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Tous');
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = ['Tous', 'Pectoraux', 'Dos', 'Jambes', 'Épaules', 'Bras'];

  useEffect(() => {
    async function loadExercises() {
      try {
        const data = await api.exercises.getAll();
        setExercises(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadExercises();
  }, []);

  const filtered = exercises.filter(ex => {
    const matchesSearch = ex.name?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'Tous' || ex.muscle_group === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container page fade-in">
      <h1 className="mb-md">Bibliothèque d'Exercices</h1>
      
      <div className="mb-md">
        <input 
          type="text" 
          placeholder="Rechercher un exercice..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-sm mb-lg" style={{ overflowX: 'auto', paddingBottom: '8px' }}>
        {tabs.map(tab => (
          <button
            key={tab}
            className={`btn ${filter === tab ? 'btn-primary' : 'btn-secondary'}`}
            style={{ whiteSpace: 'nowrap', padding: '8px 16px', minHeight: '36px' }}
            onClick={() => setFilter(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex-col gap-sm">
          <div className="card skeleton" style={{ height: '80px' }}></div>
          <div className="card skeleton" style={{ height: '80px' }}></div>
          <div className="card skeleton" style={{ height: '80px' }}></div>
        </div>
      ) : (
        <div className="flex-col gap-sm">
          {filtered.length > 0 ? filtered.map(ex => (
            <div key={ex.id} className="card flex justify-between items-center" style={{ padding: '16px' }}>
              <div>
                <h3 className="font-heading text-lg">{ex.name}</h3>
                <span className="text-xs text-muted">{ex.type || 'Poids libre'}</span>
              </div>
              <span className="badge-recovery-fresh" style={{ backgroundColor: 'var(--color-surface-hover)', color: 'var(--color-text)' }}>
                {ex.muscle_group}
              </span>
            </div>
          )) : (
            <div className="card text-center text-muted">
              Aucun exercice trouvé.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
