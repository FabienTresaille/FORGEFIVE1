'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await api.feed.getAll();
        setPosts(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      await api.feed.like(postId);
      // Optimistic update
      setPosts(posts.map(p => p.id === postId ? { ...p, likes: (p.likes || 0) + 1, liked_by_me: true } : p));
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddComment = async (postId) => {
    const content = commentInputs[postId];
    if (!content) return;
    try {
      const newComment = await api.feed.addComment(postId, content);
      setPosts(posts.map(p => {
        if (p.id === postId) {
          return { ...p, comments: [...(p.comments || []), newComment || { id: Date.now(), content }] };
        }
        return p;
      }));
      setCommentInputs({ ...commentInputs, [postId]: '' });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container page fade-in">
      <h1 className="mb-lg">Fil d'Activité</h1>

      {loading ? (
        <div className="flex-col gap-md">
          <div className="card skeleton" style={{ height: '200px' }}></div>
          <div className="card skeleton" style={{ height: '200px' }}></div>
        </div>
      ) : posts.length > 0 ? (
        <div className="flex-col gap-lg">
          {posts.map(post => (
            <div key={post.id} className="card card-elevated">
              <div className="flex justify-between items-center mb-md">
                <div className="flex items-center gap-sm">
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {post.user_name?.substring(0, 2).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h3 className="font-heading" style={{ fontSize: '1rem', margin: 0 }}>{post.user_name}</h3>
                    <span className="text-xs text-muted">{new Date(post.created_at).toLocaleString('fr-FR')}</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-md">
                <h4 className="font-heading mb-xs">{post.workout_title}</h4>
                <p className="text-sm">{post.description}</p>
              </div>

              <div className="flex gap-md mb-md" style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: '12px 0' }}>
                <button 
                  className={`btn ${post.liked_by_me ? 'text-accent' : 'text-muted'}`} 
                  style={{ background: 'transparent', padding: 0, minHeight: 'auto' }}
                  onClick={() => handleLike(post.id)}
                >
                  ❤️ {post.likes || 0} J'aime
                </button>
                <span className="text-muted">💬 {post.comments?.length || 0} Commentaires</span>
              </div>

              <div className="flex-col gap-sm mb-md">
                {post.comments?.map(comment => (
                  <div key={comment.id} className="text-sm">
                    <strong>{comment.user_name || 'Utilisateur'}</strong>: {comment.content}
                  </div>
                ))}
              </div>

              <div className="flex gap-sm">
                <input 
                  type="text" 
                  placeholder="Ajouter un commentaire..." 
                  value={commentInputs[post.id] || ''}
                  onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                  style={{ flex: 1, padding: '8px 12px', fontSize: '0.875rem' }}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                />
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '8px 16px', minHeight: 'auto' }}
                  onClick={() => handleAddComment(post.id)}
                >
                  Envoyer
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center text-muted">
          Aucune activité pour le moment.
        </div>
      )}
    </div>
  );
}
