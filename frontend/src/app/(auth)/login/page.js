'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { api, setAuthToken } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (auth && typeof auth.login === 'function') {
        await auth.login(email, password);
      } else {
        const res = await api.auth.login({ email, password });
        if (res.access_token) {
          setAuthToken(res.access_token);
          if (res.refresh_token) {
            localStorage.setItem('refresh_token', res.refresh_token);
          }
          const userData = res.user || {
            email,
            must_change_password: res.must_change_password || false,
            role: res.role || 'user',
            display_name: res.display_name || email.split('@')[0]
          };
          localStorage.setItem('user', JSON.stringify(userData));
          if (auth && auth.setUser) auth.setUser(userData);

          if (userData.must_change_password) {
            router.push('/change-password');
          } else {
            router.push('/dashboard');
          }
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page container flex items-center justify-center" style={{ minHeight: '100dvh', padding: '16px' }}>
      <div className="card w-full" style={{ maxWidth: '400px', padding: '32px' }}>
        <h1 className="text-center mb-sm font-heading text-accent" style={{ fontSize: '2rem' }}>ForgeFive</h1>
        <p className="text-center text-muted mb-lg" style={{ fontSize: '0.9rem' }}>Suivi & Performances Sportives</p>
        
        {error && (
          <div style={{ 
            background: 'rgba(255, 82, 82, 0.1)', 
            border: '1px solid var(--color-error)', 
            color: 'var(--color-error)', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '20px', 
            textAlign: 'center',
            fontSize: '0.875rem' 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-md">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label className="text-sm text-muted">Adresse Email</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="admin@example.com"
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label className="text-sm text-muted">Mot de passe</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-full mt-sm" 
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
