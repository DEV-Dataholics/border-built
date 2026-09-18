import React, { useState, useEffect } from 'react';
import Tooltip from '../../components/ui/Tooltip';
import { db } from '../../lib/db';

const GiveawayBreakEvenWidget = () => {
  const [giveaway, setGiveaway] = useState(null);
  const [loading, setLoading] = useState(true);
  const [multiplier, setMultiplier] = useState(10);

  useEffect(() => {
    const fetchActiveGiveaway = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/giveaways/active`);
        if (!response.ok) throw new Error('No active giveaway');
        const data = await response.json();
        setGiveaway(data);
      } catch (error) {
        console.warn('Error fetching active giveaway API, using local db fallback:', error);
        const active = db.findMany('giveaways', { status: 'active' })[0] || db.getCollection('giveaways')[0];
        if (active) {
          const orders = db.getCollection('orders');
          const totalRev = orders.reduce((sum, o) => sum + (parseFloat(o.total || o.total_amount) || 0), 0);
          setGiveaway({ ...active, current_revenue: totalRev });
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchConfig = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/config`);
        if (response.ok) {
          const data = await response.json();
          if (data.configs) {
            const configMap = {};
            data.configs.forEach(c => configMap[c.key] = c.value);
            if (configMap.global_multiplier) {
              setMultiplier(parseInt(configMap.global_multiplier));
            }
          }
        }
      } catch (error) {
        const cfg = db.getCollection('config');
        if (cfg.activeMultiplier) {
          setMultiplier(parseInt(cfg.activeMultiplier));
        }
      }
    };

    fetchActiveGiveaway();
    fetchConfig();
  }, []);

  if (loading) return <div className="bg-white/5 border border-primary/20 p-6 rounded-xl mb-8 animate-pulse h-32"></div>;
  if (!giveaway) return null;

  const giveawayName = giveaway.name || `${giveaway.car_make || 'Nissan'} ${giveaway.car_model || '350Z'}`.trim();
  const prizeCost = parseFloat(giveaway.prize_cost || giveaway.prizeCost) || 15000;
  const averageMargin = parseFloat(giveaway.average_margin || giveaway.averageMargin) || 0.50;
  const currentRevenue = parseFloat(giveaway.current_revenue) || 0;

  const breakEvenRevenueTarget = prizeCost / averageMargin;
  const progressPercentage = Math.min((currentRevenue / breakEvenRevenueTarget) * 100, 100);
  
  // Calculate Profit & Remaining Target
  const estimatedProfit = (currentRevenue * averageMargin) - prizeCost;
  const isProfitable = estimatedProfit >= 0;
  const remainingRevenue = Math.max(breakEvenRevenueTarget - currentRevenue, 0);

  const activeMultiplier = parseInt(giveaway.active_multiplier || giveaway.entryMultiplier || multiplier);
  const entriesTarget = Math.round(breakEvenRevenueTarget * activeMultiplier);
  const currentEntries = (giveaway.total_entries_sold !== undefined && giveaway.total_entries_sold !== null)
    ? parseInt(giveaway.total_entries_sold)
    : Math.round(currentRevenue * activeMultiplier);

  return (
    <div className="bg-white/5 border border-primary/20 p-6 rounded-xl mb-8">
      <h2 className="text-lg font-bold uppercase italic text-white mb-4 border-l-4 border-primary pl-3">
        Active Giveaway: {giveawayName}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-4">
        <div>
          <Tooltip content="Costo total de adquisición y preparación del premio." position="bottom">
            <p className="text-gray-500 text-xs uppercase cursor-help border-b border-dashed border-gray-600 inline-block">Prize Cost</p>
          </Tooltip>
          <p className="text-white font-mono font-bold">${prizeCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div>
          <Tooltip content={`Ingreso necesario para recuperar el costo del premio (basado en un margen del ${(averageMargin*100).toFixed(0)}%).`} position="bottom">
            <p className="text-gray-500 text-xs uppercase cursor-help border-b border-dashed border-gray-600 inline-block">Break-Even Target</p>
          </Tooltip>
          <p className="text-yellow-400 font-mono font-bold">${breakEvenRevenueTarget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div>
          <Tooltip content="Ventas brutas reales generadas acumuladas durante este sorteo." position="bottom">
            <p className="text-gray-500 text-xs uppercase cursor-help border-b border-dashed border-gray-600 inline-block">Current Revenue</p>
          </Tooltip>
          <p className="text-white font-mono font-bold">${currentRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div>
          <Tooltip content="(Ingresos x Margen Promedio) - Costo del Premio." position="bottom">
            <p className="text-gray-500 text-xs uppercase cursor-help border-b border-dashed border-gray-600 inline-block">Est. Profit / Deficit</p>
          </Tooltip>
          <p className={`font-mono font-bold ${isProfitable ? 'text-primary' : 'text-red-400'}`}>
            ${estimatedProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div>
          <Tooltip content="Boletos generados reales vs Boletos necesarios para Break-Even." position="bottom">
            <p className="text-gray-500 text-xs uppercase cursor-help border-b border-dashed border-gray-600 inline-block">Entries (Act/Obj)</p>
          </Tooltip>
          <p className="text-gray-300 font-mono font-bold text-xs mt-1">
            {currentEntries.toLocaleString()} / {entriesTarget.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="mt-4 h-2.5 bg-black rounded-full overflow-hidden border border-white/10 relative">
        <div 
          className={`h-full transition-all duration-1000 ${isProfitable ? 'bg-primary shadow-[0_0_10px_#6af425]' : 'bg-yellow-400 shadow-[0_0_10px_#facc15]'}`}
          style={{ width: `${progressPercentage}%` }} 
        />
      </div>
      <div className="flex justify-between items-center mt-2 font-mono">
        <p className="text-[10px] text-gray-500 uppercase">
          Margen Promedio: {(averageMargin * 100).toFixed(1)}%
        </p>
        <p className="text-right text-[10px] text-gray-400 font-bold">
          {isProfitable 
            ? '🔥 BREAK-EVEN ALCANZADO — GENERANDO GANANCIAS' 
            : `${progressPercentage.toFixed(1)}% COMPLETADO — FALTAN $${remainingRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        </p>
      </div>
    </div>
  );
};

export default GiveawayBreakEvenWidget;
