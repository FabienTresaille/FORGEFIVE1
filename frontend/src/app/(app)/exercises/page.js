'use client';
import { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Tabs from '@/components/ui/Tabs';

export default function ExercisesPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'chest', label: 'Chest' },
    { id: 'back', label: 'Back' },
    { id: 'legs', label: 'Legs' },
    { id: 'shoulders', label: 'Shoulders' },
    { id: 'arms', label: 'Arms' },
  ];

  const exercises = [
    { id: 1, name: 'Bench Press', muscle: 'Chest', type: 'Barbell' },
    { id: 2, name: 'Squat', muscle: 'Legs', type: 'Barbell' },
    { id: 3, name: 'Pull-up', muscle: 'Back', type: 'Bodyweight' },
    { id: 4, name: 'Overhead Press', muscle: 'Shoulders', type: 'Barbell' },
    { id: 5, name: 'Bicep Curl', muscle: 'Arms', type: 'Dumbbell' },
    { id: 6, name: 'Leg Extension', muscle: 'Legs', type: 'Machine' },
  ];

  const filtered = exercises.filter(ex => 
    ex.name.toLowerCase().includes(search.toLowerCase()) && 
    (activeTab === 'all' || ex.muscle.toLowerCase() === activeTab)
  );

  return (
    <div>
      <h2 style={{ marginBottom: '1rem' }}>Exercise Library</h2>
      
      <Input 
        placeholder="Search exercises..." 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
        {filtered.map(ex => (
          <Card key={ex.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
            <div>
              <h4 style={{ margin: 0 }}>{ex.name}</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{ex.type}</span>
            </div>
            <span style={{ 
              backgroundColor: 'var(--color-surface-light)', 
              padding: '0.25rem 0.5rem', 
              borderRadius: 'var(--border-radius-pill)',
              fontSize: '0.75rem',
              color: 'var(--color-accent)'
            }}>
              {ex.muscle}
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
}
