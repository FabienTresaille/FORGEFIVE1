export default function RankBadge({ rank = 'Bronze' }) {
  const colors = {
    Bronze: '#CD7F32',
    Silver: '#C0C0C0',
    Gold: '#FFD700',
    Diamond: '#b9f2ff'
  };
  
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      backgroundColor: 'var(--color-surface-light)',
      padding: '0.5rem 1rem',
      borderRadius: 'var(--border-radius-pill)',
      border: `1px solid ${colors[rank] || colors.Bronze}`
    }}>
      <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: colors[rank] || colors.Bronze }} />
      <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{rank} Rank</span>
    </div>
  );
}
