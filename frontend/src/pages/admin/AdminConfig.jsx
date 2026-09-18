import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { useConfigStore } from '../../stores/useConfigStore';
import { db } from '../../lib/db';
import { useTranslation } from '../../i18n/useTranslation';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import PageTransition from '../../components/layout/PageTransition';
import Tooltip from '../../components/ui/Tooltip';

const AdminConfig = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();
  const { config, loadConfig, updateConfig } = useConfigStore();
  const { t } = useTranslation();

  const [multiplier, setMultiplier] = useState(10);
  const [endDate, setEndDate] = useState('');
  const [freeShipping, setFreeShipping] = useState(100);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/login', { replace: true });
      return;
    }

    const fetchConfig = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/config`);
        if (!response.ok) throw new Error('Failed to fetch config');
        const data = await response.json();
        
        if (data.configs) {
          const configMap = {};
          data.configs.forEach(c => configMap[c.key] = c.value);
          setMultiplier(configMap.global_multiplier || 10);
          setFreeShipping(configMap.free_shipping_threshold || 100);
        }
        
        if (data.activeGiveaway) {
          setEndDate(data.activeGiveaway.end_date ? data.activeGiveaway.end_date.slice(0, 16) : '');
        }
      } catch (error) {
        console.error('Error fetching admin config:', error);
      }
    };
    
    fetchConfig();
  }, [isAdmin, navigate]);

  const handleSave = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/admin/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          configs: {
            free_shipping_threshold: parseInt(freeShipping)
          },
          giveaway: {
            end_date: endDate ? new Date(endDate).toISOString().slice(0, 19).replace('T', ' ') : null,
          }
        })
      });

      // Update global config store
      updateConfig({
        freeShippingThreshold: parseInt(freeShipping),
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving config:', error);
    }
  };

  const handleResetDB = () => {
    if (window.confirm('⚠️ Reset DB on API is not fully automated yet. Check migrations.')) {
      alert('Functionality disabled for API version. Run migrate:refresh instead.');
    }
  };

  return (
    <PageTransition className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/admin')} className="hover:bg-white/10 p-2 rounded-full transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-sm font-bold uppercase tracking-wider font-mono text-red-400">
            [ CONFIG // SYSTEM ]
          </h1>
          <div className="w-10" />
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-black italic uppercase text-white mb-8">
          {t('admin.config')}
        </h1>

        <div className="flex flex-col gap-4 md:gap-6">
          {/* Entry Multiplier Notice */}
          <div className="bg-primary/5 border border-primary/20 p-4 md:p-6 rounded-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-primary text-sm">tune</span>
                  <h2 className="text-sm font-bold uppercase text-white font-mono mb-0">Multiplicadores por Producto (Individuales)</h2>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed max-w-xl font-mono">
                  El multiplicador global ha sido reemplazado por la configuración individual por artículo. Cada producto puede activar su propio multiplicador (ej. 2x, 5x, 10x, 20x) desde el catálogo. Los productos normales aplican la tasa base de 1 boleto por cada $1 USD.
                </p>
              </div>
              <button
                onClick={() => navigate('/admin/products')}
                className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 font-mono text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-sm">inventory_2</span>
                Gestionar Productos
              </button>
            </div>
          </div>

          {/* Giveaway End Date */}
          <div className="bg-white/5 border border-white/10 p-4 md:p-6 rounded-xl">
            <Tooltip content="Fecha de término del sorteo actual. Controla el temporizador (Countdown) global." position="bottom">
              <div className="flex items-center gap-1 cursor-help mb-4 w-max">
                <h2 className="text-sm font-bold uppercase text-gray-400 mb-0">{t('admin.giveawayEnd')}</h2>
                <span className="material-symbols-outlined text-[14px] text-gray-500 hover:text-primary transition-colors">help</span>
              </div>
            </Tooltip>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full h-12 px-4 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
            />
          </div>



          {/* Free Shipping Threshold */}
          <div className="bg-white/5 border border-white/10 p-4 md:p-6 rounded-xl">
            <Tooltip content="Monto mínimo en el carrito para obtener envío gratis." position="bottom">
              <div className="flex items-center gap-1 cursor-help mb-4 w-max">
                <h2 className="text-sm font-bold uppercase text-gray-400 mb-0">Free Shipping Threshold</h2>
                <span className="material-symbols-outlined text-[14px] text-gray-500 hover:text-primary transition-colors">help</span>
              </div>
            </Tooltip>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">$</span>
              <Input
                type="number"
                value={freeShipping}
                onChange={(e) => setFreeShipping(e.target.value)}
                className="flex-1"
              />
              <span className="text-gray-400 text-xs uppercase">USD</span>
            </div>
          </div>

          {/* Save */}
          <Button onClick={handleSave} size="lg" className="w-full">
            {saved ? '✓ Saved!' : t('admin.saveConfig')}
          </Button>

          {/* Danger Zone */}
          <div className="border border-red-500/20 rounded-xl p-6 mt-8">
            <h2 className="text-sm font-bold uppercase text-red-400 mb-4">⚠️ Danger Zone</h2>
            <p className="text-gray-500 text-xs font-mono mb-4">
              Reset all data to factory defaults. This clears all orders, users, and entries from localStorage.
            </p>
            <Button variant="danger" size="sm" onClick={handleResetDB}>
              Reset Database
            </Button>
          </div>
        </div>
      </main>
    </PageTransition>
  );
};

export default AdminConfig;
