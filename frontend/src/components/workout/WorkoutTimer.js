import { useState, useEffect } from 'react';

export default function WorkoutTimer({ isActive, initialTime = 0 }) {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      fontFamily: 'var(--font-heading)',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: 'var(--color-accent)'
    }}>
      {formatTime(time)}
    </div>
  );
}
