'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function WorkoutPage() {
  const router = useRouter();
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

  const startEmptyWorkout = async () => {
    try {
      const workout = await api.workouts.create({ title: 'Séance libre', date: new Date().toISOString() });
      if (workout && workout.id) {
        router.push(`/workout/${workout.id}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const startRoutine = async (routineId) => {
    try {
      const workout = await api.workouts.create({ routine_id: routineId, date: new Date().toISOString() });
      if (workout && workout.id) {
        router.push(`/workout/${workout.id}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container page fade-in">
      <h1 className="mb-lg">Démarrer une Séance</h1>
      
      <button 
        className="btn btn-primary w-full text-lg mb-lg" 
        style={{ padding: '24px' }}
        onClick={startEmptyWorkout}
      >
        + Séance vide
      </button>

      <section>
        <h2 className="mb-md text-muted">Mes Routines</h2>
        {loading ? (
          <div className="flex-col gap-sm">
            <div className="card skeleton" style={{ height: '100px' }}></div>
            <div className="card skeleton" style={{ height: '100px' }}></div>
          </div>
        ) : routines.length > 0 ? (
          <div className="grid-2">
            {routines.map(routine => (
              <div key={routine.id} className="card flex-col justify-between">
                <div>
                  <h3 className="font-heading mb-xs">{routine.name}</h3>
                  <p className="text-sm text-muted">{routine.exercises?.length || 0} exercices</p>
                </div>
                <button 
                  className="btn btn-secondary mt-sm" 
                  onClick={() => startRoutine(routine.id)}
                >
                  Démarrer
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center">
            <p className="text-muted">Aucune routine enregistrée.</p>
          </div>
        )}
      </section>
    </div>
  );
}
