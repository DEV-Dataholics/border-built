/**
 * Border Spec Mock Database Engine
 * JSON + localStorage CRUD operations
 */

import productsData from '../data/seed/products.json';
import giveawaysData from '../data/seed/giveaways.json';
import usersData from '../data/seed/users.json';
import ordersData from '../data/seed/orders.json';
import winnersData from '../data/seed/winners.json';
import communityHighlightsData from '../data/seed/community_highlights.json';
import configData from '../data/seed/config.json';

const SEED_MAP = {
  products: productsData,
  giveaways: giveawaysData,
  users: usersData,
  orders: ordersData,
  winners: winnersData,
  community_highlights: communityHighlightsData,
  config: configData,
};

const DB_PREFIX = 'border_db_v9_';

// --- ID Generation ---
let idCounter = Date.now();
const generateId = (prefix = 'id') => {
  idCounter += 1;
  return `${prefix}_${idCounter.toString(36)}`;
};

// --- Core Engine ---

/**
 * Initialize DB: load seeds into localStorage if not already present
 */
const initDB = () => {
  Object.entries(SEED_MAP).forEach(([collection, seedData]) => {
    const key = `${DB_PREFIX}${collection}`;
    if (!localStorage.getItem(key)) {
      // Config is a single object, not an array
      localStorage.setItem(key, JSON.stringify(seedData));
    }
  });
};

/**
 * Get entire collection from localStorage
 */
const getCollection = (name) => {
  const key = `${DB_PREFIX}${name}`;
  const raw = localStorage.getItem(key);
  if (!raw) {
    // Try to init and retry
    const seed = SEED_MAP[name];
    if (seed) {
      localStorage.setItem(key, JSON.stringify(seed));
      return JSON.parse(JSON.stringify(seed));
    }
    return name === 'config' ? {} : [];
  }
  return JSON.parse(raw);
};

/**
 * Save entire collection to localStorage
 */
const saveCollection = (name, data) => {
  const key = `${DB_PREFIX}${name}`;
  localStorage.setItem(key, JSON.stringify(data));
};

/**
 * Find a single document by ID
 */
const findById = (collection, id) => {
  const data = getCollection(collection);
  if (Array.isArray(data)) {
    return data.find((item) => item.id === id) || null;
  }
  // Config is a single object
  return data;
};

/**
 * Find multiple documents matching filters
 * Filters: { key: value } — shallow equality match
 */
const findMany = (collection, filters = {}) => {
  const data = getCollection(collection);
  if (!Array.isArray(data)) return [data];

  return data.filter((item) =>
    Object.entries(filters).every(([key, value]) => item[key] === value)
  );
};

/**
 * Insert a new document into a collection
 */
const insertOne = (collection, doc) => {
  const data = getCollection(collection);
  if (!Array.isArray(data)) {
    // Config: merge
    const updated = { ...data, ...doc, updatedAt: new Date().toISOString() };
    saveCollection(collection, updated);
    return updated;
  }

  const prefix = collection.slice(0, 3); // 'pro', 'use', 'ord', etc.
  const newDoc = {
    ...doc,
    id: doc.id || generateId(prefix),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  data.push(newDoc);
  saveCollection(collection, data);
  return newDoc;
};

/**
 * Update a document by ID
 */
const updateOne = (collection, id, updates) => {
  const data = getCollection(collection);

  if (!Array.isArray(data)) {
    // Config: merge
    const updated = { ...data, ...updates, updatedAt: new Date().toISOString() };
    saveCollection(collection, updated);
    return updated;
  }

  const index = data.findIndex((item) => item.id === id);
  if (index === -1) return null;

  data[index] = {
    ...data[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveCollection(collection, data);
  return data[index];
};

/**
 * Delete a document by ID
 */
const deleteOne = (collection, id) => {
  const data = getCollection(collection);
  if (!Array.isArray(data)) return false;

  const filtered = data.filter((item) => item.id !== id);
  if (filtered.length === data.length) return false;

  saveCollection(collection, filtered);
  return true;
};

/**
 * Reset entire DB — clears localStorage and reloads seeds
 */
const resetDB = () => {
  Object.keys(SEED_MAP).forEach((collection) => {
    localStorage.removeItem(`${DB_PREFIX}${collection}`);
  });
  initDB();
};

/**
 * Get count of documents in a collection
 */
const count = (collection, filters = {}) => {
  return findMany(collection, filters).length;
};

export const db = {
  initDB,
  getCollection,
  findById,
  findMany,
  insertOne,
  updateOne,
  deleteOne,
  resetDB,
  generateId,
  count,
};
