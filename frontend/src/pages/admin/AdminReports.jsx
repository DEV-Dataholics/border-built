import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { exportEntryReport, exportUserSummary } from '../../lib/csv';
import { useTranslation } from '../../i18n/useTranslation';
import Button from '../../components/ui/Button';
import PageTransition from '../../components/layout/PageTransition';
import Tooltip from '../../components/ui/Tooltip';

const AdminReports = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();
  const { t } = useTranslation();

  const [reportData, setReportData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [activeTab, setActiveTab] = useState('entries'); // 'entries' | 'users'

  // Date Filter State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activePreset, setActivePreset] = useState('all');

  const fetchReports = useCallback(async () => {
    try {
      let url = `${import.meta.env.VITE_API_URL}/admin/reports`;
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch reports');
      let data = await response.json();

      // Client-side date filter fallback to ensure 100% precision
      if (startDate || endDate) {
        data = data.filter(entry => {
          const entryDate = new Date(entry.timestamp);
          if (startDate) {
            const start = new Date(`${startDate}T00:00:00`);
            if (entryDate < start) return false;
          }
          if (endDate) {
            const end = new Date(`${endDate}T23:59:59`);
            if (entryDate > end) return false;
          }
          return true;
        });
      }

      setReportData(data);

      // Compute user summary from filtered report data
      const summaryMap = {};
      data.forEach(entry => {
        if (!summaryMap[entry.userEmail]) {
          summaryMap[entry.userEmail] = {
            userId: entry.userId || '',
            name: entry.userName,
            email: entry.userEmail,
            location: 'N/A',
            totalEntries: 0,
            totalSpent: 0,
            orderCount: 0,
            lastOrderDate: entry.timestamp
          };
        }
        summaryMap[entry.userEmail].totalEntries += entry.entriesEarned;
        summaryMap[entry.userEmail].totalSpent += entry.orderTotal;
        summaryMap[entry.userEmail].orderCount += 1;
        if (new Date(entry.timestamp) > new Date(summaryMap[entry.userEmail].lastOrderDate)) {
          summaryMap[entry.userEmail].lastOrderDate = entry.timestamp;
        }
      });

      setSummaryData(Object.values(summaryMap));
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/login', { replace: true });
      return;
    }

    fetchReports();
  }, [isAdmin, navigate, fetchReports]);

  const handlePreset = (preset) => {
    setActivePreset(preset);
    const now = new Date();

    if (preset === 'all') {
      setStartDate('');
      setEndDate('');
      return;
    }

    if (preset === 'today') {
      const todayStr = now.toISOString().slice(0, 10);
      setStartDate(todayStr);
      setEndDate(todayStr);
      return;
    }

    if (preset === 'week') {
      const pastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      setStartDate(pastWeek.toISOString().slice(0, 10));
      setEndDate(now.toISOString().slice(0, 10));
      return;
    }

    if (preset === 'month') {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      setStartDate(firstDay.toISOString().slice(0, 10));
      setEndDate(now.toISOString().slice(0, 10));
      return;
    }
  };

  const handleExportEntries = () => {
    exportEntryReport(reportData);
  };

  const handleExportUsers = () => {
    exportUserSummary(summaryData);
  };

  return (
    <PageTransition className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/admin')} className="hover:bg-white/10 p-2 rounded-full transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-sm font-bold uppercase tracking-wider font-mono text-red-400">
            [ REPORTS // VERIFIED ]
          </h1>
          <div className="w-10" />
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-black italic uppercase text-white">
            {t('admin.reports')}
          </h1>
          <div className="flex gap-2">
            <Tooltip content="Descarga un archivo Excel (.csv) con los folios del rango seleccionado." position="bottom">
              <div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={activeTab === 'entries' ? handleExportEntries : handleExportUsers}
                  icon={<span className="material-symbols-outlined text-sm">download</span>}
                >
                  {t('admin.exportCSV')}
                </Button>
              </div>
            </Tooltip>
          </div>
        </div>

        {/* Date Filter Bar */}
        <div className="bg-[#111] border border-white/10 rounded-xl p-4 mb-6 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">calendar_month</span>
              <span className="text-xs font-bold uppercase font-mono text-gray-300">Filtro de Fechas</span>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'today', label: 'Hoy' },
                { id: 'week', label: '7 Días' },
                { id: 'month', label: 'Este Mes' },
                { id: 'all', label: 'Todo' },
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => handlePreset(p.id)}
                  className={`px-3 py-1 rounded-md text-[11px] font-mono font-bold uppercase transition-colors ${
                    activePreset === p.id 
                      ? 'bg-primary text-black' 
                      : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-white/5">
            <div>
              <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Fecha Inicio</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setActivePreset('custom');
                }}
                className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-primary focus:outline-none"
                style={{ colorScheme: 'dark' }}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Fecha Fin</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setActivePreset('custom');
                }}
                className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-primary focus:outline-none"
                style={{ colorScheme: 'dark' }}
              />
            </div>
            <div className="flex items-end col-span-2">
              <span className="text-[11px] font-mono text-gray-400">
                Mostrando <strong className="text-primary font-bold">{reportData.length}</strong> órdenes (Total Folios: <strong className="text-primary font-bold">{reportData.reduce((acc, r) => acc + (r.entriesEarned || 0), 0).toLocaleString()}</strong>)
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/10 pb-3">
          <button
            onClick={() => setActiveTab('entries')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
              activeTab === 'entries' ? 'bg-primary text-background-dark' : 'text-gray-400 hover:text-white'
            }`}
          >
            Entry Details ({reportData.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
              activeTab === 'users' ? 'bg-primary text-background-dark' : 'text-gray-400 hover:text-white'
            }`}
          >
            User Summary ({summaryData.length})
          </button>
        </div>

        {/* Entry Details Table */}
        {activeTab === 'entries' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="py-3 px-2 text-[10px] text-gray-400 uppercase tracking-wider font-bold">Order ID</th>
                  <th className="py-3 px-2 text-[10px] text-gray-400 uppercase tracking-wider font-bold">Email</th>
                  <th className="py-3 px-2 text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                    <Tooltip content="Folios base antes del multiplicador (1 USD = 1 Folio)." position="top">
                      <span className="cursor-help flex items-center gap-1">Entries <span className="material-symbols-outlined text-[10px]">help</span></span>
                    </Tooltip>
                  </th>
                  <th className="py-3 px-2 text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                    <Tooltip content="Promoción activa al momento de la compra." position="top">
                      <span className="cursor-help flex items-center gap-1">Multiplier <span className="material-symbols-outlined text-[10px]">help</span></span>
                    </Tooltip>
                  </th>
                  <th className="py-3 px-2 text-[10px] text-gray-400 uppercase tracking-wider font-bold">Total</th>
                  <th className="py-3 px-2 text-[10px] text-gray-400 uppercase tracking-wider font-bold">Timestamp</th>
                  <th className="py-3 px-2 text-[10px] text-gray-400 uppercase tracking-wider font-bold">Hash</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((row, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-2 font-mono text-xs text-white">{row.orderId}</td>
                    <td className="py-3 px-2 font-mono text-xs text-gray-300">{row.userEmail}</td>
                    <td className="py-3 px-2 font-mono text-xs text-primary font-bold">{row.entriesEarned.toLocaleString()}</td>
                    <td className="py-3 px-2 font-mono text-xs text-gray-400">{row.multiplierUsed}x</td>
                    <td className="py-3 px-2 font-mono text-xs text-white">${row.orderTotal.toFixed(2)}</td>
                    <td className="py-3 px-2 font-mono text-[10px] text-gray-500">{new Date(row.timestamp).toLocaleString()}</td>
                    <td className="py-3 px-2 font-mono text-[10px] text-gray-600">{row.verificationHash}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* User Summary Table */}
        {activeTab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="py-3 px-2 text-[10px] text-gray-400 uppercase tracking-wider font-bold">Name</th>
                  <th className="py-3 px-2 text-[10px] text-gray-400 uppercase tracking-wider font-bold">Email</th>
                  <th className="py-3 px-2 text-[10px] text-gray-400 uppercase tracking-wider font-bold">Location</th>
                  <th className="py-3 px-2 text-[10px] text-gray-400 uppercase tracking-wider font-bold">Entries</th>
                  <th className="py-3 px-2 text-[10px] text-gray-400 uppercase tracking-wider font-bold">Spent</th>
                  <th className="py-3 px-2 text-[10px] text-gray-400 uppercase tracking-wider font-bold">Orders</th>
                  <th className="py-3 px-2 text-[10px] text-gray-400 uppercase tracking-wider font-bold">Last Order</th>
                </tr>
              </thead>
              <tbody>
                {summaryData.map((row, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-2 text-xs text-white font-bold">{row.name}</td>
                    <td className="py-3 px-2 font-mono text-xs text-gray-300">{row.email}</td>
                    <td className="py-3 px-2 text-xs text-gray-400">{row.location}</td>
                    <td className="py-3 px-2 font-mono text-xs text-primary font-bold">{row.totalEntries.toLocaleString()}</td>
                    <td className="py-3 px-2 font-mono text-xs text-white">${row.totalSpent.toFixed(2)}</td>
                    <td className="py-3 px-2 font-mono text-xs text-gray-400">{row.orderCount}</td>
                    <td className="py-3 px-2 font-mono text-[10px] text-gray-500">
                      {row.lastOrderDate ? new Date(row.lastOrderDate).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </PageTransition>
  );
};

export default AdminReports;
