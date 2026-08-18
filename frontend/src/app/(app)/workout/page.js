'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function WorkoutPage() {
  const router = useRouter();
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    async function loadRoutines() {
      try {
        const data = await api.routines.getAll().catch(() => []);
        setRoutines(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadRoutines();
  }, []);

  const startEmptyWorkout = async () => {
    if (starting) return;
    setStarting(true);
    try {
      localStorage.removeItem('active_workout_plan');
      const workout = await api.workouts.create({
        notes: 'Séance libre',
        date: new Date().toISOString()
      }).catch(() => null);

      const targetId = (workout && workout.id) ? workout.id : Date.now();
      router.push(`/workout/${targetId}`);
    } catch (error) {
      console.error(error);
      router.push(`/workout/${Date.now()}`);
    } finally {
      setStarting(false);
    }
  };

  const startRoutine = async (routine) => {
    if (starting) return;
    setStarting(true);
    try {
      localStorage.setItem('active_workout_plan', JSON.stringify({
        title: routine.name || 'Programme',
        exercises: routine.exercises || []
      }));

      const workout = await api.workouts.create({
        notes: routine.name || 'Séance routine',
        date: new Date().toISOString()
      }).catch(() => null);

      const targetId = (workout && workout.id) ? workout.id : (routine.id || Date.now());
      router.push(`/workout/${targetId}`);
    } catch (error) {
      console.error(error);
      router.push(`/workout/${routine.id || Date.now()}`);
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="container page fade-in">
      <h1 className="mb-lg">Démarrer une Séance</h1>
      
      <button 
        className="btn btn-primary w-full text-lg mb-lg" 
        style={{ padding: '20px', fontSize: '1.15rem' }}
        onClick={startEmptyWorkout}
        disabled={starting}
      >
        {starting ? 'Préparation...' : '+ Séance vide'}
      </button>

      <section>
        <div className="flex justify-between items-center mb-md">
          <h2 className="text-muted" style={{ fontSize: '1.2rem', margin: 0 }}>Mes Programmes</h2>
          <button 
            className="btn btn-secondary text-sm" 
            style={{ padding: '6px 12px', minHeight: 'auto' }}
            onClick={() => router.push('/routines')}
          >
            Gérer
          </button>
        </div>

        {loading ? (
          <div className="flex-col gap-sm">
            <div className="card skeleton" style={{ height: '80px' }}></div>
            <div className="card skeleton" style={{ height: '80px' }}></div>
          </div>
        ) : routines.length > 0 ? (
          <div className="flex-col gap-md">
            {routines.map(routine => (
              <div key={routine.id} className="card flex justify-between items-center" style={{ padding: '16px 20px' }}>
                <div>
                  <h3 className="font-heading mb-xs" style={{ fontSize: '1.1rem' }}>{routine.name}</h3>
                  <p className="text-sm text-muted">{routine.exercises?.length || 0} exercices</p>
                </div>
                <button 
                  className="btn btn-primary" 
                  style={{ minHeight: '40px', padding: '8px 16px', fontSize: '0.9rem' }}
                  onClick={() => startRoutine(routine)}
                  disabled={starting}
                >
                  Démarrer
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center" style={{ padding: '32px 16px' }}>
            <p className="text-muted mb-md">Aucune routine personnalisée pour le moment.</p>
            <button className="btn btn-secondary" onClick={() => router.push('/routines')}>
              + Créer une routine
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
