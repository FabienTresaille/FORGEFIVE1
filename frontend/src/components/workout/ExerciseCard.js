import Card from '../ui/Card';
import SetInput from './SetInput';

export default function ExerciseCard({ exercise, sets, onSaveSet }) {
  return (
    <Card style={{ marginBottom: '1rem' }}>
      <h3 style={{ color: 'var(--color-accent)', marginBottom: '1rem' }}>{exercise.name}</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.8rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-surface-light)' }}>
        <div style={{ width: '10%' }}>SET</div>
        <div style={{ width: '30%', textAlign: 'center' }}>PREVIOUS</div>
        <div style={{ width: '25%', textAlign: 'center' }}>KG</div>
        <div style={{ width: '20%', textAlign: 'center' }}>REPS</div>
        <div style={{ width: '15%', textAlign: 'right' }}>DONE</div>
      </div>
      {sets.map((set, idx) => (
        <SetInput 
          key={idx} 
          setNumber={idx + 1} 
          previousWeight={set.previousWeight} 
          previousReps={set.previousReps}
          onSave={(data) => onSaveSet(exercise.id, idx, data)}
        />
      ))}
      <button style={{ 
        width: '100%', padding: '0.75rem', marginTop: '1rem',
        background: 'transparent', border: '1px dashed var(--color-surface-light)',
        color: 'var(--color-text-muted)', borderRadius: 'var(--border-radius-btn)'
      }}>
        + Add Set
      </button>
    </Card>
  );
}
