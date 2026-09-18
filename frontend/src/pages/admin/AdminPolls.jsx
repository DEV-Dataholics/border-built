import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import PageTransition from '../../components/layout/PageTransition';

const AdminPolls = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();

  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    is_active: true,
    options: [
      { name: '', image_url: '' },
      { name: '', image_url: '' },
    ],
  });

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/login', { replace: true });
      return;
    }
    fetchPolls();
  }, [isAdmin, navigate]);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/admin/polls`);
      if (!res.ok) throw new Error('Error al cargar las encuestas VIP');
      const data = await res.json();
      setPolls(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      is_active: true,
      options: [
        { name: '', image_url: '' },
        { name: '', image_url: '' },
      ],
    });
    setIsModalOpen(true);
  };

  const handleEditPoll = (poll) => {
    setEditingId(poll.id);
    setFormData({
      title: poll.title || '',
      description: poll.description || '',
      is_active: poll.is_active,
      options: poll.options?.length > 0 ? poll.options.map(o => ({ name: o.name, image_url: o.image_url || '' })) : [
        { name: '', image_url: '' },
        { name: '', image_url: '' },
      ],
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...formData.options];
    updatedOptions[index][field] = value;
    setFormData((prev) => ({ ...prev, options: updatedOptions }));
  };

  const handleAddOptionField = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, { name: '', image_url: '' }],
    }));
  };

  const handleRemoveOptionField = (index) => {
    if (formData.options.length <= 2) {
      alert('Una encuesta debe tener al menos 2 opciones.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('El título es requerido.');
      return;
    }
    const validOptions = formData.options.filter((o) => o.name.trim().length > 0);
    if (validOptions.length < 2) {
      alert('Debes ingresar al menos 2 opciones válidas.');
      return;
    }

    try {
      const url = editingId
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/admin/polls/${editingId}`
        : `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/admin/polls`;
      
      const payload = editingId
        ? { title: formData.title, description: formData.description, is_active: formData.is_active }
        : { ...formData, options: validOptions };

      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.messages?.error || 'No se pudo guardar la encuesta');
      }

      await fetchPolls();
      handleCloseModal();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleActive = async (pollId, currentStatus) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/admin/polls/${pollId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (!res.ok) throw new Error('Error al actualizar estado de la encuesta');
      setPolls((prev) =>
        prev.map((p) => (p.id === pollId ? { ...p, is_active: !currentStatus } : p))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (pollId) => {
    if (!window.confirm('¿Estás seguro de eliminar esta encuesta y sus votos registrados?')) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/admin/polls/${pollId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Error al eliminar la encuesta');
      await fetchPolls();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <PageTransition className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      {/* Header Bar */}
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-amber-500/20">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin')} className="hover:bg-white/10 p-2 rounded-full transition-colors">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-sm font-bold uppercase tracking-wider font-mono text-amber-400">
              [ ADMIN // VIP POLLS ]
            </h1>
          </div>
          <button
            onClick={handleOpenModal}
            className="bg-amber-400 text-black px-4 py-2 rounded-lg font-bold uppercase text-xs hover:bg-amber-300 transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
          >
            <span className="material-symbols-outlined text-sm">add_to_photos</span>
            Nueva Encuesta VIP
          </button>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black italic uppercase text-white flex items-center gap-3">
            <span className="material-symbols-outlined text-amber-400 text-3xl">workspace_premium</span>
            Gestor de Encuestas VIP
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Crea y administra las encuestas exclusivas para los miembros del VIP Lounge.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500 text-red-500 p-4 rounded-xl text-center">
            {error}
          </div>
        ) : polls.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <span className="material-symbols-outlined text-gray-500 text-5xl mb-3">ballot</span>
            <p className="text-gray-400 font-bold uppercase text-sm">No hay encuestas creadas aún.</p>
            <button
              onClick={handleOpenModal}
              className="mt-4 px-4 py-2 bg-amber-400 text-black font-bold uppercase text-xs rounded-xl"
            >
              Crear Primera Encuesta
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {polls.map((poll) => (
              <div
                key={poll.id}
                className="bg-[#121212] border border-white/10 rounded-2xl p-6 relative overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${poll.is_active ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gray-500/20 text-gray-400'}`}>
                        {poll.is_active ? 'Activa en VIP Lounge' : 'Inactiva / Archivo'}
                      </span>
                      <span className="text-xs text-gray-500 font-mono">Total Votos: {poll.total_votes || 0}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white uppercase italic">{poll.title}</h3>
                    {poll.description && <p className="text-xs text-gray-400 mt-1">{poll.description}</p>}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEditPoll(poll)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleToggleActive(poll.id, poll.is_active)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${poll.is_active ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'}`}
                    >
                      {poll.is_active ? 'Desactivar' : 'Activar'}
                    </button>
                    <button
                      onClick={() => handleDelete(poll.id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                      title="Eliminar Encuesta"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>

                {/* Opciones y porcentajes actuales */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {poll.options.map((opt) => (
                    <div key={opt.id} className="bg-white/5 border border-white/5 p-3 rounded-xl">
                      <p className="font-bold text-white text-xs mb-1">{opt.name}</p>
                      <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
                        <span>{opt.votes_count || 0} votos</span>
                        <span className="text-amber-400 font-bold">{opt.percentage || 0}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-black/40 rounded-full mt-2 overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${opt.percentage || 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal Crear Encuesta */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121212] border border-amber-500/30 rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] shadow-[0_0_40px_rgba(245,158,11,0.2)]">
            <div className="p-6 border-b border-white/10 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-bold uppercase italic text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400">{editingId ? 'edit' : 'add_to_photos'}</span>
                {editingId ? 'Editar Encuesta VIP' : 'Nueva Encuesta VIP'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Título de la Encuesta</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej: ¿Qué auto modificamos para el próximo Giveaway?"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Descripción (Opcional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalles o instrucciones para los miembros VIP..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400 text-sm h-20 resize-none"
                />
              </div>

              {/* Opciones */}
              <div className="pt-2 border-t border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase text-amber-400">Opciones de Votación</label>
                  <button
                    type="button"
                    onClick={handleAddOptionField}
                    className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-bold uppercase"
                  >
                    <span className="material-symbols-outlined text-xs">add</span>
                    Agregar Opción
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.options.map((opt, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 p-3 rounded-xl relative space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-gray-500 font-bold uppercase">Opción #{idx + 1}</span>
                        {formData.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOptionField(idx)}
                            className="text-gray-500 hover:text-red-400 text-xs"
                          >
                            Quitar
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={opt.name}
                        onChange={(e) => handleOptionChange(idx, 'name', e.target.value)}
                        placeholder="Nombre de la opción (ej: Nissan Skyline R34)"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400"
                        required
                      />
                      <input
                        type="text"
                        value={opt.image_url}
                        onChange={(e) => handleOptionChange(idx, 'image_url', e.target.value)}
                        placeholder="URL de imagen (opcional)"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-gray-400 text-xs focus:outline-none focus:border-amber-400 font-mono"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 rounded-xl font-bold uppercase text-xs bg-white/10 hover:bg-white/20 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl font-bold uppercase text-xs bg-amber-400 text-black hover:bg-amber-300 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                >
                  {editingId ? 'Guardar Cambios' : 'Publicar Encuesta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageTransition>
  );
};

export default AdminPolls;
