'use client';
import { useState } from 'react';
import ProgressChart from '@/components/charts/ProgressChart';
import BodyGraph from '@/components/charts/BodyGraph';
import Card from '@/components/ui/Card';
import Tabs from '@/components/ui/Tabs';

export default function ProgressPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'exercises', label: 'Exercises' }
  ];

  const mockData = [
    { date: 'Mon', volume: 12000 },
    { date: 'Tue', volume: 15000 },
    { date: 'Wed', volume: 13500 },
    { date: 'Thu', volume: 18000 },
    { date: 'Fri', volume: 14000 },
    { date: 'Sat', volume: 19500 },
    { date: 'Sun', volume: 22000 },
  ];

  return (
    <div>
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      
      {activeTab === 'overview' ? (
        <div className="animate-slide-up">
          <Card style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Total Volume (7 Days)</h3>
            <ProgressChart data={mockData} dataKey="volume" />
          </Card>
          
          <Card>
            <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>Muscle Heatmap</h3>
            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Based on last 30 days of volume</p>
            <BodyGraph heatMap={{ chest: 85, arms: 45, legs: 10, abs: 0 }} />
          </Card>
        </div>
      ) : (
        <div className="animate-slide-up">
          <Card>
            <h3 style={{ marginBottom: '1rem' }}>Bench Press (1RM)</h3>
            <ProgressChart data={mockData.map(d => ({ date: d.date, weight: d.volume / 150 }))} dataKey="weight" />
          </Card>
        </div>
      )}
    </div>
  );
}
