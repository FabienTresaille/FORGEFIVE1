'use client';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function RoutinesPage() {
  const router = useRouter();

  const routines = [
    { id: 1, name: 'Push Day', exercises: 6 },
    { id: 2, name: 'Pull Day', exercises: 7 },
    { id: 3, name: 'Leg Day', exercises: 5 },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>My Routines</h2>
        <Button variant="primary" onClick={() => router.push('/routines/new')} style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
          + New Routine
        </Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {routines.map(routine => (
          <Card key={routine.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div onClick={() => router.push(`/routines/${routine.id}`)} style={{ cursor: 'pointer', flex: 1 }}>
              <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{routine.name}</h4>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: '0.25rem 0' }}>{routine.exercises} exercises</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
