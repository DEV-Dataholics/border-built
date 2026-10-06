import React, { useState, useEffect } from 'react';

export default function CategoryManagerModal({
  isOpen,
  onClose,
  initialCategories = [],
  onCategoriesUpdated
}) {
  const [categories, setCategories] = useState([]);
  const [newEn, setNewEn] = useState('');
  const [newEs, setNewEs] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCategories(initialCategories.map(c => ({ ...c })));
      setError('');
      setSuccess('');
    }
  }, [isOpen, initialCategories]);

  if (!isOpen) return null;

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/(^_|_$)+/g, '');
  };

  const handleAdd = () => {
    if (!newEn.trim()) {
      setError('Por favor ingresa el nombre en inglés.');
      return;
    }

    const key = generateSlug(newEn);
    if (!key) {
      setError('Clave de categoría inválida.');
      return;
    }

    if (categories.some(c => c.key === key)) {
      setError(`La categoría "${key}" ya existe.`);
      return;
    }

    const newCat = {
      key,
      name_en: newEn.trim(),
      name_es: (newEs.trim() || newEn.trim())
    };

    setCategories(prev => [...prev, newCat]);
    setNewEn('');
    setNewEs('');
    setError('');
  };

  const handleRemove = (keyToRemove) => {
    const protectedKeys = ['hoodies', 'tshirts', 'mystery', 'quick_entries'];
    if (protectedKeys.includes(keyToRemove)) {
      if (!window.confirm(`La categoría "${keyToRemove}" es estándar del sistema. ¿Seguro que deseas eliminarla?`)) {
        return;
      }
    }
    setCategories(prev => prev.filter(c => c.key !== keyToRemove));
  };

  const handleNameChange = (key, field, val) => {
    setCategories(prev => prev.map(c => c.key === key ? { ...c, [field]: val } : c));
  };

  const handleSave = async () => {
    if (categories.length === 0) {
      setError('Debe haber al menos una categoría.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/categories`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ categories })
      });

      if (!response.ok) {
        throw new Error('Error al guardar las categorías en el servidor');
      }

      setSuccess('¡Categorías guardadas correctamente!');
      if (onCategoriesUpdated) {
        onCategoriesUpdated(categories);
      }
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-[#0f0f10] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-xl">category</span>
            <div>
              <h3 className="text-white font-mono font-bold text-sm tracking-wide uppercase">
                [ ADMINISTRADOR DE CATEGORÍAS // SHOP CATEGORIES ]
              </h3>
              <p className="text-xs text-gray-400 font-sans mt-0.5">
                Crea y edita las categorías que aparecen en el filtro de la tienda y en la edición de productos
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Form to Add New Category */}
        <div className="p-5 border-b border-white/10 bg-white/[0.02]">
          <h4 className="text-xs font-mono font-bold uppercase text-primary mb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">add_circle</span>
            Nueva Categoría
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Nombre en Inglés (EN)</label>
              <input
                type="text"
                placeholder="Ex: Hats, Jackets, Keychains..."
                value={newEn}
                onChange={(e) => setNewEn(e.target.value)}
                className="w-full bg-[#151515] border border-white/10 rounded-lg p-2.5 text-white text-xs font-mono focus:border-primary/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Nombre en Español (ES)</label>
              <input
                type="text"
                placeholder="Ej: Gorras, Chamarras, Llaveros..."
                value={newEs}
                onChange={(e) => setNewEs(e.target.value)}
                className="w-full bg-[#151515] border border-white/10 rounded-lg p-2.5 text-white text-xs font-mono focus:border-primary/50 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-gray-500">
              Clave generada: <strong className="text-gray-300">{newEn ? generateSlug(newEn) : '...'}</strong>
            </span>
            <button
              type="button"
              onClick={handleAdd}
              disabled={!newEn.trim()}
              className="px-3.5 py-1.5 bg-primary text-black font-mono font-bold text-xs rounded-lg hover:bg-primary/90 transition-all disabled:opacity-40 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Agregar
            </button>
          </div>

          {error && <p className="text-xs text-red-400 font-mono mt-2">{error}</p>}
          {success && <p className="text-xs text-primary font-mono mt-2">{success}</p>}
        </div>

        {/* Existing Categories List */}
        <div className="p-5 flex-1 overflow-y-auto space-y-2.5">
          <h4 className="text-[11px] font-mono font-bold uppercase text-gray-400 mb-2">
            Categorías Activas ({categories.length})
          </h4>

          {categories.map((cat) => (
            <div 
              key={cat.key}
              className="flex items-center gap-3 p-2.5 bg-black/40 border border-white/5 rounded-xl hover:border-white/10 transition-colors"
            >
              <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-primary font-bold uppercase shrink-0">
                {cat.key}
              </span>

              <div className="grid grid-cols-2 gap-2 flex-1 min-w-0">
                <input
                  type="text"
                  value={cat.name_en || ''}
                  placeholder="English name"
                  onChange={(e) => handleNameChange(cat.key, 'name_en', e.target.value)}
                  className="bg-[#181818] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white font-mono focus:border-primary/40 focus:outline-none"
                />
                <input
                  type="text"
                  value={cat.name_es || ''}
                  placeholder="Nombre español"
                  onChange={(e) => handleNameChange(cat.key, 'name_es', e.target.value)}
                  className="bg-[#181818] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white font-mono focus:border-primary/40 focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => handleRemove(cat.key)}
                className="text-gray-500 hover:text-red-400 p-1.5 rounded hover:bg-white/5 transition-colors shrink-0"
                title="Eliminar categoría"
              >
                <span className="material-symbols-outlined text-base">delete</span>
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/50 flex items-center justify-between">
          <span className="text-[11px] font-mono text-gray-500">
            Los cambios se reflejarán inmediatamente en la tienda pública
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-mono text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors border border-white/10"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="px-5 py-2 rounded-lg font-mono text-xs font-bold bg-primary text-black hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center gap-1.5"
            >
              {saving ? 'Guardando...' : '✓ Guardar Cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
