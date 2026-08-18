'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function RecoveryPage() {
  const [todayEntry, setTodayEntry] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    sleep_quality: 3,
    soreness: 3,
    energy_level: 3
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [today, hist] = await Promise.all([
          api.recovery.getToday(),
          api.recovery.getHistory(7)
        ]);
        if (today) {
          setTodayEntry(today);
          setFormData({
            sleep_quality: today.sleep_quality || 3,
            soreness: today.soreness || 3,
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
    try {
      const entry = await api.recovery.create(formData);
      setTodayEntry(entry);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container page fade-in">
      <h1 className="mb-lg">Récupération du Jour</h1>

      <div className="card mb-lg card-elevated">
        <h2 className="mb-md text-lg">Journal du jour</h2>
        <div className="flex-col gap-md">
          
          <div>
            <div className="flex justify-between mb-sm">
              <label className="text-sm">Qualité du sommeil</label>
              <span className="text-accent font-mono">{formData.sleep_quality}/5</span>
            </div>
            <input 
              type="range" min="1" max="5" 
              value={formData.sleep_quality}
              onChange={(e) => handleChange('sleep_quality', parseInt(e.target.value))}
            />
          </div>

          <div>
            <div className="flex justify-between mb-sm">
              <label className="text-sm">Courbatures (5 = Aucune)</label>
              <span className="text-accent font-mono">{formData.soreness}/5</span>
            </div>
            <input 
              type="range" min="1" max="5" 
              value={formData.soreness}
              onChange={(e) => handleChange('soreness', parseInt(e.target.value))}
            />
          </div>

          <div>
            <div className="flex justify-between mb-sm">
              <label className="text-sm">Niveau d'énergie</label>
              <span className="text-accent font-mono">{formData.energy_level}/5</span>
            </div>
            <input 
              type="range" min="1" max="5" 
              value={formData.energy_level}
              onChange={(e) => handleChange('energy_level', parseInt(e.target.value))}
            />
          </div>

          <button 
            className="btn btn-primary w-full mt-md" 
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>

      {todayEntry && (
        <div className="card mb-lg" style={{ borderLeft: '4px solid var(--color-accent)' }}>
          <h3 className="mb-sm flex items-center gap-sm text-accent">
            🤖 Recommandation IA
          </h3>
          <p className="text-sm text-muted">
            {todayEntry.recommendation || "Votre récupération est optimale. Vous êtes prêt pour une séance intense aujourd'hui !"}
          </p>
        </div>
      )}

      <section>
        <h3 className="mb-md">Historique (7 derniers jours)</h3>
        {loading ? (
          <div className="skeleton" style={{ height: '150px', borderRadius: 'var(--radius-md)' }}></div>
        ) : history.length > 0 ? (
          <div className="flex gap-sm" style={{ height: '150px', alignItems: 'flex-end', paddingTop: '20px', paddingBottom: '20px' }}>
            {history.map((day, i) => {
              const score = ((day.sleep_quality + day.soreness + day.energy_level) / 15) * 100;
              return (
                <div key={i} className="flex-col items-center" style={{ flex: 1, gap: '8px' }}>
                  <div style={{ 
                    width: '100%', 
                    height: `${score}%`, 
                    backgroundColor: score > 70 ? 'var(--color-success)' : score > 40 ? 'var(--color-warning)' : 'var(--color-error)',
                    borderRadius: '4px',
                    minHeight: '10px'
                  }}></div>
                  <span className="text-xs text-muted">{new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' })}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-muted">Aucun historique disponible.</div>
        )}
      </section>
    </div>
  );
}
