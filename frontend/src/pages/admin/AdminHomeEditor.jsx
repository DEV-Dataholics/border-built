import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { useGiveawayStore } from '../../stores/useGiveawayStore';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import PageTransition from '../../components/layout/PageTransition';
import HomePreview from '../../components/admin/HomePreview';

const AdminHomeEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();
  const { invalidateCache } = useGiveawayStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState(null);
  const [giveawayName, setGiveawayName] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    heroImage: '',
    heroSubtitle: '',
    heroHeadline: '',
    heroBadgeEvent: '',
    heroBadgeReqid: '',
    carMake: '',
    carModel: '',
    carEngine: '',
    carHorsepower: '',
    carColor: '',
    specTitle: '',
    specSubtitle: '',
    scarcityTitle: '',
    scarcityHeadline: '',
    scarcitySubheadline: '',
    scarcityProductTitle: '',
    scarcityProductDesc: '',
    scarcityPercentSold: 85,
    prizeCost: 50000,
    endDate: '',
    breakdownBlocks: [],
  });

  // Accordion state
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/login', { replace: true });
      return;
    }

    const fetchGiveaway = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/giveaways/${id}`);
        if (!response.ok) throw new Error('Failed to fetch giveaway');
        const data = await response.json();

        setGiveawayName(data.name || `Giveaway #${id}`);
        setFormData({
          heroImage: data.hero_image || '',
          heroSubtitle: data.hero_subtitle || '',
          heroHeadline: data.hero_headline || '',
          heroBadgeEvent: data.hero_badge_event || '',
          heroBadgeReqid: data.hero_badge_reqid || '',
          carMake: data.car_make || '',
          carModel: data.car_model || '',
          carEngine: data.car_engine || '',
          carHorsepower: data.car_horsepower || '',
          carColor: data.car_color || '',
          specTitle: data.spec_title || '',
          specSubtitle: data.spec_subtitle || '',
          scarcityTitle: data.scarcity_title || '',
          scarcityHeadline: data.scarcity_headline || '',
          scarcitySubheadline: data.scarcity_subheadline || '',
          scarcityProductTitle: data.scarcity_product_title || '',
          scarcityProductDesc: data.scarcity_product_desc || '',
          scarcityPercentSold: data.scarcity_percent_sold ?? 85,
          prizeCost: data.prize_cost || 50000,
          endDate: data.end_date && !data.end_date.startsWith('0000') ? data.end_date.replace(' ', 'T').slice(0, 16) : '',
          breakdownBlocks: data.breakdown_blocks || [],
        });
      } catch (error) {
        console.error('Error fetching giveaway:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGiveaway();
  }, [id, isAdmin, navigate]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  // Image upload handler
  const handleFileUpload = async (e, fieldName, blockIdx = null) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadKey = blockIdx !== null ? `block_${blockIdx}` : fieldName;
    setUploadingField(uploadKey);

    try {
      const data = new FormData();
      data.append('image', file);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/giveaways/${id}/upload`, {
        method: 'POST',
        body: data,
      });

      if (!response.ok) throw new Error('Upload failed');
      const result = await response.json();

      if (result.url) {
        if (blockIdx !== null) {
          updateBlock(blockIdx, 'image_url', result.url);
        } else {
          setFormData((prev) => ({ ...prev, [fieldName]: result.url }));
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen. Verifica que sea un archivo de imagen válido (JPG, PNG, WEBP) menor a 5MB.');
    } finally {
      setUploadingField(null);
    }
  };

  // Breakdown blocks logic (CRUD + reorder)
  const addBlock = () => {
    if (formData.breakdownBlocks.length >= 6) {
      alert('El máximo permitido es de 6 bloques.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      breakdownBlocks: [
        ...prev.breakdownBlocks,
        { title: '', description: '', image_url: '' },
      ],
    }));
  };

  const removeBlock = (index) => {
    setFormData((prev) => ({
      ...prev,
      breakdownBlocks: prev.breakdownBlocks.filter((_, i) => i !== index),
    }));
  };

  const updateBlock = (index, key, value) => {
    setFormData((prev) => {
      const newBlocks = [...prev.breakdownBlocks];
      newBlocks[index] = { ...newBlocks[index], [key]: value };
      return { ...prev, breakdownBlocks: newBlocks };
    });
  };

  const moveBlock = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= formData.breakdownBlocks.length) return;

    setFormData((prev) => {
      const newBlocks = [...prev.breakdownBlocks];
      const temp = newBlocks[index];
      newBlocks[index] = newBlocks[newIndex];
      newBlocks[newIndex] = temp;
      return { ...prev, breakdownBlocks: newBlocks };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/giveaways/${id}/home-content`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Save failed');

      // Invalidate the public giveaway cache so the Home page re-fetches
      // fresh content from the database on next render instead of using stale data.
      invalidateCache();

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving home content:', error);
      alert('Error al guardar los cambios.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center font-mono text-sm">
        Cargando editor del Home...
      </div>
    );
  }

  return (
    <PageTransition className="min-h-screen bg-[#0a0a0a] text-white pb-12">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/admin/giveaways')} className="hover:bg-white/10 p-2 rounded-full transition-colors">
              <span className="material-symbols-outlined text-white">arrow_back</span>
            </button>
            <div>
              <h1 className="text-sm font-bold uppercase tracking-wider font-mono text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">edit_note</span>
                EDITOR DEL HOME // {giveawayName}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => window.open('/', '_blank')}
              variant="secondary"
              size="sm"
              className="hidden sm:flex items-center gap-1 text-xs"
            >
              <span className="material-symbols-outlined text-sm">open_in_new</span>
              Ver Home Público
            </Button>
            <Button
              onClick={handleSave}
              size="sm"
              disabled={saving}
              className="flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">{saving ? 'sync' : 'save'}</span>
              {savedSuccess ? '✓ ¡Guardado!' : saving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Split-Screen Container */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Section Selector Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
            {[
              { id: 'hero', label: '1. Hero Section', icon: 'view_carousel' },
              { id: 'specs', label: '2. Ficha Técnica', icon: 'tune' },
              { id: 'scarcity', label: '3. Escasez Banner', icon: 'bolt' },
              { id: 'breakdown', label: `4. Desglose (${formData.breakdownBlocks.length})`, icon: 'list_alt' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`px-3 py-2 rounded-lg font-mono text-xs font-bold uppercase transition-colors flex items-center gap-1.5 ${
                  activeSection === tab.id
                    ? 'bg-primary text-black shadow-lg shadow-primary/20'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* 1. HERO SECTION ACCORDION */}
          {activeSection === 'hero' && (
            <div className="bg-white/5 border border-white/10 p-5 rounded-xl flex flex-col gap-4 animate-fadeIn">
              <h2 className="text-sm font-bold uppercase font-mono text-primary flex items-center gap-2 border-b border-white/10 pb-3">
                <span className="material-symbols-outlined text-base">view_carousel</span>
                Configuración del Hero (Encabezado Principal)
              </h2>

              {/* Background Image */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono uppercase text-gray-400">Imagen de Fondo (Hero)</label>
                <div className="flex items-center gap-3">
                  <Input
                    name="heroImage"
                    value={formData.heroImage}
                    onChange={handleChange}
                    placeholder="https://... o sube una imagen"
                    className="flex-1 text-xs"
                  />
                  <label className="bg-white/10 hover:bg-white/20 text-white font-mono text-xs px-3 py-2.5 rounded cursor-pointer transition-colors flex items-center gap-1 shrink-0">
                    <span className="material-symbols-outlined text-sm">upload</span>
                    {uploadingField === 'heroImage' ? 'Subiendo...' : 'Subir Imagen'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'heroImage')}
                    />
                  </label>
                </div>
                {formData.heroImage && (
                  <div className="w-full h-24 rounded border border-white/10 bg-cover bg-center mt-1" style={{ backgroundImage: `url('${formData.heroImage}')` }} />
                )}
              </div>

              {/* Subtitle */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-mono uppercase text-gray-400">Subtítulo (debajo del Logo)</label>
                <Input
                  name="heroSubtitle"
                  value={formData.heroSubtitle}
                  onChange={handleChange}
                  placeholder="Ej: Bad Choices make good stories"
                />
              </div>

              {/* Headline */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-mono uppercase text-gray-400">Título Principal (Headline superior)</label>
                <Input
                  name="heroHeadline"
                  value={formData.heroHeadline}
                  onChange={handleChange}
                  placeholder="Ej: GANA ESTE AUTO"
                />
              </div>

              {/* Car Make & Model (Featured in Hero Banner) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-black/30 border border-primary/20 p-3 rounded-lg">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-mono uppercase text-primary font-bold">Marca del Auto</label>
                  <Input
                    name="carMake"
                    value={formData.carMake}
                    onChange={handleChange}
                    placeholder="Ej: Nissan"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-mono uppercase text-primary font-bold">Modelo / Texto Destacado en Hero</label>
                  <Input
                    name="carModel"
                    value={formData.carModel}
                    onChange={handleChange}
                    placeholder="Ej: 350Z (Tokyo Drift)"
                  />
                </div>
              </div>

              {/* Badges & Prize Cost */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-mono uppercase text-gray-400">Badge Evento</label>
                  <Input
                    name="heroBadgeEvent"
                    value={formData.heroBadgeEvent}
                    onChange={handleChange}
                    placeholder="Ej: EVENTO LIMITADO"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-mono uppercase text-gray-400">Badge REQ ID</label>
                  <Input
                    name="heroBadgeReqid"
                    value={formData.heroBadgeReqid}
                    onChange={handleChange}
                    placeholder="Ej: #FF-350Z"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-mono uppercase text-emerald-400 font-bold">Valor Premio (USD)</label>
                  <Input
                    type="number"
                    name="prizeCost"
                    value={formData.prizeCost}
                    onChange={handleChange}
                    placeholder="50000"
                  />
                </div>
              </div>

              {/* Countdown Timer Target Date */}
              <div className="bg-black/40 border border-primary/30 p-4 rounded-xl flex flex-col gap-2 mt-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">timer</span>
                  <label className="text-xs font-mono uppercase text-primary font-bold">
                    Fecha y Hora de Fin del Sorteo (Contador Regresivo)
                  </label>
                </div>
                <p className="text-[11px] text-gray-400 font-mono">
                  Esta fecha y hora determina el conteo regresivo (DÍAS : HRS : MIN : SEG) que se muestra en el Home.
                </p>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full bg-[#151515] border border-primary/50 rounded-lg p-2.5 text-white font-mono text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          )}

          {/* 2. FICHA TÉCNICA ACCORDION */}
          {activeSection === 'specs' && (
            <div className="bg-white/5 border border-white/10 p-5 rounded-xl flex flex-col gap-4 animate-fadeIn">
              <h2 className="text-sm font-bold uppercase font-mono text-primary flex items-center gap-2 border-b border-white/10 pb-3">
                <span className="material-symbols-outlined text-base">tune</span>
                Especificaciones del Vehículo & Ficha Técnica
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-mono uppercase text-gray-400">Marca del Auto</label>
                  <Input name="carMake" value={formData.carMake} onChange={handleChange} placeholder="Ej: Nissan" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-mono uppercase text-gray-400">Modelo del Auto</label>
                  <Input name="carModel" value={formData.carModel} onChange={handleChange} placeholder="Ej: 350Z (Tokyo Drift)" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-mono uppercase text-gray-400">Motor</label>
                  <Input name="carEngine" value={formData.carEngine} onChange={handleChange} placeholder="Ej: VQ35DE Twin-Turbo" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-mono uppercase text-gray-400">Potencia</label>
                  <Input name="carHorsepower" value={formData.carHorsepower} onChange={handleChange} placeholder="Ej: 460 WHP @ 12 PSI" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-mono uppercase text-gray-400">Color</label>
                  <Input name="carColor" value={formData.carColor} onChange={handleChange} placeholder="Ej: VeilSide Charcoal" />
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
                <h3 className="text-xs font-mono uppercase text-gray-300 font-bold">Encabezado de la Ficha Técnica</h3>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-mono uppercase text-gray-400">Título de la Sección</label>
                  <Input name="specTitle" value={formData.specTitle} onChange={handleChange} placeholder="Ej: FICHA TÉCNICA DEL PROYECTO" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-mono uppercase text-gray-400">Subtítulo de la Sección</label>
                  <Input name="specSubtitle" value={formData.specSubtitle} onChange={handleChange} placeholder="Ej: SPEC SHEET // 350Z VEILSIDE // EDITION V.26" />
                </div>
              </div>
            </div>
          )}

          {/* 3. BANNER DE ESCASEZ */}
          {activeSection === 'scarcity' && (
            <div className="bg-white/5 border border-white/10 p-5 rounded-xl flex flex-col gap-4 animate-fadeIn">
              <h2 className="text-sm font-bold uppercase font-mono text-primary flex items-center gap-2 border-b border-white/10 pb-3">
                <span className="material-symbols-outlined text-base">bolt</span>
                Banner Promocional / Escasez de Stock
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-mono uppercase text-gray-400">Tag Superior</label>
                  <Input name="scarcityTitle" value={formData.scarcityTitle} onChange={handleChange} placeholder="Ej: Stock Limitado" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-mono uppercase text-gray-400">Título Principal</label>
                  <Input name="scarcityHeadline" value={formData.scarcityHeadline} onChange={handleChange} placeholder="Ej: Mystery Boxes" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-mono uppercase text-gray-400">Subtítulo (Gris)</label>
                  <Input name="scarcitySubheadline" value={formData.scarcitySubheadline} onChange={handleChange} placeholder="Ej: Casi Agotadas" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-mono uppercase text-gray-400">Título Producto Promo</label>
                  <Input name="scarcityProductTitle" value={formData.scarcityProductTitle} onChange={handleChange} placeholder="Ej: Compra Misteriosa" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-mono uppercase text-gray-400">Porcentaje Vendido (Barra)</label>
                  <Input type="number" name="scarcityPercentSold" value={formData.scarcityPercentSold} onChange={handleChange} placeholder="85" min="0" max="100" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-mono uppercase text-gray-400">Descripción del Producto Promo</label>
                <Input name="scarcityProductDesc" value={formData.scarcityProductDesc} onChange={handleChange} placeholder="Ej: Incluye 500 entradas + Merch exclusiva" />
              </div>
            </div>
          )}

          {/* 4. DESGLOSE DEL PROYECTO (DYNAMIC BLOCKS) */}
          {activeSection === 'breakdown' && (
            <div className="bg-white/5 border border-white/10 p-5 rounded-xl flex flex-col gap-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h2 className="text-sm font-bold uppercase font-mono text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">list_alt</span>
                  Bloques del Desglose ({formData.breakdownBlocks.length} de 6)
                </h2>
                <Button
                  onClick={addBlock}
                  size="sm"
                  variant="secondary"
                  disabled={formData.breakdownBlocks.length >= 6}
                  className="text-xs flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  Agregar Bloque
                </Button>
              </div>

              {formData.breakdownBlocks.length === 0 ? (
                <div className="text-center py-8 text-gray-500 font-mono text-xs border border-dashed border-white/10 rounded-lg">
                  No hay bloques configurados. Haz clic en "Agregar Bloque" para crear el primero.
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {formData.breakdownBlocks.map((block, idx) => (
                    <div key={idx} className="bg-black/40 border border-white/10 p-4 rounded-lg flex flex-col gap-3 relative group">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="font-mono text-xs text-primary font-bold">
                          Bloque #{idx + 1} {idx % 2 !== 0 ? '(Invertido)' : ''}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveBlock(idx, -1)}
                            disabled={idx === 0}
                            className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white disabled:opacity-30"
                            title="Mover arriba"
                          >
                            <span className="material-symbols-outlined text-sm">arrow_upward</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => moveBlock(idx, 1)}
                            disabled={idx === formData.breakdownBlocks.length - 1}
                            className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white disabled:opacity-30"
                            title="Mover abajo"
                          >
                            <span className="material-symbols-outlined text-sm">arrow_downward</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => removeBlock(idx)}
                            className="p-1 hover:bg-red-500/20 text-red-400 rounded ml-2"
                            title="Eliminar bloque"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </div>

                      {/* Block Title */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-mono uppercase text-gray-400">Título del Bloque</label>
                        <Input
                          value={block.title || ''}
                          onChange={(e) => updateBlock(idx, 'title', e.target.value)}
                          placeholder="Ej: Motor VQ35DE Twin-Turbo"
                          className="text-xs"
                        />
                      </div>

                      {/* Block Description */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-mono uppercase text-gray-400">Descripción</label>
                        <textarea
                          value={block.description || ''}
                          onChange={(e) => updateBlock(idx, 'description', e.target.value)}
                          placeholder="Descripción detallada..."
                          rows={3}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-xs font-mono focus:outline-none focus:border-primary/50"
                        />
                      </div>

                      {/* Block Image */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-mono uppercase text-gray-400">Imagen del Bloque</label>
                        <div className="flex items-center gap-2">
                          <Input
                            value={block.image_url || ''}
                            onChange={(e) => updateBlock(idx, 'image_url', e.target.value)}
                            placeholder="URL o sube una imagen"
                            className="flex-1 text-xs"
                          />
                          <label className="bg-white/10 hover:bg-white/20 text-white font-mono text-[10px] px-2.5 py-2 rounded cursor-pointer shrink-0">
                            {uploadingField === `block_${idx}` ? '...' : 'Subir'}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, 'image_url', idx)}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Live Preview Sticky (5 cols) */}
        <div className="lg:col-span-5 sticky top-20">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs text-gray-400 uppercase font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-sm">visibility</span>
              Vista Previa en Vivo
            </span>
            <span className="text-[10px] font-mono text-gray-500">Se actualiza en tiempo real</span>
          </div>
          
          <HomePreview formData={formData} />
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminHomeEditor;
