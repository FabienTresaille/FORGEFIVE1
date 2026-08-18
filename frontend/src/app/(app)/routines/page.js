'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function RoutinesPage() {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRoutines() {
      try {
        const data = await api.routines.getAll();
        setRoutines(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadRoutines();
  }, []);

  return (
    <div className="container page fade-in">
      <div className="flex justify-between items-center mb-lg">
        <h1 className="margin-0">Mes Routines</h1>
        <button className="btn btn-primary btn-icon" style={{ width: '48px', height: '48px', fontSize: '1.5rem' }}>
          +
        </button>
      </div>

      <button className="btn btn-secondary w-full mb-lg" style={{ padding: '16px', borderStyle: 'dashed' }}>
        + Nouvelle Routine
      </button>

      {loading ? (
        <div className="flex-col gap-md">
          <div className="card skeleton" style={{ height: '100px' }}></div>
          <div className="card skeleton" style={{ height: '100px' }}></div>
        </div>
      ) : routines.length > 0 ? (
        <div className="flex-col gap-md">
          {routines.map(routine => (
            <div key={routine.id} className="card flex justify-between items-center">
              <div>
                <h3 className="font-heading mb-xs">{routine.name}</h3>
                <p className="text-sm text-muted">{routine.exercises?.length || 0} exercices</p>
              </div>
              <button className="btn btn-secondary text-sm">
                Voir
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center text-muted">
          Vous n'avez pas encore de routines.
        </div>
      )}
    </div>
  );
}
