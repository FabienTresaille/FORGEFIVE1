'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function OnboardingPage() {
  const router = useRouter();
  const { setUser, user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    weight_kg: 70,
    height_cm: 175,
    goal: 'Remise en forme',
    weekly_frequency: 3,
    session_duration_minutes: 60
  });

  const goals = [
    { id: 'Prise de masse', icon: '💪', label: 'Prise de masse' },
    { id: 'Perte de poids', icon: '🔥', label: 'Perte de poids' },
    { id: 'Gain de force', icon: '⚡', label: 'Gain de force' },
    { id: 'Endurance', icon: '🏃', label: 'Endurance' },
    { id: 'Remise en forme', icon: '🧘', label: 'Remise en forme' }
  ];

  const durations = [30, 45, 60, 90];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await api.auth.onboarding(formData);
      if (response && response.user) {
        setUser(response.user);
      } else {
        // Fallback update
        setUser({ ...user, onboarding_completed: true, ...formData });
      }
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      alert('Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page fade-in">
      <div className="card card-elevated" style={{ textAlign: 'center' }}>
        <h1 className="font-heading mb-md">Bienvenue sur ForgeFive</h1>
        <p className="text-muted mb-lg">Configurons votre profil pour un entraînement optimal.</p>

        <div className="flex justify-center gap-sm mb-lg">
          {[1, 2, 3].map(s => (
            <div 
              key={s} 
              style={{
                width: s === step ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: s === step ? 'var(--color-accent)' : 'var(--color-surface)',
                transition: 'all var(--transition)'
              }}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="animate-slide-up">
            <h2 className="mb-md">Vos mensurations</h2>
            <div className="flex-col gap-md">
              <div style={{ textAlign: 'left' }}>
                <label className="text-sm text-muted">Poids (kg): {formData.weight_kg}</label>
                <input 
                  type="range" 
                  min="40" max="150" 
                  value={formData.weight_kg}
                  onChange={(e) => handleChange('weight_kg', parseInt(e.target.value))}
                  style={{ marginTop: '8px' }}
                />
              </div>
              <div style={{ textAlign: 'left' }}>
                <label className="text-sm text-muted">Taille (cm): {formData.height_cm}</label>
                <input 
                  type="range" 
                  min="140" max="220" 
                  value={formData.height_cm}
                  onChange={(e) => handleChange('height_cm', parseInt(e.target.value))}
                  style={{ marginTop: '8px' }}
                />
              </div>
            </div>
            <button className="btn btn-primary btn-full mt-lg" onClick={() => setStep(2)}>Suivant</button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-slide-up">
            <h2 className="mb-md">Votre objectif principal</h2>
            <div className="flex-col gap-sm">
              {goals.map(g => (
                <button
                  key={g.id}
                  className={`btn ${formData.goal === g.id ? 'btn-primary' : 'btn-secondary'} w-full`}
                  style={{ justifyContent: 'flex-start', padding: '16px' }}
                  onClick={() => handleChange('goal', g.id)}
                >
                  <span style={{ fontSize: '1.25rem' }}>{g.icon}</span>
                  <span style={{ marginLeft: '12px' }}>{g.label}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-md mt-lg">
              <button className="btn btn-secondary flex-1" onClick={() => setStep(1)} style={{flex: 1}}>Retour</button>
              <button className="btn btn-primary flex-1" onClick={() => setStep(3)} style={{flex: 1}}>Suivant</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-slide-up">
            <h2 className="mb-md">Votre rythme</h2>
            
            <div className="mb-lg" style={{ textAlign: 'left' }}>
              <label className="text-sm text-muted mb-sm" style={{ display: 'block' }}>
                Fréquence hebdomadaire: {formData.weekly_frequency} séances
              </label>
              <input 
                type="range" 
                min="2" max="6" 
                value={formData.weekly_frequency}
                onChange={(e) => handleChange('weekly_frequency', parseInt(e.target.value))}
              />
            </div>

            <div style={{ textAlign: 'left' }}>
              <label className="text-sm text-muted mb-sm" style={{ display: 'block' }}>
                Durée des séances
              </label>
              <div className="grid-2">
                {durations.map(d => (
                  <button
                    key={d}
                    className={`btn ${formData.session_duration_minutes === d ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handleChange('session_duration_minutes', d)}
                  >
                    {d} min
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-md mt-lg">
              <button className="btn btn-secondary flex-1" onClick={() => setStep(2)} style={{flex: 1}}>Retour</button>
              <button 
                className="btn btn-primary flex-1" 
                onClick={handleSubmit} 
                disabled={loading}
                style={{flex: 1}}
              >
                {loading ? 'Chargement...' : 'Terminer'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
