'use client';
import { useState } from 'react';
import Slider from '@/components/ui/Slider';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import RecoveryChart from '@/components/charts/RecoveryChart';

export default function RecoveryPage() {
  const [sleep, setSleep] = useState(3);
  const [soreness, setSoreness] = useState(3);
  const [energy, setEnergy] = useState(3);

  const mockData = [
    { day: 'Mon', score: 8 },
    { day: 'Tue', score: 6 },
    { day: 'Wed', score: 9 },
    { day: 'Thu', score: 7 },
    { day: 'Fri', score: 5 },
    { day: 'Sat', score: 8 },
    { day: 'Sun', score: 10 },
  ];

  const handleSave = () => {
    alert('Recovery logged!');
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Daily Recovery</h2>
      
      <Card style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Log Today</h3>
        <Slider label="Sleep Quality" value={sleep} onChange={e => setSleep(Number(e.target.value))} />
        <Slider label="Muscle Soreness (1 = very sore)" value={soreness} onChange={e => setSoreness(Number(e.target.value))} />
        <Slider label="Energy Level" value={energy} onChange={e => setEnergy(Number(e.target.value))} />
        <Button variant="primary" onClick={handleSave} style={{ marginTop: '1rem' }}>Log Recovery</Button>
      </Card>

      <Card style={{ borderLeft: '4px solid var(--color-accent)', marginBottom: '2rem' }}>
        <h4 style={{ color: 'var(--color-accent)', margin: '0 0 0.5rem 0' }}>AI Recommendation</h4>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          Your energy is average but soreness is low. Good day for a moderate hypertrophy session!
        </p>
      </Card>

      <Card>
        <h3 style={{ marginBottom: '1rem' }}>Recovery History</h3>
        <RecoveryChart data={mockData} />
      </Card>
    </div>
  );
}
