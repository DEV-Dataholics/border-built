import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { useTranslation } from '../../i18n/useTranslation';
import PageTransition from '../../components/layout/PageTransition';

import { LOCATION_DATA } from '../../lib/locationData';

const AdminUsers = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();
  const { t } = useTranslation();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Custom city/state toggle if user enters custom values
  const [isCustomState, setIsCustomState] = useState(false);
  const [isCustomCity, setIsCustomCity] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    password: '',
    location: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'United States',
  });

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/login', { replace: true });
      return;
    }
    fetchUsers();
  }, [isAdmin, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users`);
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      const userCountry = user.country || 'United States';
      const userState = user.state || '';
      const userCity = user.city || '';

      const countryData = LOCATION_DATA[userCountry];
      const stateObj = countryData?.states?.find(s => s.code === userState || s.name === userState);
      const isKnownState = Boolean(stateObj);
      const isKnownCity = Boolean(stateObj?.cities?.includes(userCity));

      setIsCustomState(!isKnownState && Boolean(userState));
      setIsCustomCity(!isKnownCity && Boolean(userCity));

      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'user',
        password: '',
        location: user.location || '',
        phone: user.phone || '',
        address: user.address || '',
        city: userCity,
        state: userState,
        zip_code: user.zip_code || '',
        country: userCountry,
      });
    } else {
      setEditingUser(null);
      setIsCustomState(false);
      setIsCustomCity(false);
      setFormData({
        name: '',
        email: '',
        role: 'user',
        password: '',
        location: 'San Diego, CA',
        phone: '',
        address: '',
        city: 'San Diego',
        state: 'CA',
        zip_code: '',
        country: 'United States',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: value };

      // Auto update location string if city or state changed
      if (name === 'city' || name === 'state' || name === 'country') {
        const c = name === 'city' ? value : next.city;
        const s = name === 'state' ? value : next.state;
        if (c || s) {
          next.location = [c, s].filter(Boolean).join(', ');
        }
      }
      return next;
    });
  };

  const handleCountryChange = (e) => {
    const country = e.target.value;
    const countryData = LOCATION_DATA[country];
    const defaultState = countryData?.states?.[0]?.code || '';
    const defaultCity = countryData?.states?.[0]?.cities?.[0] || '';

    setIsCustomState(false);
    setIsCustomCity(false);

    setFormData(prev => ({
      ...prev,
      country,
      state: defaultState,
      city: defaultCity,
      location: defaultCity && defaultState ? `${defaultCity}, ${defaultState}` : country
    }));
  };

  const handleStateChange = (e) => {
    const val = e.target.value;
    if (val === '__OTHER__') {
      setIsCustomState(true);
      setIsCustomCity(true);
      setFormData(prev => ({ ...prev, state: '', city: '' }));
      return;
    }

    setIsCustomState(false);
    setIsCustomCity(false);

    const countryData = LOCATION_DATA[formData.country];
    const stateObj = countryData?.states?.find(s => s.code === val || s.name === val);
    const firstCity = stateObj?.cities?.[0] || '';

    setFormData(prev => ({
      ...prev,
      state: val,
      city: firstCity,
      location: firstCity && val ? `${firstCity}, ${val}` : val
    }));
  };

  const handleCityChange = (e) => {
    const val = e.target.value;
    if (val === '__OTHER__') {
      setIsCustomCity(true);
      setFormData(prev => ({ ...prev, city: '' }));
      return;
    }

    setIsCustomCity(false);
    setFormData(prev => ({
      ...prev,
      city: val,
      location: val && prev.state ? `${val}, ${prev.state}` : val
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingUser 
        ? `${import.meta.env.VITE_API_URL}/admin/users/${editingUser.id}`
        : `${import.meta.env.VITE_API_URL}/admin/users`;
        
      const method = editingUser ? 'PUT' : 'POST';
      
      const payload = { ...formData };
      if (editingUser && !payload.password) {
        delete payload.password;
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.messages?.error || errData.message || 'Failed to save user');
      }

      await fetchUsers();
      handleCloseModal();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleVip = async (userId, currentStatus) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/admin/users/${userId}/vip`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_vip: !currentStatus })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.messages?.error || errData.message || 'No se pudo actualizar el estatus VIP.');
      }

      // Re-fetch from the database to confirm the real saved state
      await fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete user');
      await fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const currentCountryData = LOCATION_DATA[formData.country] || LOCATION_DATA['United States'];
  const currentStateObj = currentCountryData?.states?.find(s => s.code === formData.state || s.name === formData.state);
  const currentCities = currentStateObj?.cities || [];

  return (
    <PageTransition className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin')} className="hover:bg-white/10 p-2 rounded-full transition-colors">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-sm font-bold uppercase tracking-wider font-mono text-red-400">
              [ ADMIN // {t('admin.usersTitle').toUpperCase()} ]
            </h1>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-primary text-black px-4 py-2 rounded-lg font-bold uppercase text-xs hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            {t('admin.addUser')}
          </button>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black italic uppercase text-white">
            {t('admin.userManager')}
          </h1>
          <p className="text-gray-400 text-sm mt-2">{t('admin.manageUsersDesc')}</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500 text-red-500 p-4 rounded-xl text-center">
            {error}
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-xs uppercase tracking-wider text-gray-500 font-mono">
                    <th className="p-4">{t('auth.name')}</th>
                    <th className="p-4">{t('admin.userRole')}</th>
                    <th className="p-4">{t('admin.vipStatus')}</th>
                    <th className="p-4">{t('admin.location')}</th>
                    <th className="p-4">{t('garage.totalSpent')}</th>
                    <th className="p-4">{t('admin.totalEntries')}</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-sm">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                            {u.avatar ? (
                              <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="material-symbols-outlined text-gray-400">person</span>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-white flex items-center gap-2">
                              {u.name}
                              {u.is_vip && (
                                <span className="material-symbols-outlined text-amber-400 text-sm" title="VIP Member">workspace_premium</span>
                              )}
                            </p>
                            <p className="text-xs text-gray-500 font-mono">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.role === 'admin' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/10 text-gray-300'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleVip(u.id, u.is_vip)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 border ${
                            u.is_vip
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.25)] hover:bg-amber-500/30'
                              : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20 hover:text-white'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {u.is_vip ? 'workspace_premium' : 'lock'}
                          </span>
                          {u.is_vip ? 'VIP Member' : 'Standard'}
                        </button>
                      </td>
                      <td className="p-4 text-gray-400">{u.location || '-'}</td>
                      <td className="p-4 font-mono font-bold">${parseFloat(u.total_spent || 0).toFixed(2)}</td>
                      <td className="p-4 font-mono text-primary">{u.entries || 0}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleOpenModal(u)} className="p-2 hover:bg-white/10 rounded-lg transition-colors group">
                            <span className="material-symbols-outlined text-gray-400 group-hover:text-white text-sm">edit</span>
                          </button>
                          <button onClick={() => handleDelete(u.id)} className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group">
                            <span className="material-symbols-outlined text-gray-400 group-hover:text-red-500 text-sm">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-gray-500">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/10 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-bold uppercase italic text-white">
                {editingUser ? t('admin.editUser') : t('admin.addUser')}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">{t('auth.name')}</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">{t('admin.userRole')}</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="user" className="bg-[#1a1a1a] text-white">User</option>
                  <option value="admin" className="bg-[#1a1a1a] text-white">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">{t('admin.location')} (Short)</label>
                <input 
                  type="text" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="e.g. San Diego, CA"
                />
              </div>

              {/* Shipping Information Section */}
              <div className="pt-2 border-t border-white/10">
                <h3 className="text-sm font-bold uppercase text-primary mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                  {t('admin.shippingProfile')}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Country Selection Dropdown */}
                  <div className="col-span-2">
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">{t('admin.country')}</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleCountryChange}
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors font-mono"
                    >
                      <option value="United States" className="bg-[#1a1a1a] text-white">🇺🇸 United States</option>
                      <option value="México" className="bg-[#1a1a1a] text-white">🇲🇽 México</option>
                      <option value="Canada" className="bg-[#1a1a1a] text-white">🇨🇦 Canada</option>
                      <option value="Other" className="bg-[#1a1a1a] text-white">🏁 Other</option>
                    </select>
                  </div>

                  {/* State / Province Dropdown */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">{t('admin.state')}</label>
                    {!isCustomState && currentCountryData?.states?.length > 0 ? (
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleStateChange}
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-primary transition-colors font-mono text-sm"
                      >
                        {currentCountryData.states.map(s => (
                          <option key={s.code} value={s.code} className="bg-[#1a1a1a] text-white">
                            {s.code} - {s.name}
                          </option>
                        ))}
                        <option value="__OTHER__" className="bg-[#1a1a1a] text-white">+ Other / Otro...</option>
                      </select>
                    ) : (
                      <input 
                        type="text" 
                        name="state" 
                        value={formData.state} 
                        onChange={handleChange}
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                        placeholder="e.g. CA / BC"
                      />
                    )}
                  </div>

                  {/* City Select or Text Input */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">{t('admin.city')}</label>
                    {!isCustomCity && currentCities.length > 0 ? (
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleCityChange}
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-primary transition-colors font-mono text-sm"
                      >
                        {currentCities.map(c => (
                          <option key={c} value={c} className="bg-[#1a1a1a] text-white">
                            {c}
                          </option>
                        ))}
                        <option value="__OTHER__" className="bg-[#1a1a1a] text-white">+ Other / Otra...</option>
                      </select>
                    ) : (
                      <input 
                        type="text" 
                        name="city" 
                        value={formData.city} 
                        onChange={handleChange}
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                        placeholder="e.g. San Diego / Tijuana"
                      />
                    )}
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">{t('admin.streetAddress')}</label>
                    <input 
                      type="text" 
                      name="address" 
                      value={formData.address} 
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                      placeholder="123 Main St, Apt 4B"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">{t('admin.zipCode')}</label>
                    <input 
                      type="text" 
                      name="zip_code" 
                      value={formData.zip_code} 
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">{t('admin.phone')}</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">{t('admin.password')}</label>
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder={editingUser ? "Leave blank to keep unchanged" : "Default: border123"}
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 rounded-xl font-bold uppercase text-sm bg-white/10 hover:bg-white/20 transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-3 rounded-xl font-bold uppercase text-sm bg-primary text-black hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(106,244,37,0.3)]"
                >
                  {t('admin.saveUser')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageTransition>
  );
};

export default AdminUsers;
