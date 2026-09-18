import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { db } from '../../lib/db';
import { useTranslation } from '../../i18n/useTranslation';
import PageTransition from '../../components/layout/PageTransition';
import Tooltip from '../../components/ui/Tooltip';
import OrderDetailsModal from './OrderDetailsModal';

const AdminOrders = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();
  const { t, lang } = useTranslation();

  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, shipped, delivered
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const getStatusLabel = (status) => {
    const map = {
      all: t('common.all'),
      completed: lang === 'es' ? 'Completado' : 'Completed',
      pending: lang === 'es' ? 'Pendiente' : 'Pending',
      shipped: lang === 'es' ? 'Enviado' : 'Shipped',
      delivered: lang === 'es' ? 'Entregado' : 'Delivered',
      pending_payment: lang === 'es' ? 'Pago Pendiente' : 'Pending Payment',
      cancelled: lang === 'es' ? 'Cancelado' : 'Cancelled',
    };
    return map[status] || status;
  };

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/login', { replace: true });
      return;
    }
    fetchOrders();
  }, [isAdmin, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/orders`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      
      const enhancedOrders = data.map(order => {
        let formattedAddress = order.shipping_address || 'Sin dirección registrada';
        
        return {
          ...order,
          shippingStatus: order.status || 'pending',
          formattedAddress,
          customerName: order.user ? order.user.name : order.user_id,
          customerEmail: order.user ? order.user.email : '—',
          entriesEarned: order.entries_earned
        };
      });
      setOrders(enhancedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    // Optimistic UI update
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, shippingStatus: newStatus, status: newStatus } : o));

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shippingStatus: newStatus, status: newStatus })
      });
    } catch (error) {
      console.warn('API status update failed, syncing local db:', error);
    }

    try {
      db.updateOne('orders', orderId, { status: newStatus });
    } catch {
      // fallback ignore
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesFilter = filter === 'all' || o.shippingStatus === filter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      o.id.toLowerCase().includes(query) ||
      (o.customerName && o.customerName.toLowerCase().includes(query)) ||
      (o.customerEmail && o.customerEmail.toLowerCase().includes(query));
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-primary border-primary';
      case 'shipped': return 'text-blue-400 border-blue-400';
      case 'completed': return 'text-emerald-400 border-emerald-400';
      case 'pending_payment': return 'text-red-400 border-red-400';
      default: return 'text-yellow-400 border-yellow-400';
    }
  };

  const handlePrint = (order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow pop-ups to print tickets.");
      return;
    }

    const subtotal = parseFloat(order.subtotal || 0);
    const discount = parseFloat(order.discount || 0);
    const shipping = parseFloat(order.shipping || 0);
    const total = parseFloat(order.total || 0);

    printWindow.document.write(`
      <html>
        <head>
          <title>Packing Slip - ${order.id}</title>
          <style>
            body { font-family: monospace; padding: 20px; max-width: 80mm; margin: 0 auto; color: #000; }
            h1 { font-size: 1.2rem; text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; }
            .section { margin-bottom: 15px; border-bottom: 1px dashed #ccc; padding-bottom: 15px; }
            .item { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 0.9rem; }
            .row { display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 3px; }
            .bold { font-weight: bold; }
            @media print {
              @page { margin: 0; }
              body { padding: 5mm; }
            }
          </style>
        </head>
        <body>
          <h1>BORDER SPEC<br/>PACKING SLIP</h1>
          
          <div class="section">
            <p><span class="bold">Order:</span> ${order.id}</p>
            <p><span class="bold">Date:</span> ${new Date(order.created_at).toLocaleDateString()}</p>
            <p><span class="bold">Customer:</span> ${order.customerName}</p>
            <p><span class="bold">Email:</span> ${order.customerEmail}</p>
          </div>

          <div class="section">
            <p class="bold" style="margin-bottom: 5px;">SHIP TO:</p>
            <p>${order.formattedAddress}</p>
          </div>

          <div class="section">
            <p class="bold" style="margin-bottom: 5px;">ITEMS:</p>
            ${order.items?.map(i => `
              <div class="item">
                <span>${i.quantity}x ${i.name} ${i.size ? `(${i.size})` : ''}</span>
                <span>$${(parseFloat(i.price) * parseInt(i.quantity)).toFixed(2)}</span>
              </div>
            `).join('') || '<p style="font-size:0.8rem;">No items recorded</p>'}
          </div>

          <div class="section">
            <div class="row"><span>Subtotal:</span><span>$${subtotal.toFixed(2)}</span></div>
            ${discount > 0 ? `<div class="row"><span>Discount (${order.coupon_code || 'Coupon'}):</span><span>-$${discount.toFixed(2)}</span></div>` : ''}
            <div class="row"><span>Shipping:</span><span>$${shipping.toFixed(2)}</span></div>
            <div class="row bold" style="font-size: 0.95rem; margin-top: 5px;"><span>Total Paid:</span><span>$${total.toFixed(2)}</span></div>
            <div class="row" style="color: #444; margin-top: 3px;"><span>Entries Earned:</span><span>${order.entriesEarned || 0}</span></div>
          </div>

          <p style="text-align: center; font-size: 0.8rem; margin-top: 20px;">Thank you for your support!</p>
          <script>
            window.onload = () => { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleExportCSV = () => {
    // Create CSV headers
    const headers = ['Order ID', 'Date', 'Status', 'Customer Name', 'Customer Email', 'Address', 'Product Name', 'Size', 'Quantity', 'Price'];
    let csvContent = headers.join(',') + '\n';

    filteredOrders.forEach(order => {
      const orderId = order.id;
      const date = new Date(order.created_at).toLocaleDateString();
      const status = order.shippingStatus || order.status;
      const customer = `"${(order.customerName || '').replace(/"/g, '""')}"`;
      const email = order.customerEmail || '';
      const address = `"${(order.formattedAddress || '').replace(/"/g, '""')}"`;

      if (order.items && order.items.length > 0) {
        order.items.forEach(item => {
          const product = `"${(item.name || '').replace(/"/g, '""')}"`;
          const size = item.size || '';
          const qty = item.quantity || 1;
          const price = item.price || 0;
          
          csvContent += `${orderId},${date},${status},${customer},${email},${address},${product},${size},${qty},${price}\n`;
        });
      } else {
          csvContent += `${orderId},${date},${status},${customer},${email},${address},,,,0\n`;
      }
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <PageTransition className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin')} className="hover:bg-white/10 p-2 rounded-full transition-colors">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div>
              <h1 className="font-display font-black italic uppercase text-lg">Pedidos</h1>
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                Admin <span className="text-gray-600 mx-1">//</span> Logística
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-[#5ce020] text-black text-xs font-bold uppercase rounded transition-colors"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            {lang === 'es' ? 'Exportar Excel (CSV)' : 'Export CSV'}
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-black italic uppercase text-white">
            Orders Management
          </h1>
          
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 w-full md:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">search</span>
              <input
                type="text"
                placeholder={lang === 'es' ? "Buscar Orden ID, Nombre, Correo..." : "Search Order ID, Name, Email..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-primary focus:outline-none transition-colors font-mono"
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              {['all', 'completed', 'pending', 'shipped', 'delivered', 'pending_payment'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all whitespace-nowrap ${
                    filter === status 
                      ? 'bg-white text-black' 
                      : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                  }`}
                >
                  {getStatusLabel(status)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-white/5 border border-white/10 rounded-xl">
              <span className="material-symbols-outlined text-4xl text-gray-600 mb-2">inbox</span>
              <p className="text-gray-400 font-mono text-sm uppercase">{lang === 'es' ? 'No se encontraron órdenes' : 'No orders found'}</p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <div key={order.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="font-mono text-primary font-bold text-lg mb-1">{order.id}</h3>
                    <p className="text-xs text-gray-500 font-mono">{new Date(order.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-lg">${parseFloat(order.total || 0).toFixed(2)}</p>
                      <Tooltip content="Folios generados por esta compra." position="left">
                        <p className="text-[10px] text-gray-400 uppercase font-bold cursor-help w-max ml-auto">
                          {order.entriesEarned} Entries
                        </p>
                      </Tooltip>
                    </div>
                    <div className={`px-3 py-1 rounded border font-bold text-xs uppercase tracking-wider ${getStatusColor(order.shippingStatus)} bg-black/50`}>
                      {order.shippingStatus}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Items */}
                  <div>
                    <h4 className="text-xs uppercase text-gray-500 font-bold mb-3">Items Ordered</h4>
                    <div className="space-y-3">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-black rounded border border-white/10 flex-shrink-0 flex items-center justify-center">
                            <span className="material-symbols-outlined text-gray-600 text-sm">inventory_2</span>
                          </div>
                          <div>
                            <p className="text-sm font-bold truncate">{item.name}</p>
                            <p className="text-xs text-gray-400 font-mono">Qty: {item.quantity} | ${parseFloat(item.price || 0).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer Info & Actions */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs uppercase text-gray-500 font-bold mb-3">Shipping Info</h4>
                      <p className="text-sm font-bold text-white mb-1">{order.customerName}</p>
                      <p className="text-[10px] text-gray-500 font-mono mb-2">{order.customerEmail}</p>
                      <p className="text-xs text-gray-400 font-mono">{order.formattedAddress}</p>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="bg-white/5 hover:bg-white/10 border border-white/20 text-white text-xs uppercase font-bold px-3 py-2 rounded transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                      >
                        <span className="material-symbols-outlined text-[14px]">visibility</span>
                        View Details
                      </button>
                      <button 
                        onClick={() => handlePrint(order)}
                        className="bg-white/5 hover:bg-white/10 border border-white/20 text-white text-xs uppercase font-bold px-3 py-2 rounded transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                      >
                        <span className="material-symbols-outlined text-[14px]">print</span>
                        Print Ticket
                      </button>
                      <select 
                        value={order.shippingStatus}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="bg-black border border-white/20 text-white text-xs uppercase font-bold px-3 py-2 rounded focus:border-primary outline-none w-full sm:w-auto"
                      >
                        <option value="completed">Completed / Paid</option>
                        <option value="pending">Mark Pending</option>
                        <option value="shipped">Mark Shipped</option>
                        <option value="delivered">Mark Delivered</option>
                        <option value="pending_payment">Pending Payment</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <OrderDetailsModal 
          isOpen={!!selectedOrder}
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      </main>
    </PageTransition>
  );
};

export default AdminOrders;
