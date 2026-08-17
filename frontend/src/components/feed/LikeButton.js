'use client';
import { useState } from 'react';
import { Heart } from 'lucide-react';

export default function LikeButton({ initialLikes, initialLiked }) {
  const [likes, setLikes] = useState(initialLikes || 0);
  const [liked, setLiked] = useState(initialLiked || false);

  const toggleLike = () => {
    if (liked) {
      setLikes(l => l - 1);
    } else {
      setLikes(l => l + 1);
    }
    setLiked(!liked);
  };

  return (
    <button 
      onClick={toggleLike}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        color: liked ? 'var(--color-error)' : 'var(--color-text-muted)',
        transition: 'color 0.2s, transform 0.1s'
      }}
    >
      <Heart fill={liked ? 'currentColor' : 'none'} size={20} />
      <span>{likes}</span>
    </button>
  );
}
