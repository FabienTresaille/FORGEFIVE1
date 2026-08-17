export default function BodyGraph({ heatMap = {} }) {
  // A simplified SVG silhouette mock. In a real app, this would be a detailed SVG with paths mapped to muscle groups.
  const getColor = (muscle) => {
    const intensity = heatMap[muscle] || 0;
    if (intensity > 80) return '#FF5252'; // high volume
    if (intensity > 40) return '#FF6D00'; // medium
    if (intensity > 0) return '#00E676'; // low
    return 'var(--color-surface-light)'; // none
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
      <svg width="200" height="300" viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Head */}
        <circle cx="100" cy="30" r="20" fill="var(--color-surface-light)" />
        {/* Chest */}
        <path d="M70 70 Q100 90 130 70 L130 110 Q100 130 70 110 Z" fill={getColor('chest')} stroke="var(--color-primary)" strokeWidth="2" />
        {/* Abs */}
        <rect x="80" y="115" width="40" height="50" rx="5" fill={getColor('abs')} stroke="var(--color-primary)" strokeWidth="2" />
        {/* Arms */}
        <rect x="40" y="70" width="25" height="60" rx="10" fill={getColor('arms')} stroke="var(--color-primary)" strokeWidth="2" />
        <rect x="135" y="70" width="25" height="60" rx="10" fill={getColor('arms')} stroke="var(--color-primary)" strokeWidth="2" />
        {/* Legs */}
        <rect x="75" y="170" width="22" height="100" rx="10" fill={getColor('legs')} stroke="var(--color-primary)" strokeWidth="2" />
        <rect x="103" y="170" width="22" height="100" rx="10" fill={getColor('legs')} stroke="var(--color-primary)" strokeWidth="2" />
      </svg>
    </div>
  );
}
