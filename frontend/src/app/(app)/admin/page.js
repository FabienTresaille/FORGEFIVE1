'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await api.admin.getUsers();
        setUsers(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await api.admin.createUser({ email, role: 'user' });
      alert('Invitation envoyée à ' + email);
      setEmail('');
      // refresh users
      const data = await api.admin.getUsers();
      setUsers(data || []);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l\'envoi');
    }
  };

  return (
    <div className="container page fade-in">
      <h1 className="mb-lg">Administration</h1>

      <div className="card mb-lg card-elevated">
        <h2 className="mb-md">Inviter un utilisateur</h2>
        <form onSubmit={handleInvite} className="flex-col gap-md">
          <input 
            type="email" 
            placeholder="Adresse email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary w-full">
            Envoyer l'invitation
          </button>
        </form>
      </div>

      <section>
        <h2 className="mb-md">Gestion des utilisateurs</h2>
        {loading ? (
          <div className="card skeleton" style={{ height: '200px' }}></div>
        ) : (
          <div className="flex-col gap-sm">
            {users.map(u => (
              <div key={u.id} className="card flex justify-between items-center" style={{ padding: '12px 16px' }}>
                <div>
                  <div className="font-heading">{u.email}</div>
                  <div className="text-xs text-muted">Rôle: {u.role}</div>
                </div>
                {u.role !== 'admin' && (
                  <button className="btn btn-danger text-xs" style={{ padding: '6px 12px', minHeight: 'auto' }}>
                    Révoquer
                  </button>
                )}
              </div>
            ))}
            {users.length === 0 && <div className="text-muted text-center">Aucun utilisateur.</div>}
          </div>
        )}
      </section>
    </div>
  );
}
