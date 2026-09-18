import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { db } from '../../lib/db';
import PageTransition from '../../components/layout/PageTransition';
import { useTranslation } from '../../i18n/useTranslation';

const AdminWinners = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState('community'); // 'community' | 'winners'

  // Data states
  const [communityHighlights, setCommunityHighlights] = useState([]);
  const [winners, setWinners] = useState([]);

  // Community Modal State
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);
  const [editingCommunityId, setEditingCommunityId] = useState(null);
  const [communityForm, setCommunityForm] = useState({
    title: '',
    location: '',
    emoji: '🇲🇽',
    image: '',
    linkUrl: '',
  });

  // Winner Modal State
  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);
  const [editingWinnerId, setEditingWinnerId] = useState(null);
  // Upload & Drag-Drop states
  const [isUploadingCommunity, setIsUploadingCommunity] = useState(false);
  const [isDraggingCommunity, setIsDraggingCommunity] = useState(false);
  const [showCommunityUrlInput, setShowCommunityUrlInput] = useState(false);

  const [isUploadingWinner, setIsUploadingWinner] = useState(false);
  const [isDraggingWinner, setIsDraggingWinner] = useState(false);
  const [showWinnerUrlInput, setShowWinnerUrlInput] = useState(false);

  const [winnerForm, setWinnerForm] = useState({
    name: '',
    car: '',
    location: '',
    flag: '🇺🇸',
    carImage: '',
    badgeText: 'Grand Prize Winner',
    totalEntries: 5000,
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

  const loadData = useCallback(async () => {
    try {
      const [resComm, resWin] = await Promise.all([
        fetch(`${API_URL}/admin/community-highlights`),
        fetch(`${API_URL}/admin/winners`),
      ]);
      let comm = [];
      let win = [];
      if (resComm.ok) {
        const commData = await resComm.json();
        if (Array.isArray(commData)) comm = commData;
      }
      if (resWin.ok) {
        const winData = await resWin.json();
        if (Array.isArray(winData)) win = winData;
      }
      return { community: comm, winners: win };
    } catch (err) {
      console.warn('Backend API no disponible para ganadores, usando base de datos local mock:', err);
      const highlights = db.getCollection('community_highlights') || [];
      const winList = db.getCollection('winners') || [];
      return { community: highlights, winners: winList };
    }
  }, [API_URL]);

  const refreshData = useCallback(async () => {
    const data = await loadData();
    if (data) {
      setCommunityHighlights(data.community);
      setWinners(data.winners);
    }
  }, [loadData]);

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/login', { replace: true });
      return;
    }
    let isSubscribed = true;
    loadData().then((data) => {
      if (isSubscribed && data) {
        setCommunityHighlights(data.community);
        setWinners(data.winners);
      }
    });
    return () => {
      isSubscribed = false;
    };
  }, [isAdmin, navigate, loadData]);

  // --- Image Upload Handlers ---
  const handleCommunityImageUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen válido (JPG, PNG, WEBP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("El archivo supera los 10MB máximos permitidos.");
      return;
    }

    setIsUploadingCommunity(true);
    try {
      const data = new FormData();
      data.append("image", file);

      const res = await fetch(`${API_URL}/admin/community-highlights/upload`, {
        method: "POST",
        body: data,
      });

      if (!res.ok) throw new Error("Error al subir la imagen");
      const result = await res.json();
      if (result.url) {
        setCommunityForm(prev => ({ ...prev, image: result.url }));
      }
    } catch (err) {
      console.error("Error subiendo imagen de comunidad:", err);
      alert("Error al subir la imagen al servidor. Verifica que sea menor a 10MB.");
    } finally {
      setIsUploadingCommunity(false);
    }
  };

  const handleWinnerImageUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen válido (JPG, PNG, WEBP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("El archivo supera los 10MB máximos permitidos.");
      return;
    }

    setIsUploadingWinner(true);
    try {
      const data = new FormData();
      data.append("image", file);

      const res = await fetch(`${API_URL}/admin/winners/upload`, {
        method: "POST",
        body: data,
      });

      if (!res.ok) throw new Error("Error al subir la imagen");
      const result = await res.json();
      if (result.url) {
        setWinnerForm(prev => ({ ...prev, carImage: result.url }));
      }
    } catch (err) {
      console.error("Error subiendo imagen de tuner:", err);
      alert("Error al subir la imagen al servidor. Verifica que sea menor a 10MB.");
    } finally {
      setIsUploadingWinner(false);
    }
  };

  // --- Community Handlers ---
  const handleOpenCommunityModal = (item = null) => {
    setShowCommunityUrlInput(false);
    setIsUploadingCommunity(false);
    setIsDraggingCommunity(false);
    if (item) {
      setEditingCommunityId(item.id);
      setCommunityForm({
        title: item.title || '',
        location: item.location || '',
        emoji: item.emoji || '🇲🇽',
        image: item.image || '',
        linkUrl: item.linkUrl || item.link_url || '',
      });
    } else {
      setEditingCommunityId(null);
      setCommunityForm({
        title: '',
        location: '',
        emoji: '🇲🇽',
        image: '',
        linkUrl: '',
      });
    }
    setIsCommunityModalOpen(true);
  };

  const handleSaveCommunity = async (e) => {
    e.preventDefault();
    if (!communityForm.title.trim() || !communityForm.image.trim()) {
      alert('Por favor ingresa un título e imagen.');
      return;
    }

    try {
      const url = editingCommunityId
        ? `${API_URL}/admin/community-highlights/${editingCommunityId}`
        : `${API_URL}/admin/community-highlights`;
      const method = editingCommunityId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(communityForm),
      });

      if (res.ok) {
        const savedItem = await res.json();
        if (editingCommunityId) {
          db.updateOne('community_highlights', editingCommunityId, savedItem);
        } else {
          db.insertOne('community_highlights', savedItem);
        }
      }
    } catch (err) {
      console.warn('API error en community highlight save:', err);
      if (editingCommunityId) {
        db.updateOne('community_highlights', editingCommunityId, communityForm);
      } else {
        db.insertOne('community_highlights', communityForm);
      }
    }

    setIsCommunityModalOpen(false);
    await refreshData();
  };

  const handleDeleteCommunity = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta foto destacada de la comunidad?')) {
      db.deleteOne('community_highlights', id);

      try {
        await fetch(`${API_URL}/admin/community-highlights/${id}`, {
          method: 'DELETE',
        });
      } catch (err) {
        console.warn('API error en delete community highlight:', err);
      }

      await refreshData();
    }
  };

  // --- Winner Handlers ---
  const handleOpenWinnerModal = (item = null) => {
    setShowWinnerUrlInput(false);
    setIsUploadingWinner(false);
    setIsDraggingWinner(false);
    if (item) {
      setEditingWinnerId(item.id);
      setWinnerForm({
        name: item.name || '',
        car: item.car || '',
        location: item.location || '',
        flag: item.flag || '🇺🇸',
        carImage: item.carImage || '',
        badgeText: item.badgeText || 'Tuner Destacado',
        totalEntries: item.totalEntries || 5000,
      });
    } else {
      setEditingWinnerId(null);
      setWinnerForm({
        name: '',
        car: '',
        location: '',
        flag: '🇺🇸',
        carImage: '',
        badgeText: 'Tuner Destacado',
        totalEntries: 5000,
      });
    }
    setIsWinnerModalOpen(true);
  };

  const handleSaveWinner = async (e) => {
    e.preventDefault();
    if (!winnerForm.name.trim() || !winnerForm.car.trim() || !winnerForm.carImage.trim()) {
      alert('Por favor completa el nombre del ganador, auto y foto.');
      return;
    }

    try {
      const url = editingWinnerId
        ? `${API_URL}/admin/winners/${editingWinnerId}`
        : `${API_URL}/admin/winners`;
      const method = editingWinnerId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(winnerForm),
      });

      if (res.ok) {
        const savedItem = await res.json();
        if (editingWinnerId) {
          db.updateOne('winners', editingWinnerId, savedItem);
        } else {
          db.insertOne('winners', savedItem);
        }
      }
    } catch (err) {
      console.warn('API error en winner save:', err);
      if (editingWinnerId) {
        db.updateOne('winners', editingWinnerId, winnerForm);
      } else {
        db.insertOne('winners', winnerForm);
      }
    }

    setIsWinnerModalOpen(false);
    await refreshData();
  };

  const handleDeleteWinner = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este registro de ganador?')) {
      db.deleteOne('winners', id);

      try {
        await fetch(`${API_URL}/admin/winners/${id}`, {
          method: 'DELETE',
        });
      } catch (err) {
        console.warn('API error en delete winner:', err);
      }

      await refreshData();
    }
  };

  return (
    <PageTransition className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/admin')} className="hover:bg-white/10 p-2 rounded-full transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-sm font-bold uppercase tracking-wider font-mono text-primary">
            [ ADMIN // {t('admin.winnersTitle')} ]
          </h1>
          <div className="w-10" />
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black italic uppercase text-white">
              {t('admin.winnersTitle')}
            </h1>
            <p className="text-gray-400 text-xs font-mono mt-1">
              {t('admin.winnersDesc')}
            </p>
          </div>

          {/* Action Button */}
          {activeTab === 'community' ? (
            <button
              onClick={() => handleOpenCommunityModal()}
              className="bg-primary text-black font-bold uppercase tracking-wider text-xs px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 font-mono shadow-[0_0_15px_rgba(106,244,37,0.2)]"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              {t('admin.addCommunityPhoto')}
            </button>
          ) : (
            <button
              onClick={() => handleOpenWinnerModal()}
              className="bg-primary text-black font-bold uppercase tracking-wider text-xs px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 font-mono shadow-[0_0_15px_rgba(106,244,37,0.2)]"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              {t('admin.addTuner')}
            </button>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-white/10 mb-8">
          <button
            onClick={() => setActiveTab('community')}
            className={`pb-3 px-4 font-mono text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'community'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            {t('winners.community')} ({communityHighlights.length})
          </button>
          <button
            onClick={() => setActiveTab('winners')}
            className={`pb-3 px-4 font-mono text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'winners'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            {t('winners.title')} ({winners.length})
          </button>
        </div>

        {/* TAB 1: COMMUNITY HIGHLIGHTS */}
        {activeTab === 'community' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {communityHighlights.map((item) => (
              <div
                key={item.id}
                className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden group hover:border-primary/50 transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-square overflow-hidden bg-black">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = '/images/winners/event-reunion.png';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  {(item.linkUrl || item.link_url) && (
                    <div className="absolute top-2 right-2 bg-primary/90 text-black text-[9px] font-black uppercase px-2 py-0.5 rounded shadow flex items-center gap-1 font-mono">
                      <span className="material-symbols-outlined text-[10px]">link</span> Enlace
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 right-2 pointer-events-none">
                    <p className="text-white text-xs font-bold uppercase">{item.title}</p>
                    <p className="text-primary text-[10px] font-mono">
                      {item.emoji} {item.location}
                    </p>
                  </div>
                </div>
                <div className="p-3 flex items-center justify-between bg-white/5 border-t border-white/5">
                  <button
                    onClick={() => handleOpenCommunityModal(item)}
                    className="text-xs text-gray-300 hover:text-primary font-mono flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span> {t('common.edit')}
                  </button>
                  <button
                    onClick={() => handleDeleteCommunity(item.id)}
                    className="text-xs text-red-400 hover:text-red-300 font-mono flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span> {t('common.delete')}
                  </button>
                </div>
              </div>
            ))}

            {communityHighlights.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500 font-mono text-xs border border-dashed border-white/10 rounded-xl">
                No hay fotos de la comunidad registradas. Haz clic en "{t('admin.addCommunityPhoto')}" para crear una.
              </div>
            )}
          </div>
        )}

        {/* TAB 2: WINNERS */}
        {activeTab === 'winners' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {winners.map((winner) => (
              <div
                key={winner.id}
                className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden group hover:border-primary/50 transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] bg-black overflow-hidden">
                  <img
                    src={winner.carImage}
                    alt={winner.car}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = '/images/winners/winner-mustang.png';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
                  <div className="absolute top-2 left-2 bg-primary text-black text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider">
                    {winner.badgeText || 'Winner'}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
                    <h3 className="text-white text-base font-black italic uppercase">{winner.car}</h3>
                    <p className="text-gray-300 text-xs font-mono">{winner.name}</p>
                    <p className="text-primary text-[10px] font-mono mt-0.5">
                      {winner.flag} {winner.location}
                    </p>
                  </div>
                </div>
                <div className="p-3 flex items-center justify-between bg-white/5 border-t border-white/5">
                  <button
                    onClick={() => handleOpenWinnerModal(winner)}
                    className="text-xs text-gray-300 hover:text-primary font-mono flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span> {t('common.edit')}
                  </button>
                  <button
                    onClick={() => handleDeleteWinner(winner.id)}
                    className="text-xs text-red-400 hover:text-red-300 font-mono flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span> {t('common.delete')}
                  </button>
                </div>
              </div>
            ))}

            {winners.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500 font-mono text-xs border border-dashed border-white/10 rounded-xl">
                No hay ganadores registrados. Haz clic en "Agregar Ganador" para crear uno.
              </div>
            )}
          </div>
        )}
      </main>

      {/* --- MODAL COMUNIDAD DESTACADA --- */}
      {isCommunityModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-white/10 w-full max-w-md rounded-2xl p-6 relative">
            <h2 className="text-lg font-bold uppercase italic text-white mb-4 border-l-4 border-primary pl-3">
              {editingCommunityId ? 'Editar Foto Comunidad' : 'Nueva Foto Comunidad'}
            </h2>

            <form onSubmit={handleSaveCommunity} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">Título del Evento / Foto</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Reunión Fronteriza"
                  value={communityForm.title}
                  onChange={(e) => setCommunityForm({ ...communityForm, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-xs font-mono text-gray-400 mb-1">Ubicación</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Cd. Juárez"
                    value={communityForm.location}
                    onChange={(e) => setCommunityForm({ ...communityForm, location: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">Emoji/Bandera</label>
                  <input
                    type="text"
                    required
                    placeholder="🇲🇽"
                    value={communityForm.emoji}
                    onChange={(e) => setCommunityForm({ ...communityForm, emoji: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-primary outline-none text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">Foto del Evento / Comunidad</label>
                
                <input 
                  type="file" 
                  id="community-image-input" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleCommunityImageUpload(e.target.files[0]);
                    }
                  }}
                />

                <div 
                  onClick={() => document.getElementById("community-image-input").click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingCommunity(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDraggingCommunity(false); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingCommunity(false);
                    if (e.dataTransfer.files?.[0]) {
                      handleCommunityImageUpload(e.dataTransfer.files[0]);
                    }
                  }}
                  className={`relative border-2 border-dashed rounded-xl p-3 flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden ${
                    communityForm.image ? "min-h-[160px]" : "min-h-[120px]"
                  } ${
                    isDraggingCommunity 
                      ? "border-primary bg-primary/10" 
                      : "border-white/20 bg-white/5 hover:border-primary/60 hover:bg-white/[0.08]"
                  }`}
                >
                  {isUploadingCommunity ? (
                    <div className="flex flex-col items-center gap-2 text-primary py-6">
                      <span className="material-symbols-outlined text-3xl animate-spin">progress_activity</span>
                      <span className="text-xs font-mono font-bold uppercase tracking-wider">Subiendo foto al servidor...</span>
                    </div>
                  ) : communityForm.image ? (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden group">
                      <img
                        src={communityForm.image}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 transition-opacity">
                        <span className="material-symbols-outlined text-white text-3xl">cloud_upload</span>
                        <span className="text-xs font-mono font-bold text-white uppercase tracking-wider bg-black/80 px-3 py-1 rounded-full border border-white/20">
                          Cambiar Foto
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-4 text-center">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-primary border border-white/10">
                        <span className="material-symbols-outlined text-2xl">cloud_upload</span>
                      </div>
                      <div>
                        <p className="text-xs font-mono font-bold text-white uppercase">Haz clic o arrastra una foto aquí</p>
                        <p className="text-[10px] font-mono text-gray-400 mt-0.5">PNG, JPG, WEBP hasta 10MB</p>
                      </div>
                    </div>
                  )}
                </div>

                {showCommunityUrlInput ? (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-gray-500">URL directa de imagen</span>
                      <button 
                        type="button" 
                        onClick={() => setShowCommunityUrlInput(false)}
                        className="text-[10px] font-mono text-gray-500 hover:text-white"
                      >
                        Ocultar
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="https://... o /images/..."
                      value={communityForm.image}
                      onChange={(e) => setCommunityForm({ ...communityForm, image: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs font-mono text-gray-300 focus:border-primary outline-none"
                    />
                  </div>
                ) : (
                  <div className="flex justify-end mt-1">
                    <button
                      type="button"
                      onClick={() => setShowCommunityUrlInput(true)}
                      className="text-[10px] font-mono text-gray-500 hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[12px]">link</span>
                      o ingresar URL manualmente
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">Enlace / Red Social (Opcional)</label>
                <input
                  type="url"
                  placeholder="https://instagram.com/tu_cuenta o https://tiktok.com/@cuenta"
                  value={communityForm.linkUrl || ''}
                  onChange={(e) => setCommunityForm({ ...communityForm, linkUrl: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-primary outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsCommunityModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono text-gray-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-mono font-bold uppercase bg-primary text-black rounded-lg hover:bg-primary/90"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL TUNER / BUILDS --- */}
      {isWinnerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-white/10 w-full max-w-md rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold uppercase italic text-white mb-4 border-l-4 border-primary pl-3">
              {editingWinnerId ? 'Editar Tuner' : 'Nuevo Tuner'}
            </h2>

            <form onSubmit={handleSaveWinner} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">Nombre del Tuner / Piloto</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Carlos M."
                  value={winnerForm.name}
                  onChange={(e) => setWinnerForm({ ...winnerForm, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">Vehículo / Proyecto Tuning</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Nissan 350Z (Tokyo Drift)"
                  value={winnerForm.car}
                  onChange={(e) => setWinnerForm({ ...winnerForm, car: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-xs font-mono text-gray-400 mb-1">Ubicación</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. El Paso, TX"
                    value={winnerForm.location}
                    onChange={(e) => setWinnerForm({ ...winnerForm, location: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">Bandera</label>
                  <select
                    value={winnerForm.flag}
                    onChange={(e) => setWinnerForm({ ...winnerForm, flag: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-primary outline-none text-center"
                  >
                    <option value="🇺🇸">🇺🇸 US</option>
                    <option value="🇲🇽">🇲🇽 MX</option>
                    <option value="🇨🇦">🇨🇦 CA</option>
                    <option value="🇯🇵">🇯🇵 JP</option>
                    <option value="🇩🇪">🇩🇪 DE</option>
                    <option value="🏁">🏁 Otro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">Etiqueta / Badge (Texto libre)</label>
                <input
                  type="text"
                  placeholder="ej. Gran Premio, Tuner Destacado, Community Build"
                  value={winnerForm.badgeText}
                  onChange={(e) => setWinnerForm({ ...winnerForm, badgeText: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">Foto del Auto / Proyecto</label>
                
                <input 
                  type="file" 
                  id="winner-image-input" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleWinnerImageUpload(e.target.files[0]);
                    }
                  }}
                />

                <div 
                  onClick={() => document.getElementById("winner-image-input").click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingWinner(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDraggingWinner(false); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingWinner(false);
                    if (e.dataTransfer.files?.[0]) {
                      handleWinnerImageUpload(e.dataTransfer.files[0]);
                    }
                  }}
                  className={`relative border-2 border-dashed rounded-xl p-3 flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden ${
                    winnerForm.carImage ? "min-h-[160px]" : "min-h-[120px]"
                  } ${
                    isDraggingWinner 
                      ? "border-primary bg-primary/10" 
                      : "border-white/20 bg-white/5 hover:border-primary/60 hover:bg-white/[0.08]"
                  }`}
                >
                  {isUploadingWinner ? (
                    <div className="flex flex-col items-center gap-2 text-primary py-6">
                      <span className="material-symbols-outlined text-3xl animate-spin">progress_activity</span>
                      <span className="text-xs font-mono font-bold uppercase tracking-wider">Subiendo foto al servidor...</span>
                    </div>
                  ) : winnerForm.carImage ? (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden group">
                      <img
                        src={winnerForm.carImage}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 transition-opacity">
                        <span className="material-symbols-outlined text-white text-3xl">cloud_upload</span>
                        <span className="text-xs font-mono font-bold text-white uppercase tracking-wider bg-black/80 px-3 py-1 rounded-full border border-white/20">
                          Cambiar Foto
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-4 text-center">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-primary border border-white/10">
                        <span className="material-symbols-outlined text-2xl">cloud_upload</span>
                      </div>
                      <div>
                        <p className="text-xs font-mono font-bold text-white uppercase">Haz clic o arrastra una foto aquí</p>
                        <p className="text-[10px] font-mono text-gray-400 mt-0.5">PNG, JPG, WEBP hasta 10MB</p>
                      </div>
                    </div>
                  )}
                </div>

                {showWinnerUrlInput ? (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-gray-500">URL directa de imagen</span>
                      <button 
                        type="button" 
                        onClick={() => setShowWinnerUrlInput(false)}
                        className="text-[10px] font-mono text-gray-500 hover:text-white"
                      >
                        Ocultar
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="https://... o /images/..."
                      value={winnerForm.carImage}
                      onChange={(e) => setWinnerForm({ ...winnerForm, carImage: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs font-mono text-gray-300 focus:border-primary outline-none"
                    />
                  </div>
                ) : (
                  <div className="flex justify-end mt-1">
                    <button
                      type="button"
                      onClick={() => setShowWinnerUrlInput(true)}
                      className="text-[10px] font-mono text-gray-500 hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[12px]">link</span>
                      o ingresar URL manualmente
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsWinnerModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono text-gray-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-mono font-bold uppercase bg-primary text-black rounded-lg hover:bg-primary/90"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageTransition>
  );
};

export default AdminWinners;
