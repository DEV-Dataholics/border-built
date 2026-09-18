/**
 * Border Spec Entry Calculation Logic
 * Handles entry multipliers, calculations, and report generation
 */

import { db } from './db';

/**
 * Get the current active multiplier from config
 */
export const getMultiplier = () => {
  const config = db.getCollection('config');
  return config.defaultEntryMultiplier || 10;
};

/**
 * Calculate entries for a given price and product multiplier configuration
 * If product has its own active multiplier (hasMultiplier = true), use productMultiplier; otherwise use baseline 1x
 */
export const calculateEntries = (price, productOrMultiplier = null, hasMultiplier = false) => {
  let multiplier = 1;

  if (typeof productOrMultiplier === 'object' && productOrMultiplier !== null) {
    const isMultiplierActive = productOrMultiplier.hasMultiplier || productOrMultiplier.has_multiplier || false;
    const multVal = parseFloat(productOrMultiplier.entryMultiplier || productOrMultiplier.entry_multiplier) || 1;
    multiplier = isMultiplierActive && multVal > 1 ? multVal : 1;
  } else if (typeof productOrMultiplier === 'number') {
    // Direct multiplier passed in
    multiplier = hasMultiplier || productOrMultiplier > 1 ? productOrMultiplier : 1;
  }

  return Math.floor(price * multiplier);
};

/**
 * Calculate total entries for a cart
 * @param {Array} items - Array of cart items with { price, quantity, hasMultiplier?, entryMultiplier? }
 */
export const calculateCartEntries = (items = []) => {
  return items.reduce((total, item) => {
    const isMultiplierActive = item.hasMultiplier || item.has_multiplier || false;
    const multVal = parseFloat(item.entryMultiplier || item.entry_multiplier) || 1;
    const itemMultiplier = isMultiplierActive && multVal > 1 ? multVal : 1;
    const entriesPerUnit = Math.floor((item.price || 0) * itemMultiplier);
    return total + entriesPerUnit * (item.quantity || 1);
  }, 0);
};

/**
 * Generate entry report for admin CSV export
 * Returns array of report rows with verification data
 */
export const generateEntryReport = (filters = {}) => {
  const orders = db.getCollection('orders');
  const users = db.getCollection('users');

  // Build report rows
  const report = [];

  // Filter orders if needed
  let filteredOrders = orders;
  if (filters.userId) {
    filteredOrders = orders.filter((o) => o.userId === filters.userId);
  }
  if (filters.dateFrom) {
    filteredOrders = filteredOrders.filter(
      (o) => new Date(o.createdAt) >= new Date(filters.dateFrom)
    );
  }
  if (filters.dateTo) {
    filteredOrders = filteredOrders.filter(
      (o) => new Date(o.createdAt) <= new Date(filters.dateTo)
    );
  }

  filteredOrders.forEach((order) => {
    const user = users.find((u) => u.id === order.userId);
    if (!user) return;

    // Generate verification hash (simple mock — in production this would be cryptographic)
    const verificationHash = btoa(
      `${order.id}:${user.id}:${order.entriesEarned}:${order.createdAt}`
    ).slice(0, 16);

    report.push({
      orderId: order.id,
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      entriesEarned: order.entriesEarned,
      multiplierUsed: order.multiplierUsed,
      orderTotal: order.total,
      orderStatus: order.status,
      timestamp: order.createdAt,
      verificationHash,
    });
  });

  // Sort by timestamp descending
  report.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return report;
};

/**
 * Get user entry summary (for admin dashboard)
 */
export const getUserEntrySummary = () => {
  const users = db.findMany('users', { role: 'user' });
  const orders = db.getCollection('orders');

  return users.map((user) => {
    const userOrders = orders.filter((o) => o.userId === user.id);
    const totalEntries = userOrders.reduce(
      (sum, o) => sum + (o.entriesEarned || 0),
      0
    );
    const totalSpent = userOrders.reduce(
      (sum, o) => sum + (o.total || 0),
      0
    );

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      location: user.location || 'N/A',
      totalEntries,
      totalSpent,
      orderCount: userOrders.length,
      lastOrderDate: userOrders.length
        ? userOrders.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )[0].createdAt
        : null,
    };
  });
};
