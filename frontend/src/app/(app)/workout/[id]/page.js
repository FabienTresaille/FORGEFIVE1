'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import WorkoutTimer from '@/components/workout/WorkoutTimer';
import ExerciseCard from '@/components/workout/ExerciseCard';
import Button from '@/components/ui/Button';

export default function ActiveWorkoutPage({ params }) {
  const router = useRouter();
  const [exercises, setExercises] = useState([
    { 
      id: 1, 
      name: 'Bench Press', 
      sets: [
        { previousWeight: 80, previousReps: 10 },
        { previousWeight: 80, previousReps: 10 },
        { previousWeight: 80, previousReps: 8 }
      ]
    },
    { 
      id: 2, 
      name: 'Incline Dumbbell Press', 
      sets: [
        { previousWeight: 30, previousReps: 12 },
        { previousWeight: 30, previousReps: 10 }
      ]
    }
  ]);
  const [isTimerActive, setIsTimerActive] = useState(true);

  const handleSaveSet = (exerciseId, setIndex, data) => {
    console.log(`Saved Set ${setIndex} for Exercise ${exerciseId}:`, data);
  };

  const finishWorkout = () => {
    setIsTimerActive(false);
    // In a real app, send data to backend
    router.push('/dashboard');
  };

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', position: 'sticky', top: '64px', backgroundColor: 'var(--color-primary)', padding: '1rem 0', zIndex: 10 }}>
        <div>
          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Active Session</span>
          <WorkoutTimer isActive={isTimerActive} />
        </div>
        <Button variant="danger" onClick={finishWorkout} style={{ width: 'auto', padding: '0.5rem 1rem' }}>
          Finish
        </Button>
      </div>

      {exercises.map((ex) => (
        <ExerciseCard 
          key={ex.id} 
          exercise={ex} 
          sets={ex.sets} 
          onSaveSet={handleSaveSet}
        />
      ))}
      
      <Button variant="secondary" style={{ marginTop: '1rem' }}>
        + Add Exercise
      </Button>
    </div>
  );
}
