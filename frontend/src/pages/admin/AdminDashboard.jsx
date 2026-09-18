import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { useTranslation } from '../../i18n/useTranslation';
import PageTransition from '../../components/layout/PageTransition';
import Tooltip from '../../components/ui/Tooltip';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts';
import GiveawayBreakEvenWidget from './GiveawayBreakEvenWidget';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();
  const { t } = useTranslation();
  const [stats, setStats] = useState({});
  const [range, setRange] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/login', { replace: true });
      return;
    }

    const fetchStats = async () => {
      try {
        let url = `${import.meta.env.VITE_API_URL}/admin/dashboard?range=${range}`;
        if (range === 'custom') {
          if (startDate) url += `&start_date=${startDate}`;
          if (endDate) url += `&end_date=${endDate}`;
        }
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        
        setStats(data);
      } catch (error) {
        console.error('Error fetching admin dashboard stats:', error);
      }
    };

    fetchStats();
  }, [isAdmin, navigate, range, startDate, endDate]);

  return (
    <PageTransition className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="hover:bg-white/10 p-2 rounded-full transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-sm font-bold uppercase tracking-wider font-mono text-red-400">
            [ ADMIN // PANEL ]
          </h1>
          <button 
            onClick={() => {
              useAuthStore.getState().logout();
              navigate('/login');
            }}
            className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors"
          >
            <span className="text-xs font-bold uppercase tracking-wider">Logout</span>
            <span className="material-symbols-outlined text-sm">logout</span>
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-black italic uppercase text-white">
            {t('admin.dashboard')}
          </h1>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {range === 'custom' && (
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-1.5 rounded-lg">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-black/60 border border-white/15 rounded px-2 py-1 text-xs text-white font-mono focus:border-primary focus:outline-none"
                  style={{ colorScheme: 'dark' }}
                />
                <span className="text-gray-500 text-xs font-mono">-</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-black/60 border border-white/15 rounded px-2 py-1 text-xs text-white font-mono focus:border-primary focus:outline-none"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            )}
            <select 
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm font-bold uppercase outline-none focus:border-primary w-full sm:w-auto"
            >
              <option value="today" className="bg-[#121212]">{t('admin.today')}</option>
              <option value="7days" className="bg-[#121212]">{t('admin.last7days')}</option>
              <option value="month" className="bg-[#121212]">{t('admin.thisMonth')}</option>
              <option value="all" className="bg-[#121212]">{t('admin.allTime')}</option>
              <option value="custom" className="bg-[#121212]">{t('admin.customRange')}</option>
            </select>
          </div>
        </div>

        {/* Stats Grid - Dynamic Responsive Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-8">
          {/* Total Users */}
          <div className="bg-white/5 border border-white/10 hover:border-white/20 p-3.5 sm:p-4 rounded-xl min-w-0 flex flex-col justify-between transition-all hover:bg-white/[0.08]">
            <Tooltip content="Cantidad total de usuarios registrados en la base de datos." position="bottom">
              <div className="flex items-center justify-between cursor-help mb-2 min-w-0">
                <p className="text-gray-400 text-[10px] sm:text-[11px] uppercase tracking-wider font-bold mb-0 truncate">
                  {t('admin.totalUsers')}
                </p>
                <span className="material-symbols-outlined text-[14px] text-gray-500 hover:text-primary transition-colors shrink-0">help</span>
              </div>
            </Tooltip>
            <p className="text-xl sm:text-2xl lg:text-3xl font-black font-mono text-white tracking-tight truncate" title={stats.totalUsers || 0}>
              {stats.totalUsers || 0}
            </p>
          </div>

          {/* Total Entries */}
          <div className="bg-white/5 border border-white/10 hover:border-primary/40 p-3.5 sm:p-4 rounded-xl min-w-0 flex flex-col justify-between transition-all hover:bg-white/[0.08]">
            <Tooltip content="Boletos totales generados (acumulando compras + multiplicadores)." position="bottom">
              <div className="flex items-center justify-between cursor-help mb-2 min-w-0">
                <p className="text-gray-400 text-[10px] sm:text-[11px] uppercase tracking-wider font-bold mb-0 truncate">
                  {t('admin.totalEntries')}
                </p>
                <span className="material-symbols-outlined text-[14px] text-gray-500 hover:text-primary transition-colors shrink-0">help</span>
              </div>
            </Tooltip>
            <p className="text-xl sm:text-2xl lg:text-3xl font-black font-mono text-primary tracking-tight truncate" title={(stats.totalEntries || 0).toLocaleString()}>
              {(stats.totalEntries || 0).toLocaleString()}
            </p>
          </div>

          {/* Total Revenue */}
          <div className="bg-white/5 border border-white/10 hover:border-emerald-500/40 p-3.5 sm:p-4 rounded-xl min-w-0 flex flex-col justify-between transition-all hover:bg-white/[0.08]">
            <Tooltip content="Suma total de dinero en USD de todas las órdenes procesadas." position="bottom">
              <div className="flex items-center justify-between cursor-help mb-2 min-w-0">
                <p className="text-gray-400 text-[10px] sm:text-[11px] uppercase tracking-wider font-bold mb-0 truncate">
                  {t('admin.totalRevenue')}
                </p>
                <span className="material-symbols-outlined text-[14px] text-gray-500 hover:text-primary transition-colors shrink-0">help</span>
              </div>
            </Tooltip>
            <p className="text-lg sm:text-xl lg:text-2xl xl:text-2xl 2xl:text-3xl font-black font-mono text-white tracking-tight truncate" title={`$${(stats.totalRevenue || 0).toFixed(2)}`}>
              <span className="text-emerald-400 text-xs sm:text-sm mr-0.5">$</span>
              {(stats.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          {/* Orders */}
          <div className="bg-white/5 border border-white/10 hover:border-white/20 p-3.5 sm:p-4 rounded-xl min-w-0 flex flex-col justify-between transition-all hover:bg-white/[0.08]">
            <Tooltip content="Cantidad total de transacciones completadas." position="bottom">
              <div className="flex items-center justify-between cursor-help mb-2 min-w-0">
                <p className="text-gray-400 text-[10px] sm:text-[11px] uppercase tracking-wider font-bold mb-0 truncate">
                  {t('admin.orders')}
                </p>
                <span className="material-symbols-outlined text-[14px] text-gray-500 hover:text-primary transition-colors shrink-0">help</span>
              </div>
            </Tooltip>
            <p className="text-xl sm:text-2xl lg:text-3xl font-black font-mono text-white tracking-tight truncate" title={stats.totalOrders || 0}>
              {stats.totalOrders || 0}
            </p>
          </div>

          {/* AOV */}
          <div className="bg-white/5 border border-white/10 hover:border-white/20 p-3.5 sm:p-4 rounded-xl min-w-0 flex flex-col justify-between transition-all hover:bg-white/[0.08]">
            <Tooltip content="Average Order Value (Valor Promedio por Orden)" position="bottom">
              <div className="flex items-center justify-between cursor-help mb-2 min-w-0">
                <p className="text-gray-400 text-[10px] sm:text-[11px] uppercase tracking-wider font-bold mb-0 truncate">{t('admin.aov')}</p>
                <span className="material-symbols-outlined text-[14px] text-gray-500 hover:text-primary transition-colors shrink-0">help</span>
              </div>
            </Tooltip>
            <p className="text-lg sm:text-xl lg:text-2xl xl:text-2xl 2xl:text-3xl font-black font-mono text-white tracking-tight truncate" title={`$${(stats.aov || 0).toFixed(2)}`}>
              <span className="text-gray-400 text-xs sm:text-sm mr-0.5">$</span>
              {(stats.aov || 0).toFixed(2)}
            </p>
          </div>

          {/* Eff. Mult. */}
          <div className="bg-white/5 border border-white/10 hover:border-white/20 p-3.5 sm:p-4 rounded-xl min-w-0 flex flex-col justify-between transition-all hover:bg-white/[0.08]">
            <Tooltip content="Efectividad de promociones. Folios promedio obtenidos por cada $1 gastado." position="bottom">
              <div className="flex items-center justify-between cursor-help mb-2 min-w-0">
                <p className="text-gray-400 text-[10px] sm:text-[11px] uppercase tracking-wider font-bold mb-0 truncate">{t('admin.effMult')}</p>
                <span className="material-symbols-outlined text-[14px] text-gray-500 hover:text-primary transition-colors shrink-0">help</span>
              </div>
            </Tooltip>
            <p className="text-xl sm:text-2xl lg:text-3xl font-black font-mono text-white tracking-tight truncate" title={`${(stats.effMult || 0).toFixed(1)}x`}>
              {(stats.effMult || 0).toFixed(1)}<span className="text-primary text-sm sm:text-base ml-0.5">x</span>
            </p>
          </div>
        </div>

        {/* Charts & Quick Links */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 p-4 md:p-6 rounded-xl flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold uppercase italic text-white border-l-4 border-primary pl-3">
                {t('admin.revenueTrend')}
              </h2>
            </div>
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.chartData || []}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6af425" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6af425" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', borderRadius: '8px' }}
                    itemStyle={{ color: '#6af425', fontWeight: 'bold' }}
                    labelStyle={{ color: '#888', marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#6af425" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Top Products */}
          <div className="bg-white/5 border border-white/10 p-4 md:p-6 rounded-xl flex flex-col">
            <h2 className="text-lg font-bold uppercase italic text-white border-l-4 border-primary pl-3 mb-6">
              {t('admin.topProducts')}
            </h2>
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto max-h-[300px]">
              {stats.topProducts && stats.topProducts.map((product, index) => (
                <div key={`top-product-${product.id || 'item'}-${index}`} className="flex items-center gap-3 bg-black/40 p-3 rounded-lg border border-white/5">
                  <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-gray-500 text-sm">inventory_2</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{product.name}</p>
                    <p className="text-[10px] text-gray-400 font-mono">{t('admin.unitsSold', { count: product.sold })}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-primary font-mono">${product.revenue ? product.revenue.toFixed(2) : '0.00'}</p>
                  </div>
                </div>
              ))}
              {(!stats.topProducts || stats.topProducts.length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">{t('admin.noSalesData')}</p>
              )}
            </div>
          </div>
        </div>

        {/* Active Giveaway */}
        <GiveawayBreakEvenWidget />

        {/* Navigation Cards - Bento Box Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Giveaways (Hero Card) */}
          <Link to="/admin/giveaways" className="sm:col-span-2 bg-gradient-to-br from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 border border-white/10 hover:border-primary/50 p-6 md:p-8 rounded-2xl transition-all group relative overflow-hidden flex items-center">
            <div className="absolute -right-6 -bottom-10 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-[150px] text-primary">workspace_premium</span>
            </div>
            <div className="flex items-center gap-4 md:gap-6 w-full relative z-10">
              <div className="bg-primary/20 p-4 md:p-5 rounded-2xl shrink-0">
                <span className="material-symbols-outlined text-primary text-4xl md:text-5xl">workspace_premium</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold uppercase group-hover:text-primary transition-colors text-lg md:text-2xl">{t('admin.giveawayManagerTitle')}</h3>
                <p className="text-gray-400 text-xs md:text-sm font-mono mt-1 md:mt-2">{t('admin.giveawayManagerDesc')}</p>
              </div>
              <span className="material-symbols-outlined text-white/30 group-hover:text-primary group-hover:translate-x-2 transition-all hidden md:block">arrow_forward</span>
            </div>
          </Link>

          {/* Users */}
          <Link to="/admin/users" className="bg-white/5 border border-white/10 hover:border-primary/50 p-6 rounded-2xl transition-all group flex flex-col justify-between min-h-[140px]">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-white/10 p-3 rounded-xl group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-primary text-2xl">group</span>
              </div>
              <span className="material-symbols-outlined text-white/30 group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward</span>
            </div>
            <div>
              <h3 className="text-white font-bold uppercase group-hover:text-primary transition-colors text-base">{t('admin.usersTitle')}</h3>
              <p className="text-gray-500 text-xs font-mono mt-1">{t('admin.usersDesc')}</p>
            </div>
          </Link>

          {/* Orders */}
          <Link to="/admin/orders" className="bg-white/5 border border-white/10 hover:border-primary/50 p-6 rounded-2xl transition-all group flex flex-col justify-between min-h-[140px]">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-white/10 p-3 rounded-xl group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-primary text-2xl">local_shipping</span>
              </div>
              <span className="material-symbols-outlined text-white/30 group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward</span>
            </div>
            <div>
              <h3 className="text-white font-bold uppercase group-hover:text-primary transition-colors text-base">{t('admin.ordersTitle')}</h3>
              <p className="text-gray-500 text-xs font-mono mt-1">{t('admin.ordersDesc')}</p>
            </div>
          </Link>

          {/* Products */}
          <Link to="/admin/products" className="bg-white/5 border border-white/10 hover:border-primary/50 p-6 rounded-2xl transition-all group flex flex-col justify-between min-h-[140px]">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-white/10 p-3 rounded-xl group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-primary text-2xl">inventory_2</span>
              </div>
              <span className="material-symbols-outlined text-white/30 group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward</span>
            </div>
            <div>
              <h3 className="text-white font-bold uppercase group-hover:text-primary transition-colors text-base">{t('admin.productsTitle')}</h3>
              <p className="text-gray-500 text-xs font-mono mt-1">{t('admin.productsDesc')}</p>
            </div>
          </Link>

          {/* Reports */}
          <Link to="/admin/reports" className="bg-white/5 border border-white/10 hover:border-primary/50 p-6 rounded-2xl transition-all group flex flex-col justify-between min-h-[140px]">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-white/10 p-3 rounded-xl group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-primary text-2xl">assessment</span>
              </div>
              <span className="material-symbols-outlined text-white/30 group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward</span>
            </div>
            <div>
              <h3 className="text-white font-bold uppercase group-hover:text-primary transition-colors text-base">{t('admin.reports')}</h3>
              <p className="text-gray-500 text-xs font-mono mt-1">{t('admin.reportsDesc')}</p>
            </div>
          </Link>

          {/* Config */}
          <Link to="/admin/config" className="bg-white/5 border border-white/10 hover:border-primary/50 p-6 rounded-2xl transition-all group flex flex-col justify-between min-h-[140px]">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-white/10 p-3 rounded-xl group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-primary text-2xl">settings</span>
              </div>
              <span className="material-symbols-outlined text-white/30 group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward</span>
            </div>
            <div>
              <h3 className="text-white font-bold uppercase group-hover:text-primary transition-colors text-base">{t('admin.config')}</h3>
              <p className="text-gray-500 text-xs font-mono mt-1">{t('admin.configDesc')}</p>
            </div>
          </Link>

          {/* VIP Polls Manager */}
          <Link to="/admin/polls" className="bg-gradient-to-br from-amber-500/15 to-yellow-500/5 hover:from-amber-500/25 hover:to-yellow-500/10 border border-amber-500/30 hover:border-amber-400/60 p-6 rounded-2xl transition-all group flex flex-col justify-between min-h-[140px] shadow-[0_0_20px_rgba(245,158,11,0.1)]">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-amber-500/20 p-3 rounded-xl border border-amber-500/40 text-amber-400 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl">workspace_premium</span>
              </div>
              <span className="material-symbols-outlined text-amber-400/50 group-hover:text-amber-400 group-hover:translate-x-1 transition-all">arrow_forward</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-bold uppercase group-hover:text-amber-400 transition-colors text-base">{t('admin.pollsTitle')}</h3>
                <span className="px-2 py-0.5 bg-amber-400 text-black text-[9px] font-black uppercase rounded">{t('admin.newBadge')}</span>
              </div>
              <p className="text-gray-400 text-xs font-mono mt-1">{t('admin.pollsDesc')}</p>
            </div>
          </Link>

          {/* Winners & Community Manager */}
          <Link to="/admin/winners" className="bg-gradient-to-br from-primary/15 to-emerald-500/5 hover:from-primary/25 hover:to-emerald-500/10 border border-primary/30 hover:border-primary/60 p-6 rounded-2xl transition-all group flex flex-col justify-between min-h-[140px] shadow-[0_0_20px_rgba(106,244,37,0.1)]">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-primary/20 p-3 rounded-xl border border-primary/40 text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl">photo_camera</span>
              </div>
              <span className="material-symbols-outlined text-primary/50 group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-bold uppercase group-hover:text-primary transition-colors text-base">{t('admin.winnersTitle')}</h3>
                <span className="px-2 py-0.5 bg-primary text-black text-[9px] font-black uppercase rounded">{t('admin.newBadge')}</span>
              </div>
              <p className="text-gray-400 text-xs font-mono mt-1">{t('admin.winnersDesc')}</p>
            </div>
          </Link>

          {/* Discount Coupons Manager */}
          <Link to="/admin/logs" className="bg-gradient-to-br from-purple-500/15 to-fuchsia-500/5 hover:from-purple-500/25 hover:to-fuchsia-500/10 border border-purple-500/30 hover:border-purple-400/60 p-6 rounded-2xl transition-all group flex flex-col justify-between min-h-[140px] shadow-[0_0_20px_rgba(168,85,247,0.1)]">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-purple-500/20 p-3 rounded-xl border border-purple-500/40 text-purple-400 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">history</span>
                </div>
                <span className="material-symbols-outlined text-gray-500 group-hover:text-white transition-colors">arrow_outward</span>
              </div>
              <div>
                <h3 className="text-white font-bold font-mono tracking-wider mb-1">SYSTEM LOGS</h3>
                <p className="text-sm text-gray-400">Audit & Live Monitoring</p>
              </div>
            </Link>
            <Link to="/admin/coupons" className="bg-gradient-to-br from-emerald-500/15 to-primary/5 hover:from-emerald-500/25 hover:to-primary/10 border border-primary/30 hover:border-primary/60 p-6 rounded-2xl transition-all group flex flex-col justify-between min-h-[140px] shadow-[0_0_20px_rgba(106,244,37,0.1)]">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-primary/20 p-3 rounded-xl border border-primary/40 text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl">confirmation_number</span>
              </div>
              <span className="material-symbols-outlined text-primary/50 group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-bold uppercase group-hover:text-primary transition-colors text-base">{t('admin.couponsTitle')}</h3>
                <span className="px-2 py-0.5 bg-primary text-black text-[9px] font-black uppercase rounded">{t('admin.newBadge')}</span>
              </div>
              <p className="text-gray-400 text-xs font-mono mt-1">{t('admin.couponsDesc')}</p>
            </div>
          </Link>
        </div>
      </main>
    </PageTransition>
  );
};

export default AdminDashboard;
