import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import PageTransition from '../../components/layout/PageTransition';

const AdminCoupons = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();
  const [coupons, setCoupons] = useState([]);
  const [metrics, setMetrics] = useState({
    totalCoupons: 0,
    usedCoupons: 0,
    redemptionRate: 0,
    totalEntriesGifted: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'entries' | 'discount'
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [selectedCoupons, setSelectedCoupons] = useState([]);

  const [form, setForm] = useState({
    code: '',
    reward_type: 'entries', // 'entries' | 'discount'
    discount_type: 'percentage', // 'percentage' | 'fixed'
    value: '',
    entries_count: '700',
    min_purchase: '0',
    usage_limit: '1',
    campaign_name: '',
    is_active: 1,
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/coupons`);
      if (res.ok) {
        const data = await res.json();
        setCoupons(data.coupons || []);
        if (data.metrics) setMetrics(data.metrics);
      }
    } catch (err) {
      console.error('Error fetching coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/login', { replace: true });
      return;
    }
    fetchCoupons();
  }, [isAdmin, navigate]);

  const isCouponExpired = (c) => {
    const now = new Date();
    const isInactive = parseInt(c.is_active) === 0;
    const isUsedUp = c.usage_limit && parseInt(c.usage_count) >= parseInt(c.usage_limit);
    const hasExpiredDate = c.expires_at && new Date(c.expires_at) < now;
    return isInactive || isUsedUp || hasExpiredDate;
  };

  const handleBulkDeleteExpired = async () => {
    const expired = coupons.filter(isCouponExpired);
    if (expired.length === 0) {
      alert('No hay cupones expirados/inactivos para eliminar.');
      return;
    }
    if (!window.confirm(`¿Estás seguro de eliminar ${expired.length} cupones expirados/inactivos?`)) return;

    setLoading(true);
    try {
      await Promise.all(expired.map(c => fetch(`${import.meta.env.VITE_API_URL}/admin/coupons/${c.id}`, { method: 'DELETE' })));
      fetchCoupons();
    } catch (err) {
      console.error('Error bulk deleting:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setForm({
        code: coupon.code,
        reward_type: coupon.reward_type || 'discount',
        discount_type: coupon.discount_type || 'percentage',
        value: coupon.value || '',
        entries_count: coupon.entries_count || 0,
        min_purchase: coupon.min_purchase || '0',
        usage_limit: coupon.usage_limit || '1',
        campaign_name: coupon.campaign_name || '',
        is_active: coupon.is_active,
      });
    } else {
      setEditingCoupon(null);
      setForm({
        code: '',
        reward_type: 'entries',
        discount_type: 'percentage',
        value: '',
        entries_count: '700',
        min_purchase: '0',
        usage_limit: '1',
        campaign_name: 'Campaña Promocional Entradas',
        is_active: 1,
      });
    }
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const url = editingCoupon
        ? `${import.meta.env.VITE_API_URL}/admin/coupons/${editingCoupon.id}`
        : `${import.meta.env.VITE_API_URL}/admin/coupons`;

      const method = editingCoupon ? 'PUT' : 'POST';

      const payload = {
        code: form.code.toUpperCase().trim(),
        reward_type: form.reward_type,
        discount_type: form.discount_type,
        value: form.value ? parseFloat(form.value) : 0,
        entries_count: form.entries_count ? parseInt(form.entries_count) : 0,
        min_purchase: form.min_purchase ? parseFloat(form.min_purchase) : 0,
        usage_limit: form.usage_limit ? parseInt(form.usage_limit) : 1,
        campaign_name: form.campaign_name.trim(),
        is_active: parseInt(form.is_active),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowModal(false);
        fetchCoupons();
      } else {
        const errData = await res.json();
        alert(errData.messages?.error || 'Error al guardar el cupón');
      }
    } catch (err) {
      console.error('Error saving coupon:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este cupón?')) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/coupons/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchCoupons();
      }
    } catch (err) {
      console.error('Error deleting coupon:', err);
    }
  };

  const handleSelectAll = (e, filteredCoupons) => {
    if (e.target.checked) {
      setSelectedCoupons(filteredCoupons.map(c => c.id));
    } else {
      setSelectedCoupons([]);
    }
  };

  const handleSelectCoupon = (id) => {
    setSelectedCoupons(prev => 
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const handleBulkDeleteSelected = async () => {
    if (selectedCoupons.length === 0) return;
    if (!window.confirm(`¿Estás seguro de eliminar los ${selectedCoupons.length} cupones seleccionados?`)) return;

    setLoading(true);
    try {
      await Promise.all(
        selectedCoupons.map(id => 
          fetch(`${import.meta.env.VITE_API_URL}/admin/coupons/${id}`, { method: 'DELETE' })
        )
      );
      setSelectedCoupons([]);
      fetchCoupons();
    } catch (err) {
      console.error('Error bulk deleting selected:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (coupon) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/coupons/${coupon.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_active: Number(coupon.is_active) === 1 ? 0 : 1,
        }),
      });
      if (res.ok) {
        fetchCoupons();
      }
    } catch (err) {
      console.error('Error toggling coupon status:', err);
    }
  };

  const filteredCoupons = coupons.filter((c) => {
    if (filterType === 'entries') return c.reward_type === 'entries';
    if (filterType === 'discount') return c.reward_type === 'discount';
    return true;
  });

  return (
    <PageTransition className="min-h-screen bg-[#0a0a0a] text-white pb-12">
      {/* Navigation Header */}
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
              {selectedCoupons.length > 0 && (
                <Button onClick={handleBulkDeleteSelected} className="flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 border-none animate-pulse">
                  <span className="material-symbols-outlined text-sm">delete</span>
                  Eliminar ({selectedCoupons.length})
                </Button>
              )}
            <button
              onClick={() => navigate('/admin')}
              className="hover:bg-white/10 p-2 rounded-full transition-colors"
              title="Regresar al Panel"
            >
              <span className="material-symbols-outlined text-white">arrow_back</span>
            </button>
            <div>
              <h1 className="text-sm font-bold uppercase tracking-wider font-mono text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">confirmation_number</span>
                SISTEMA DE CUPONES
              </h1>
              <p className="text-[10px] text-gray-500 font-mono">
                Admin <span className="text-gray-600 mx-1">//</span> Cupones
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
              {selectedCoupons.length > 0 && (
                <Button onClick={handleBulkDeleteSelected} className="flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 border-none animate-pulse">
                  <span className="material-symbols-outlined text-sm">delete</span>
                  Eliminar ({selectedCoupons.length})
                </Button>
              )}
            <Button onClick={handleBulkDeleteExpired} className="flex items-center gap-2 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-black border-red-500/30">
              <span className="material-symbols-outlined text-sm">delete_sweep</span>
              Limpiar Expirados
            </Button>
            <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">add</span>
              Nuevo Cupón
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black italic uppercase text-white tracking-wider">
          SISTEMA UNIFICADO DE CUPONES
        </h2>
        <p className="text-xs text-gray-400 font-mono mt-1">
          Gestión dual de descuentos en tienda y canje de entradas promocionales (1 uso único o masivo)
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#111] border border-white/10 rounded-xl p-5 shadow-lg">
          <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">Cupones Creados</p>
          <p className="text-3xl font-black text-white font-mono mt-1">{metrics.totalCoupons}</p>
        </div>
        <div className="bg-[#111] border border-white/10 rounded-xl p-5 shadow-lg">
          <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">Cupones Canjeados</p>
          <p className="text-3xl font-black text-primary font-mono mt-1">{metrics.usedCoupons}</p>
        </div>
        <div className="bg-[#111] border border-white/10 rounded-xl p-5 shadow-lg">
          <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">% Tasa de Canje</p>
          <p className="text-3xl font-black text-emerald-400 font-mono mt-1">{metrics.redemptionRate}%</p>
        </div>
        <div className="bg-[#111] border border-primary/30 rounded-xl p-5 shadow-[0_0_20px_rgba(106,244,37,0.1)]">
          <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">Entradas Regaladas</p>
          <p className="text-3xl font-black text-primary font-mono mt-1">{metrics.totalEntriesGifted.toLocaleString()}</p>
        </div>
      </div>

      {/* Filtros Pestañas */}
      <div className="flex gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg transition-colors ${
            filterType === 'all' ? 'bg-primary text-black' : 'bg-white/5 text-gray-400 hover:text-white'
          }`}
        >
          Todos ({coupons.length})
        </button>
        <button
          onClick={() => setFilterType('entries')}
          className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg transition-colors ${
            filterType === 'entries' ? 'bg-primary text-black' : 'bg-white/5 text-gray-400 hover:text-white'
          }`}
        >
          Entradas / Entries ({coupons.filter(c => c.reward_type === 'entries').length})
        </button>
        <button
          onClick={() => setFilterType('discount')}
          className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg transition-colors ${
            filterType === 'discount' ? 'bg-primary text-black' : 'bg-white/5 text-gray-400 hover:text-white'
          }`}
        >
          Descuentos Checkout ({coupons.filter(c => c.reward_type === 'discount').length})
        </button>
      </div>

      {/* Tabla de Cupones */}
      <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-black/50 text-gray-400 font-mono text-xs uppercase border-b border-white/10">
            <tr>
              <th className="p-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    onChange={(e) => handleSelectAll(e, filteredCoupons)} 
                    checked={selectedCoupons.length === filteredCoupons.length && filteredCoupons.length > 0} 
                    className="accent-primary cursor-pointer w-4 h-4" 
                  />
                </th>
                <th className="p-4">Código</th>
              <th className="p-4">Campaña</th>
              <th className="p-4">Tipo Recompensa</th>
              <th className="p-4">Detalle / Valor</th>
              <th className="p-4">Usos</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan="8" className="p-8 text-center text-gray-500 font-mono">
                  Cargando cupones...
                </td>
              </tr>
            ) : filteredCoupons.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-8 text-center text-gray-500 font-mono">
                  No hay cupones que coincidan con el filtro.
                </td>
              </tr>
            ) : (
              filteredCoupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 text-center">
                      <input 
                        type="checkbox" 
                        onChange={() => handleSelectCoupon(coupon.id)} 
                        checked={selectedCoupons.includes(coupon.id)} 
                        className="accent-primary cursor-pointer w-4 h-4" 
                      />
                    </td>
                    <td className="p-4 font-mono font-bold text-primary">{coupon.code}</td>
                  <td className="p-4 text-gray-300 font-mono text-xs">{coupon.campaign_name || 'General'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-[11px] font-mono font-bold ${
                      coupon.reward_type === 'entries' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {coupon.reward_type === 'entries' ? '🎟️ ENTRADAS' : '🏷️ DESCUENTO'}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-white font-semibold">
                    {coupon.reward_type === 'entries'
                      ? `${Number(coupon.entries_count).toLocaleString()} Entradas`
                      : coupon.discount_type === 'percentage'
                      ? `${coupon.value}% OFF`
                      : `$${parseFloat(coupon.value).toFixed(2)} OFF`}
                  </td>
                  <td className="p-4 font-mono text-gray-300">
                    {coupon.usage_count} {coupon.usage_limit ? `/ ${coupon.usage_limit}` : ''}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleActive(coupon)}
                      className={`px-3 py-1 rounded-full text-xs font-mono font-bold border transition-colors ${
                        Number(coupon.is_active) === 1
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
                      }`}
                    >
                      {Number(coupon.is_active) === 1 ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenModal(coupon)}
                      className="p-2 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition-colors"
                      title="Editar"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(coupon.id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                      title="Eliminar"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Crear / Editar */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111] border border-white/20 rounded-xl p-6 max-w-md w-full shadow-2xl"
          >
            <h2 className="text-xl font-bold uppercase italic text-white mb-4">
              {editingCoupon ? 'Editar Cupón' : 'Nuevo Cupón'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Código del Cupón"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="Ej. BORDER700"
                required
              />

              <Input
                label="Nombre de la Campaña"
                value={form.campaign_name}
                onChange={(e) => setForm({ ...form, campaign_name: e.target.value })}
                placeholder="Ej. Evento Promo 700 Entradas"
                required
              />

              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                  Tipo de Recompensa
                </label>
                <select
                  value={form.reward_type}
                  onChange={(e) => setForm({ ...form, reward_type: e.target.value })}
                  className="w-full bg-black/60 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary font-mono"
                >
                  <option value="entries">Entradas Gratis para Giveaways (Entries)</option>
                  <option value="discount">Descuento de Mercado / Checkout (Discount)</option>
                </select>
              </div>

              {form.reward_type === 'entries' ? (
                <Input
                  label="Cantidad de Entradas / Boletos"
                  type="number"
                  value={form.entries_count}
                  onChange={(e) => setForm({ ...form, entries_count: e.target.value })}
                  placeholder="Ej. 700"
                  required
                />
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                      Tipo Descuento
                    </label>
                    <select
                      value={form.discount_type}
                      onChange={(e) => setForm({ ...form, discount_type: e.target.value })}
                      className="w-full bg-black/60 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                    >
                      <option value="percentage">Porcentaje (%)</option>
                      <option value="fixed">Monto Fijo ($)</option>
                    </select>
                  </div>
                  <Input
                    label={form.discount_type === 'percentage' ? 'Porcentaje (%)' : 'Monto ($)'}
                    type="number"
                    step="0.01"
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    placeholder="Ej. 15"
                    required
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Límite de Usos Totales"
                  type="number"
                  value={form.usage_limit}
                  onChange={(e) => setForm({ ...form, usage_limit: e.target.value })}
                  placeholder="1 para uso único"
                  required
                />
                <Input
                  label="Compra Mínima ($)"
                  type="number"
                  step="0.01"
                  value={form.min_purchase}
                  onChange={(e) => setForm({ ...form, min_purchase: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingCoupon ? 'Guardar Cambios' : 'Crear Cupón'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      </div>
    </PageTransition>
  );
};

export default AdminCoupons;
