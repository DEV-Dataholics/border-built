import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../lib/db';

const OrderDetailsModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  // Helper to resolve bundle items for a mystery box item
  const getBundleItems = (item) => {
    if (item.bundleItems && Array.isArray(item.bundleItems) && item.bundleItems.length > 0) {
      return item.bundleItems;
    }
    // Dynamic fallback: look up product in local DB
    const allProds = db.getCollection('products');
    const matched = allProds.find(p => p.id === item.productId || p.name?.toLowerCase() === item.name?.toLowerCase() || p.category === 'mystery');
    if (matched && matched.bundleItems && Array.isArray(matched.bundleItems) && matched.bundleItems.length > 0) {
      return matched.bundleItems;
    }
    return [];
  };

  const subtotal = parseFloat(order.subtotal || 0);
  const discount = parseFloat(order.discount || 0);
  const shipping = parseFloat(order.shipping || 0);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-[#111] border border-white/20 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-bold font-mono text-primary">Order {order.id}</h2>
              <p className="text-sm text-gray-400 font-mono">{new Date(order.created_at || order.createdAt).toLocaleString()}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <span className="material-symbols-outlined text-gray-400">close</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-xs uppercase font-bold text-gray-500 mb-2">Customer Details</h3>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="font-bold text-white text-sm">{order.customerName}</p>
                <p className="text-gray-400 text-xs font-mono mb-2">{order.customerEmail}</p>
                <p className="text-gray-300 text-sm whitespace-pre-wrap">{order.formattedAddress}</p>
              </div>
            </div>
            <div>
              <h3 className="text-xs uppercase font-bold text-gray-500 mb-2">Order Summary</h3>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Status</span>
                  <span className="font-bold uppercase text-primary">{order.shippingStatus}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Entries Earned</span>
                  <span className="font-bold text-white">{order.entriesEarned}</span>
                </div>
                {subtotal > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="font-mono text-gray-300">${subtotal.toFixed(2)}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-400">
                    <span>Discount ({order.coupon_code || 'Coupon'})</span>
                    <span className="font-mono">-${discount.toFixed(2)}</span>
                  </div>
                )}
                {shipping > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Shipping</span>
                    <span className="font-mono text-gray-300">${shipping.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm pt-2 border-t border-white/10">
                  <span className="text-gray-300 font-bold">Total</span>
                  <span className="font-bold text-white font-mono">${parseFloat(order.total || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase font-bold text-gray-500 mb-2">Ordered Items</h3>
            <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-4 py-2 text-gray-400 font-normal">Item</th>
                    <th className="px-4 py-2 text-gray-400 font-normal">Variant</th>
                    <th className="px-4 py-2 text-gray-400 font-normal text-right">Price</th>
                    <th className="px-4 py-2 text-gray-400 font-normal text-center">Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, idx) => {
                      const isMystery = item.isMysteryBox || item.name?.toLowerCase().includes('mystery');
                      const bundles = isMystery ? getBundleItems(item) : [];

                      return (
                        <tr key={idx} className="align-top">
                          <td className="px-4 py-3">
                            <span className="font-bold text-white">{item.name}</span>
                            {bundles.length > 0 && (
                              <div className="mt-2.5 p-3 bg-primary/10 border border-primary/30 rounded-lg font-mono">
                                <div className="flex items-center gap-1.5 text-primary font-bold text-[11px] uppercase tracking-wider mb-2">
                                  <span className="material-symbols-outlined text-xs">inventory_2</span>
                                  <span>Contenido a Enviar (x{item.quantity} {item.quantity === 1 ? 'Caja' : 'Cajas'}):</span>
                                </div>
                                <ul className="space-y-1">
                                  {bundles.map((b, bIdx) => (
                                    <li key={bIdx} className="text-xs flex items-center justify-between text-gray-200 bg-black/50 px-2.5 py-1 rounded border border-white/5">
                                      <span>
                                        <span className="text-primary font-mono font-black">{b.quantity * item.quantity}x</span> {b.name || b.productId}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs">
                            {item.size || ''} {item.color ? `/ ${item.color}` : ''}
                          </td>
                          <td className="px-4 py-3 text-right font-mono">${parseFloat(item.price || 0).toFixed(2)}</td>
                          <td className="px-4 py-3 text-center font-bold">{item.quantity}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-4 py-6 text-center text-gray-500 text-xs uppercase">No items recorded</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded text-sm font-bold uppercase transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OrderDetailsModal;
