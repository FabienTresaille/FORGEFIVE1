'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';

export default function ActiveWorkoutPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params?.id;

  const [sessionTitle, setSessionTitle] = useState('Séance d\'entraînement');
  const [seconds, setSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [exercises, setExercises] = useState([]);
  const [allDbExercises, setAllDbExercises] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [finishing, setFinishing] = useState(false);

  // Load active workout plan (from AI daily workout or routine)
  useEffect(() => {
    try {
      const savedPlan = localStorage.getItem('active_workout_plan');
      if (savedPlan) {
        const parsed = JSON.parse(savedPlan);
        if (parsed.title) setSessionTitle(parsed.title);
        if (parsed.exercises && parsed.exercises.length > 0) {
          const formatted = parsed.exercises.map((ex, idx) => {
            const numSets = parseInt(ex.sets) || 3;
            const targetReps = ex.reps || '10';
            return {
              id: idx + 1,
              name: ex.name,
              sets: Array.from({ length: numSets }, (_, sIdx) => ({
                setNumber: sIdx + 1,
                weight: 0,
                reps: parseInt(targetReps) || 10,
                targetReps: targetReps,
                completed: false
              }))
            };
          });
          setExercises(formatted);
          return;
        }
      }
    } catch (e) {
      console.error('Failed to load saved workout plan:', e);
    }

    // Default fallback exercises if starting a blank session
    setExercises([
      {
        id: 1,
        name: 'Développé Couché',
        sets: [
          { setNumber: 1, weight: 60, reps: 10, completed: false },
          { setNumber: 2, weight: 60, reps: 10, completed: false },
          { setNumber: 3, weight: 60, reps: 10, completed: false }
        ]
      }
    ]);
  }, []);

  // Timer
  useEffect(() => {
    let interval = null;
    if (isTimerActive) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive]);

  // Load DB exercises for the modal
  useEffect(() => {
    async function loadDbExercises() {
      try {
        const data = await api.exercises.getAll().catch(() => []);
        if (data && data.length > 0) {
          setAllDbExercises(data);
        }
      } catch (e) { /* silent */ }
    }
    loadDbExercises();
  }, []);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleSetComplete = (exIndex, setIndex) => {
    const updated = [...exercises];
    updated[exIndex].sets[setIndex].completed = !updated[exIndex].sets[setIndex].completed;
    setExercises(updated);
  };

  const updateSetValue = (exIndex, setIndex, field, value) => {
    const updated = [...exercises];
    updated[exIndex].sets[setIndex][field] = value;
    setExercises(updated);
  };

  const addSetToExercise = (exIndex) => {
    const updated = [...exercises];
    const lastSet = updated[exIndex].sets[updated[exIndex].sets.length - 1];
    const newSetNumber = updated[exIndex].sets.length + 1;
    updated[exIndex].sets.push({
      setNumber: newSetNumber,
      weight: lastSet ? lastSet.weight : 0,
      reps: lastSet ? lastSet.reps : 10,
      completed: false
    });
    setExercises(updated);
  };

  const handleAddExercise = (exercise) => {
    setExercises(prev => [
      ...prev,
      {
        id: exercise.id || Date.now(),
        name: exercise.name,
        sets: [
          { setNumber: 1, weight: 0, reps: 10, completed: false },
          { setNumber: 2, weight: 0, reps: 10, completed: false },
          { setNumber: 3, weight: 0, reps: 10, completed: false }
        ]
      }
    ]);
    setShowAddModal(false);
  };

  const finishWorkout = async () => {
    setIsTimerActive(false);
    setFinishing(true);

    try {
      if (sessionId && sessionId.length > 20) {
        await api.workouts.update(sessionId, {
          duration_minutes: Math.max(1, Math.round(seconds / 60)),
          completed_at: new Date().toISOString()
        }).catch(() => null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      // Clear plan after finishing
      localStorage.removeItem('active_workout_plan');
    }

    router.push('/dashboard');
  };

  return (
    <div className="container page fade-in" style={{ paddingBottom: '100px' }}>
      {/* Sticky top bar with Timer & Finish button */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(27, 40, 56, 0.95)',
        backdropFilter: 'blur(12px)',
        padding: '12px 0',
        marginBottom: '20px',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-accent)', fontWeight: 700, letterSpacing: '0.05em' }}>
            ⚡ {sessionTitle}
          </span>
          <div style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
            ⏱️ {formatTime(seconds)}
          </div>
        </div>
        <button 
          className="btn btn-danger" 
          style={{ minHeight: '40px', padding: '8px 20px', fontSize: '0.95rem' }}
          onClick={finishWorkout}
          disabled={finishing}
        >
          {finishing ? 'Enregistrement...' : 'Terminer'}
        </button>
      </div>

      {/* Exercises List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {exercises.map((ex, exIndex) => (
          <div key={exIndex} className="card card-elevated" style={{ padding: '16px' }}>
            <h3 className="font-heading" style={{ color: 'var(--color-accent)', marginBottom: '12px' }}>
              {ex.name}
            </h3>

            {/* Set Table Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 50px', gap: '8px', padding: '0 4px 8px 4px', fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
              <span>SÉRIE</span>
              <span>KG</span>
              <span>REPS</span>
              <span>VAL.</span>
            </div>

            {/* Set Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {ex.sets.map((set, setIndex) => (
                <div 
                  key={setIndex}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '40px 1fr 1fr 50px',
                    gap: '8px',
                    alignItems: 'center',
                    background: set.completed ? 'rgba(0, 230, 118, 0.12)' : 'var(--color-surface)',
                    border: set.completed ? '1px solid var(--color-accent)' : '1px solid transparent',
                    borderRadius: '8px',
                    padding: '8px'
                  }}
                >
                  <span style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
                    {set.setNumber}
                  </span>
                  <input
                    type="number"
                    value={set.weight}
                    onChange={(e) => updateSetValue(exIndex, setIndex, 'weight', parseFloat(e.target.value) || 0)}
                    style={{ textAlign: 'center', padding: '6px', fontSize: '0.95rem' }}
                    placeholder="kg"
                  />
                  <input
                    type="number"
                    value={set.reps}
                    onChange={(e) => updateSetValue(exIndex, setIndex, 'reps', parseInt(e.target.value) || 0)}
                    style={{ textAlign: 'center', padding: '6px', fontSize: '0.95rem' }}
                    placeholder="reps"
                  />
                  <button
                    onClick={() => toggleSetComplete(exIndex, setIndex)}
                    style={{
                      background: set.completed ? 'var(--color-accent)' : 'var(--color-surface-hover)',
                      color: set.completed ? '#000' : 'var(--color-text)',
                      border: 'none',
                      borderRadius: '6px',
                      height: '36px',
                      fontWeight: 700,
                      fontSize: '1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {set.completed ? '✓' : '—'}
                  </button>
                </div>
              ))}
            </div>

            <button
              className="btn btn-secondary w-full"
              style={{ marginTop: '12px', minHeight: '36px', padding: '6px', fontSize: '0.85rem' }}
              onClick={() => addSetToExercise(exIndex)}
            >
              + Ajouter une série
            </button>
          </div>
        ))}
      </div>

      <button
        className="btn btn-primary w-full"
        style={{ marginTop: '20px', padding: '16px', fontSize: '1rem' }}
        onClick={() => setShowAddModal(true)}
      >
        + Ajouter un exercice
      </button>

      {/* Add Exercise Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center'
        }}>
          <div className="card w-full" style={{
            maxHeight: '80vh',
            overflowY: 'auto',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            maxWidth: '540px',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 className="font-heading">Choisir un exercice</h3>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '4px 12px', minHeight: 'auto' }}
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(allDbExercises.length > 0 ? allDbExercises : [
                { name: 'Développé Couché', muscle_group: 'Pectoraux' },
                { name: 'Squat Arrière', muscle_group: 'Jambes' },
                { name: 'Soulevé de Terre', muscle_group: 'Dos' },
                { name: 'Tractions', muscle_group: 'Dos' },
                { name: 'Développé Militaire', muscle_group: 'Épaules' },
                { name: 'Curl Biceps Haltères', muscle_group: 'Bras' },
                { name: 'Dips', muscle_group: 'Pectoraux' }
              ]).map((ex, i) => (
                <div
                  key={i}
                  onClick={() => handleAddExercise(ex)}
                  className="card flex justify-between items-center"
                  style={{ padding: '12px 16px', cursor: 'pointer' }}
                >
                  <span style={{ fontWeight: 600 }}>{ex.name}</span>
                  <span className="text-xs text-muted">{ex.muscle_group || 'Musculation'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
