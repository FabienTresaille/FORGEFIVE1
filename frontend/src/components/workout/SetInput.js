import { useState } from 'react';
import Card from '../ui/Card';

export default function SetInput({ setNumber, previousWeight, previousReps, onSave }) {
  const [weight, setWeight] = useState(previousWeight || 0);
  const [reps, setReps] = useState(previousReps || 0);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSave = () => {
    setIsCompleted(!isCompleted);
    if (!isCompleted) {
      onSave({ weight, reps });
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      padding: '0.75rem 0',
      borderBottom: '1px solid var(--color-surface-light)',
      opacity: isCompleted ? 0.6 : 1
    }}>
      <div style={{ width: '10%', fontWeight: 'bold' }}>{setNumber}</div>
      <div style={{ width: '30%', color: 'var(--color-text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>
        {previousWeight ? `${previousWeight}kg x ${previousReps}` : '-'}
      </div>
      <div style={{ width: '25%', display: 'flex', justifyContent: 'center' }}>
        <input 
          type="number" 
          value={weight} 
          onChange={e => setWeight(Number(e.target.value))}
          disabled={isCompleted}
          style={{ 
            width: '60px', padding: '0.5rem', borderRadius: '4px',
            background: 'var(--color-primary)', border: '1px solid var(--color-surface-light)',
            color: 'white', textAlign: 'center'
          }} 
        />
      </div>
      <div style={{ width: '20%', display: 'flex', justifyContent: 'center' }}>
        <input 
          type="number" 
          value={reps} 
          onChange={e => setReps(Number(e.target.value))}
          disabled={isCompleted}
          style={{ 
            width: '60px', padding: '0.5rem', borderRadius: '4px',
            background: 'var(--color-primary)', border: '1px solid var(--color-surface-light)',
            color: 'white', textAlign: 'center'
          }} 
        />
      </div>
      <div style={{ width: '15%', display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          onClick={handleSave}
          style={{
            background: isCompleted ? 'var(--color-success)' : 'var(--color-surface-light)',
            color: isCompleted ? '#000' : 'var(--color-text)',
            border: 'none',
            borderRadius: '4px',
            padding: '0.5rem',
            width: '32px', height: '32px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          {isCompleted ? '✓' : ''}
        </button>
      </div>
    </div>
  );
}
