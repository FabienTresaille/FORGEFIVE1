export default function ChatBubble({ message }) {
  const isUser = message.sender === 'user';
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '1rem'
    }}>
      <div style={{
        maxWidth: '80%',
        padding: '0.75rem 1rem',
        borderRadius: '1rem',
        borderBottomRightRadius: isUser ? 0 : '1rem',
        borderBottomLeftRadius: !isUser ? 0 : '1rem',
        backgroundColor: isUser ? 'var(--color-surface-light)' : 'var(--color-surface)',
        color: isUser ? 'var(--color-text)' : 'var(--color-text)',
        border: !isUser ? '1px solid var(--color-accent)' : 'none'
      }}>
        {message.text}
      </div>
    </div>
  );
}
