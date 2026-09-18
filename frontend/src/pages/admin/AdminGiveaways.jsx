import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { useGiveawayStore } from '../../stores/useGiveawayStore';
import { useTranslation } from '../../i18n/useTranslation';
import { exportEntryReport } from '../../lib/csv';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import PageTransition from '../../components/layout/PageTransition';
import Tooltip from '../../components/ui/Tooltip';

const AdminGiveaways = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();
  const { t } = useTranslation();

  const [giveaways, setGiveaways] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const defaultForm = {
    name: '',
    startDate: '',
    endDate: '',
    prizeCost: '50000',
    ticketPromedio: '1000',
    averageMargin: '0.25',
    activeMultiplier: '10',
    isActive: false
  };

  const [formData, setFormData] = useState(defaultForm);

  const fetchGiveaways = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/giveaways`);
      if (!response.ok) throw new Error('Failed to fetch giveaways');
      const data = await response.json();
      setGiveaways(data);
    } catch (error) {
      console.error('Error fetching giveaways:', error);
    }
  };

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/login', { replace: true });
      return;
    }
    fetchGiveaways();
  }, [isAdmin, navigate]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData(defaultForm);
    setShowModal(true);
  };

  const handleEdit = (giveaway) => {
    setEditingId(giveaway.id);
    setFormData({
      name: giveaway.name || '',
      startDate: giveaway.start_date ? giveaway.start_date.split(' ')[0] : '',
      endDate: giveaway.end_date ? giveaway.end_date.split(' ')[0] : '',
      prizeCost: giveaway.prize_cost || '0',
      ticketPromedio: giveaway.ticket_promedio || '1000',
      averageMargin: giveaway.average_margin || 0.25,
      isActive: giveaway.is_active == 1,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      prizeCost: parseFloat(formData.prizeCost),
      ticketPromedio: parseFloat(formData.ticketPromedio),
      average_margin: parseFloat(formData.averageMargin),
      is_active: formData.isActive
    };
    
    try {
      if (editingId) {
        await fetch(`${import.meta.env.VITE_API_URL}/admin/giveaways/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch(`${import.meta.env.VITE_API_URL}/admin/giveaways`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      
      setShowModal(false);
      fetchGiveaways();
      useGiveawayStore.getState().invalidateCache();
    } catch (error) {
      console.error('Error saving giveaway:', error);
      alert('Hubo un error al guardar el giveaway.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this giveaway?')) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/admin/giveaways/${id}`, {
          method: 'DELETE'
        });
        fetchGiveaways();
      } catch (error) {
        console.error('Error deleting giveaway:', error);
      }
    }
  };

  const downloadReport = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/giveaways/${id}/reports`);
      if (!response.ok) throw new Error('Failed to fetch report');
      const data = await response.json();
      
      const reportList = Array.isArray(data?.report) ? data.report : (Array.isArray(data) ? data : []);
      
      if (reportList.length === 0) {
        alert('No hay entradas para este sorteo.');
        return;
      }

      // Use robust CSV export library
      exportEntryReport(reportList);

    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Hubo un error al generar el reporte.');
    }
  };

  const formatEndDate = (dateStr) => {
    if (!dateStr || dateStr.startsWith('0000')) return 'N/A';
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
  };

  return (
    <PageTransition className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/admin')} className="hover:bg-white/10 p-2 rounded-full transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-sm font-bold uppercase tracking-wider font-mono text-red-400">
            [ GIVEAWAY // MANAGER ]
          </h1>
          <div className="w-10" />
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-black italic uppercase text-white">
            Giveaways (Break-Even)
          </h1>
          <Button
            variant="primary"
            size="sm"
            onClick={openAddModal}
            icon={<span className="material-symbols-outlined text-sm">add</span>}
          >
            Create Giveaway
          </Button>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {giveaways.map((giveaway) => (
            <div key={giveaway.id} className="bg-white/5 border border-white/10 p-6 rounded-xl relative">
              {giveaway.is_active == 1 && (
                <div className="absolute top-4 right-4 bg-primary/20 text-primary text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded">
                  Active
                </div>
              )}
              {giveaway.is_active != 1 && (
                <div className="absolute top-4 right-4 bg-gray-500/20 text-gray-400 text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded">
                  Inactive
                </div>
              )}
              
              <h2 className="text-xl font-bold font-mono text-white mb-1">{giveaway.name}</h2>
              <p className="text-gray-400 text-sm mb-4">Ends: {formatEndDate(giveaway.end_date)}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Prize Cost</p>
                  <p className="text-white font-mono">${giveaway.prize_cost}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Target Rev</p>
                  <p className="text-primary font-mono font-bold">${giveaway.average_margin > 0 ? (giveaway.prize_cost / giveaway.average_margin).toFixed(2) : '0.00'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Margin</p>
                  <p className="text-white font-mono">{(giveaway.average_margin * 100).toFixed(0)}%</p>
                </div>
                <div>
                  <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Multiplier</p>
                  <p className="text-white font-mono">{giveaway.active_multiplier}x</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={() => navigate(`/admin/giveaways/${giveaway.id}/home-editor`)}
                  className="flex items-center gap-1 text-xs font-bold"
                >
                  <span className="material-symbols-outlined text-sm">edit_note</span>
                  Editar Home
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleEdit(giveaway)}>
                  Edit
                </Button>
                <Button variant="secondary" size="sm" onClick={() => downloadReport(giveaway.id)}>
                  Download Report
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleDelete(giveaway.id)} className="!text-red-500 hover:!bg-red-500/10">
                  Delete
                </Button>
              </div>
            </div>
          ))}
          {giveaways.length === 0 && (
            <div className="col-span-1 md:col-span-2 py-12 text-center text-gray-500 font-mono text-xs uppercase bg-white/5 border border-white/10 rounded-xl">
              No giveaways found
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#121212] border border-white/10 rounded-xl w-full max-w-lg">
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <h3 className="font-bold uppercase tracking-wider text-sm text-white">
                {editingId ? 'Edit Giveaway' : 'Create Giveaway'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4">
                <Input
                  label="Project Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Nissan Skyline R34"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Tooltip 
                  content="Costo Total del Premio (CP): Lo que te costó el carro + la pauta de marketing + los gastos de envío/entrega. Ej: $300,000" 
                  position="top"
                >
                  <div>
                    <Input
                      label="Prize Cost (USD)"
                      name="prizeCost"
                      type="number"
                      step="0.01"
                      value={formData.prizeCost}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </Tooltip>
                
                <Tooltip 
                  content="Ticket Promedio (TP). Cuánto gasta un usuario en promedio. Ayuda a estimar las órdenes necesarias." 
                  position="top"
                >
                  <div>
                    <Input
                      label="Ticket Promedio (USD)"
                      name="ticketPromedio"
                      type="number"
                      step="0.01"
                      value={formData.ticketPromedio}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </Tooltip>

                <Tooltip 
                  content="Margen de Contribución Promedio (MCP). A tu ticket promedio quítale costo de producto y envío. Si el ticket es $1,000 y te quedan $600, el margen es 0.60" 
                  position="top"
                >
                  <div>
                    <Input
                      label="Average Margin (e.g. 0.25)"
                      name="averageMargin"
                      type="number"
                      step="0.01"
                      value={formData.averageMargin}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </Tooltip>
              </div>

              {/* Break-Even Explanation Box */}
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 my-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary text-lg">calculate</span>
                  <h4 className="text-primary font-bold uppercase text-xs tracking-wider">La Matemática del Break-Even</h4>
                </div>
                
                <div className="text-gray-300 text-xs font-mono space-y-2">
                  {(() => {
                    const cp = parseFloat(formData.prizeCost) || 0;
                    const tp = parseFloat(formData.ticketPromedio) || 1000; 
                    const margin = parseFloat(formData.averageMargin) || 1;
                    const revTarget = cp / margin;
                    const mcp = tp * margin;
                    const orders = revTarget / tp;
                    
                    return (
                      <>
                        <p>1. <strong>Costo del Premio:</strong> ${cp.toLocaleString()}</p>
                        <p>2. <strong>Margen (%):</strong> {(margin * 100).toFixed(0)}% (Ej. Ticket ${tp.toLocaleString()} = Deja ${mcp.toLocaleString()} libres)</p>
                        <div className="h-px bg-primary/20 my-2 w-full" />
                        <p className="text-white font-bold text-[11px]">Meta de Ingresos Brutos (Revenue Target):</p>
                        <p className="text-primary text-lg font-black">${revTarget.toLocaleString()}</p>
                        <p className="text-gray-400 text-[10px] mt-1">Se necesitan aprox. <strong>{Math.ceil(orders)} órdenes</strong> de ${tp.toLocaleString()} para pagar el premio y empezar a generar utilidad.</p>
                      </>
                    );
                  })()}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                />
                <Input
                  label="End Date (Fecha Límite / Contador)"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col justify-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-2"
                    />
                    <span className="text-sm text-white font-mono uppercase tracking-wider">Set as Active</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-white/10">
                <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageTransition>
  );
};

export default AdminGiveaways;
