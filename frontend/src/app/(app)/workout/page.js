'use client';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function WorkoutStartPage() {
  const router = useRouter();
  
  const startEmpty = () => {
    router.push('/workout/new');
  };

  const routines = [
    { id: 1, name: 'Push Day', target: 'Chest, Shoulders, Triceps', lastPerformed: 'Yesterday' },
    { id: 2, name: 'Pull Day', target: 'Back, Biceps', lastPerformed: '3 days ago' },
    { id: 3, name: 'Leg Day', target: 'Quads, Hamstrings, Calves', lastPerformed: '5 days ago' },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Start Workout</h2>
      <Button variant="primary" onClick={startEmpty} style={{ marginBottom: '2rem' }}>
        Start Empty Workout
      </Button>

      <h3 style={{ marginBottom: '1rem' }}>My Routines</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {routines.map(routine => (
          <Card key={routine.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{routine.name}</h4>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: '0.25rem 0' }}>{routine.target}</p>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', margin: 0 }}>Last: {routine.lastPerformed}</p>
            </div>
            <Button variant="secondary" onClick={() => router.push(`/workout/${routine.id}`)} style={{ width: 'auto', padding: '0.5rem 1rem' }}>
              Start
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
