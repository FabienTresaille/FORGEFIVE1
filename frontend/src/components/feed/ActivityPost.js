import { MessageCircle } from 'lucide-react';
import LikeButton from './LikeButton';
import Card from '../ui/Card';

export default function ActivityPost({ post }) {
  return (
    <Card style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-surface-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {post.user[0]}
          </div>
          <div>
            <div style={{ fontWeight: 'bold' }}>{post.user}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{post.time}</div>
          </div>
        </div>
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <h4 style={{ margin: '0 0 0.5rem 0' }}>{post.title}</h4>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 0 }}>
          {post.description}
        </p>
      </div>

      <div style={{ borderTop: '1px solid var(--color-surface-light)', paddingTop: '1rem', display: 'flex', gap: '1.5rem' }}>
        <LikeButton initialLikes={post.likes} initialLiked={post.liked} />
        <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
          <MessageCircle size={20} />
          <span>{post.comments}</span>
        </button>
      </div>
    </Card>
  );
}
