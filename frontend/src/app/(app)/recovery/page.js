'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function RecoveryPage() {
  const [todayEntry, setTodayEntry] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    sleep_hours: 8,
    sleep_quality: 3,
    soreness_level: 3,
    energy_level: 3
  });

  useEffect(() => {
    async function loadData() {
      try {
        const today = await api.recovery.getToday().catch(() => null);
        const hist = await api.recovery.getHistory(7).catch(() => []);
        
        if (today) {
          setTodayEntry(today);
          setFormData({
            sleep_hours: today.sleep_hours || 8,
            sleep_quality: today.sleep_quality || 3,
            soreness_level: today.soreness_level || today.soreness || 3,
            energy_level: today.energy_level || 3
          });
        }
        setHistory(hist || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const payload = {
        sleep_hours: parseInt(formData.sleep_hours) || 8,
        sleep_quality: parseInt(formData.sleep_quality) || 3,
        soreness_level: parseInt(formData.soreness_level) || 3,
        energy_level: parseInt(formData.energy_level) || 3
      };

      const entry = await api.recovery.create(payload);
      if (entry) {
        setTodayEntry(entry);
        setSuccessMessage('✅ Vos données de récupération ont été enregistrées avec succès !');
        // Refresh history
        const updatedHistory = await api.recovery.getHistory(7).catch(() => []);
        setHistory(updatedHistory || []);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container page fade-in">
      <h1 className="mb-lg">Récupération du Jour</h1>

      {successMessage && (
        <div style={{
          background: 'rgba(0, 230, 118, 0.15)',
          border: '1px solid var(--color-success)',
          color: 'var(--color-success)',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '20px',
          fontWeight: 500,
          fontSize: '0.9rem'
        }}>
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div style={{
          background: 'rgba(255, 82, 82, 0.15)',
          border: '1px solid var(--color-error)',
          color: 'var(--color-error)',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '20px',
          fontSize: '0.9rem'
        }}>
          {errorMessage}
        </div>
      )}

      <div className="card mb-lg card-elevated">
        <h2 className="mb-md text-lg">Journal de forme du jour</h2>
        <div className="flex-col gap-md">
          
          {/* Sommeil en heures */}
          <div>
            <div className="flex justify-between mb-sm">
              <label className="text-sm">Durée du sommeil</label>
              <span className="text-accent font-mono">{formData.sleep_hours}h</span>
            </div>
            <input 
              type="range" min="4" max="12" step="1"
              value={formData.sleep_hours}
              onChange={(e) => handleChange('sleep_hours', parseInt(e.target.value))}
            />
          </div>

          {/* Qualité du sommeil */}
          <div>
            <div className="flex justify-between mb-sm">
              <label className="text-sm">Qualité du sommeil (1 à 5)</label>
              <span className="text-accent font-mono">{formData.sleep_quality}/5</span>
            </div>
            <input 
              type="range" min="1" max="5" 
              value={formData.sleep_quality}
              onChange={(e) => handleChange('sleep_quality', parseInt(e.target.value))}
            />
          </div>

          {/* Courbatures */}
          <div>
            <div className="flex justify-between mb-sm">
              <label className="text-sm">Niveau de courbatures (5 = Aucune, 1 = Fortes)</label>
              <span className="text-accent font-mono">{formData.soreness_level}/5</span>
            </div>
            <input 
              type="range" min="1" max="5" 
              value={formData.soreness_level}
              onChange={(e) => handleChange('soreness_level', parseInt(e.target.value))}
            />
          </div>

          {/* Énergie */}
          <div>
            <div className="flex justify-between mb-sm">
              <label className="text-sm">Niveau d'énergie (1 à 5)</label>
              <span className="text-accent font-mono">{formData.energy_level}/5</span>
            </div>
            <input 
              type="range" min="1" max="5" 
              value={formData.energy_level}
              onChange={(e) => handleChange('energy_level', parseInt(e.target.value))}
            />
          </div>

          <button 
            className="btn btn-primary w-full mt-md text-lg" 
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? 'Enregistrement en cours...' : 'Enregistrer ma récupération'}
          </button>
        </div>
      </div>

      {todayEntry && (
        <div className="card mb-lg" style={{ borderLeft: '4px solid var(--color-accent)' }}>
          <h3 className="mb-sm flex items-center gap-sm text-accent">
            🤖 Recommandation Coach IA
          </h3>
          <p className="text-sm text-muted">
            {todayEntry.ai_recommendation || todayEntry.recommendation || "Votre récupération est optimale. Vous êtes prêt pour une séance intense aujourd'hui !"}
          </p>
        </div>
      )}

      <section>
        <h3 className="mb-md">Historique (7 derniers jours)</h3>
        {loading ? (
          <div className="skeleton" style={{ height: '120px', borderRadius: 'var(--radius-md)' }}></div>
        ) : history.length > 0 ? (
          <div className="flex gap-sm" style={{ height: '140px', alignItems: 'flex-end', paddingTop: '20px', paddingBottom: '20px' }}>
            {history.map((day, i) => {
              const score = (((day.sleep_quality || 3) + (day.soreness_level || 3) + (day.energy_level || 3)) / 15) * 100;
              return (
                <div key={i} className="flex-col items-center" style={{ flex: 1, gap: '8px' }}>
                  <div style={{ 
                    width: '100%', 
                    height: `${Math.max(15, score)}%`, 
                    backgroundColor: score >= 65 ? 'var(--color-success)' : score >= 45 ? 'var(--color-warning)' : 'var(--color-error)',
                    borderRadius: '4px',
                    minHeight: '10px'
                  }}></div>
                  <span className="text-xs text-muted">
                    {day.date ? new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' }) : `J-${i}`}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card text-center text-muted" style={{ padding: '24px' }}>
            Aucun historique de récupération enregistré.
          </div>
        )}
      </section>
    </div>
  );
}
