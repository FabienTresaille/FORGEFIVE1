'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await api.auth.login({ email, password });
      if (data.token) {
        localStorage.setItem('token', data.token);
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page container flex items-center justify-center">
      <div className="card w-full" style={{ maxWidth: '400px' }}>
        <h1 className="text-center mb-md font-heading text-accent">ForgeFive</h1>
        <h2 className="text-center mb-lg">Connexion</h2>
        {error && <div style={{ color: 'var(--color-error)', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleLogin} className="flex flex-col gap-md">
          <div>
            <label className="text-sm text-muted">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-muted">Mot de passe</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary btn-full mt-sm">Se connecter</button>
        </form>
      </div>
    </div>
  );
}
