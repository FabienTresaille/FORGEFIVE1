export default function StreakCounter({ streak = 0 }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      backgroundColor: 'var(--color-surface)',
      padding: '0.5rem 1rem',
      borderRadius: 'var(--border-radius-pill)',
    }}>
      <span style={{ color: 'var(--color-secondary)' }}>🔥</span>
      <span style={{ fontWeight: 'bold' }}>{streak}</span>
    </div>
  );
}
