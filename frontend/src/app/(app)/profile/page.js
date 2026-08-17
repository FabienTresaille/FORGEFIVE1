'use client';
import { useAuth } from '@/lib/auth';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import RankBadge from '@/components/gamification/RankBadge';
import StreakCounter from '@/components/gamification/StreakCounter';
import AchievementCard from '@/components/gamification/AchievementCard';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  const achievements = [
    { id: 1, title: 'First Steps', description: 'Complete your first workout', icon: '👟', unlocked: true },
    { id: 2, title: 'Century Club', description: 'Lift 100kg total volume', icon: '💯', unlocked: true },
    { id: 3, title: 'Consistency is Key', description: '30 day streak', icon: '🔥', unlocked: false },
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--color-surface-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
          {user?.name?.[0] || 'A'}
        </div>
        <div>
          <h2 style={{ margin: '0 0 0.5rem 0' }}>{user?.name || 'Athlete'}</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <RankBadge rank="Silver" />
            <StreakCounter streak={5} />
          </div>
        </div>
      </div>

      <h3 style={{ marginBottom: '1rem' }}>Achievements</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {achievements.map(a => (
          <AchievementCard key={a.id} achievement={a} />
        ))}
      </div>

      <h3 style={{ marginBottom: '1rem' }}>Settings</h3>
      <Card style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Button variant="secondary">Edit Profile</Button>
        <Button variant="secondary" onClick={() => window.location.href = '/change-password'}>Change Password</Button>
        {user?.role === 'admin' && (
          <Button variant="secondary" onClick={() => window.location.href = '/admin'}>Admin Panel</Button>
        )}
        <Button variant="danger" onClick={logout}>Log Out</Button>
      </Card>
    </div>
  );
}
