export default function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: '4px', padding: '1rem', backgroundColor: 'var(--color-surface)', borderRadius: '1rem', maxWidth: '60px', marginBottom: '1rem' }}>
      <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--color-text-muted)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both' }} />
      <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--color-text-muted)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.2s' }} />
      <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--color-text-muted)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.4s' }} />
      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
