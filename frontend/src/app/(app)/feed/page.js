'use client';
import ActivityPost from '@/components/feed/ActivityPost';

export default function FeedPage() {
  const posts = [
    {
      id: 1,
      user: 'Alex M.',
      time: '2 hours ago',
      title: 'Morning Push Day',
      description: 'Hit a new PR on Bench Press (100kg x 5)! Feeling great.',
      likes: 12,
      liked: true,
      comments: 3
    },
    {
      id: 2,
      user: 'Sarah K.',
      time: '5 hours ago',
      title: 'Leg Day Annihilation',
      description: 'Squats and lunges until I couldn\'t walk.',
      likes: 8,
      liked: false,
      comments: 1
    }
  ];

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Activity Feed</h2>
      <div className="animate-slide-up">
        {posts.map(post => (
          <ActivityPost key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
