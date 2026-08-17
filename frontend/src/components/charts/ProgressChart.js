'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ProgressChart({ data, dataKey = "volume" }) {
  if (!data || data.length === 0) return <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>No data available</div>;

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-surface-light)" />
          <XAxis dataKey="date" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--color-surface)', border: 'none', borderRadius: '8px', color: 'var(--color-text)' }}
            itemStyle={{ color: 'var(--color-accent)' }}
          />
          <Line type="monotone" dataKey={dataKey} stroke="var(--color-accent)" strokeWidth={3} dot={{ r: 4, fill: 'var(--color-surface)', strokeWidth: 2 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
