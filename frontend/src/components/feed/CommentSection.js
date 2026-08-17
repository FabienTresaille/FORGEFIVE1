import Card from '../ui/Card';

export default function CommentSection({ comments }) {
  return (
    <div style={{ marginTop: '1rem', borderTop: '1px solid var(--color-surface-light)', paddingTop: '1rem' }}>
      {comments.map(c => (
        <div key={c.id} style={{ marginBottom: '0.75rem' }}>
          <span style={{ fontWeight: 'bold', marginRight: '0.5rem', fontSize: '0.85rem' }}>{c.user}</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text)' }}>{c.text}</span>
        </div>
      ))}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <input 
          type="text" 
          placeholder="Add a comment..." 
          style={{ flex: 1, background: 'var(--color-primary)', border: '1px solid var(--color-surface-light)', borderRadius: '4px', padding: '0.5rem', color: 'white' }} 
        />
        <button style={{ color: 'var(--color-accent)', fontWeight: 'bold', padding: '0 0.5rem' }}>Post</button>
      </div>
    </div>
  );
}
