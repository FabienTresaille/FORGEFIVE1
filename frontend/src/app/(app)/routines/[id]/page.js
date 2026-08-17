'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function EditRoutinePage({ params }) {
  const router = useRouter();
  const isNew = params.id === 'new';
  const [name, setName] = useState(isNew ? '' : 'Push Day');
  const [exercises, setExercises] = useState([
    { id: 1, name: 'Bench Press', sets: 3 },
    { id: 2, name: 'Incline Dumbbell Press', sets: 3 }
  ]);

  const saveRoutine = () => {
    // API call to save routine
    router.push('/routines');
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>{isNew ? 'Create Routine' : 'Edit Routine'}</h2>
      
      <Input 
        label="Routine Name"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="e.g. Upper Body Power"
      />

      <h4 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Exercises</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
        {exercises.map((ex, idx) => (
          <Card key={ex.id} style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 'bold' }}>{idx + 1}. {ex.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{ex.sets} sets</div>
            </div>
            <button style={{ color: 'var(--color-error)' }}>Remove</button>
          </Card>
        ))}
        <Button variant="secondary" style={{ marginTop: '0.5rem' }}>+ Add Exercise</Button>
      </div>

      <Button variant="primary" onClick={saveRoutine}>Save Routine</Button>
    </div>
  );
}
