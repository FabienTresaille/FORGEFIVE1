import Card from '../ui/Card';

export default function AchievementCard({ achievement }) {
  return (
    <Card style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: achievement.unlocked ? 1 : 0.5 }}>
      <div style={{ fontSize: '2rem' }}>{achievement.icon || '🏆'}</div>
      <div>
        <h4 style={{ margin: 0 }}>{achievement.title}</h4>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{achievement.description}</p>
      </div>
    </Card>
  );
}
