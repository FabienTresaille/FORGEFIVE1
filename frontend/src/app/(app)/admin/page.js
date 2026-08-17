'use client';
import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function AdminPage() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Alex M', email: 'alex@example.com', role: 'user' },
    { id: 2, name: 'Sarah K', email: 'sarah@example.com', role: 'user' },
    { id: 3, name: 'Admin', email: 'admin@forgefive.com', role: 'admin' },
  ]);

  const [newUserEmail, setNewUserEmail] = useState('');

  const inviteUser = (e) => {
    e.preventDefault();
    if (newUserEmail) {
      alert(`Invitation sent to ${newUserEmail}`);
      setNewUserEmail('');
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Admin Dashboard</h2>
      
      <Card style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Invite User</h3>
        <form onSubmit={inviteUser} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <Input 
              label="Email Address" 
              type="email" 
              value={newUserEmail} 
              onChange={e => setNewUserEmail(e.target.value)} 
              required
            />
          </div>
          <Button type="submit" style={{ width: 'auto' }}>Send Invite</Button>
        </form>
      </Card>

      <h3 style={{ marginBottom: '1rem' }}>User Management</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {users.map(u => (
          <Card key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
            <div>
              <div style={{ fontWeight: 'bold' }}>{u.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{u.email}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ 
                fontSize: '0.75rem', 
                backgroundColor: u.role === 'admin' ? 'var(--color-secondary)' : 'var(--color-surface-light)',
                padding: '0.25rem 0.5rem',
                borderRadius: 'var(--border-radius-pill)',
                color: u.role === 'admin' ? 'white' : 'var(--color-text)'
              }}>
                {u.role}
              </span>
              <button style={{ color: 'var(--color-error)' }}>Revoke</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
