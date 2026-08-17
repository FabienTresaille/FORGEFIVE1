export default function ChatInput({ onSend }) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
      <input 
        type="text" 
        placeholder="Ask coach..."
        style={{
          flex: 1,
          padding: '0.75rem 1rem',
          borderRadius: 'var(--border-radius-pill)',
          border: '1px solid var(--color-surface-light)',
          backgroundColor: 'var(--color-primary)',
          color: 'white'
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.target.value) {
            onSend(e.target.value);
            e.target.value = '';
          }
        }}
      />
      <button style={{
        width: '48px', height: '48px',
        borderRadius: '50%',
        backgroundColor: 'var(--color-accent)',
        color: '#000',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 'bold'
      }}>
        ↑
      </button>
    </div>
  );
}
