import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { db } from '../../lib/db';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import PageTransition from '../../components/layout/PageTransition';
import Tooltip from '../../components/ui/Tooltip';

const AdminProducts = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();

  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const defaultForm = {
    name: '',
    slug: '',
    category: 'hoodies',
    description: '',
    price: '',
    compare_at_price: '',
    imageUrl: '',
    stock: '',
    colors: '',
    sizes: '',
    models: '',
    hasMultiplier: false,
    entryMultiplier: 5,
    isMysteryBox: false,
    featured: false,
    isActive: true,
    tags: '',
    bundleItems: []
  };

  const [formData, setFormData] = useState(defaultForm);
  const [bundleItemSelect, setBundleItemSelect] = useState({ productId: '', quantity: 1 });

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/products`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.warn('Error fetching products API, using local db fallback:', error);
      const localProducts = db.getCollection('products');
      setProducts(localProducts);
    }
  };

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/login', { replace: true });
      return;
    }
    fetchProducts();
  }, [isAdmin, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData((prev) => ({ ...prev, name, slug: generateSlug(name) }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processImageFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, imageUrl: e.target.result }));
      };
      reader.readAsDataURL(file);
    } else {
      alert('Por favor sube solo archivos de imagen (PNG, WebP, JPG).');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processImageFile(e.target.files[0]);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData(defaultForm);
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name || '',
      slug: product.slug || '',
      category: product.category || 'hoodies',
      description: product.description || '',
      price: product.price || '',
      compare_at_price: product.compare_at_price || '',
      imageUrl: product.images?.[0] || '',
      stock: product.stock !== undefined ? product.stock : '',
      colors: Array.isArray(product.colors) ? product.colors.join(', ') : '',
      sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : '',
      models: Array.isArray(product.models) ? product.models.join(', ') : '',
      hasMultiplier: product.hasMultiplier || product.has_multiplier || false,
      entryMultiplier: product.entryMultiplier || product.entry_multiplier || 5,
      isMysteryBox: product.isMysteryBox || product.category === 'mystery',
      featured: product.featured || false,
      isActive: product.is_active !== undefined ? Number(product.is_active) === 1 : true,
      tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
      bundleItems: product.bundleItems || []
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      slug: formData.slug,
      category: formData.category,
      description: formData.description,
      price: parseFloat(formData.price),
      compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
      images: [formData.imageUrl || '/images/products/placeholder.png'],
      stock: formData.stock ? parseInt(formData.stock) : 0,
      colors: formData.colors ? formData.colors.split(',').map(s => s.trim()).filter(Boolean) : [],
      sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
      models: formData.models ? formData.models.split(',').map(s => s.trim()).filter(Boolean) : [],
      tags: formData.tags ? formData.tags.split(',').map(s => s.trim()).filter(Boolean) : [],
      hasMultiplier: formData.hasMultiplier,
      entryMultiplier: formData.hasMultiplier ? parseInt(formData.entryMultiplier || 5) : 1,
      isMysteryBox: formData.isMysteryBox,
      featured: formData.featured ? 1 : 0,
      isActive: formData.isActive ? 1 : 0,
      bundleItems: formData.isMysteryBox ? formData.bundleItems : []
    };

    try {
      try {
        if (editingId) {
          await fetch(`${import.meta.env.VITE_API_URL}/admin/products/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        } else {
          await fetch(`${import.meta.env.VITE_API_URL}/admin/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }
      } catch (err) {
        console.warn('API save failed, using local DB update:', err);
      }

      // Sync local db engine
      if (editingId) {
        db.updateOne('products', editingId, payload);
      } else {
        db.insertOne('products', { id: `prod_${Date.now()}`, ...payload });
      }

      setShowModal(false);
      setEditingId(null);
      setFormData(defaultForm);
      setBundleItemSelect({ productId: '', quantity: 1 });
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Hubo un error al guardar el producto.');
    }
  };

  const addBundleItem = () => {
    if (!bundleItemSelect.productId || bundleItemSelect.quantity < 1) return;
    const prod = products.find(p => p.id === bundleItemSelect.productId);
    if (prod) {
      setFormData(prev => ({
        ...prev,
        bundleItems: [...prev.bundleItems, { productId: prod.id, name: prod.name, quantity: parseInt(bundleItemSelect.quantity) }]
      }));
      setBundleItemSelect({ productId: '', quantity: 1 });
    }
  };

  const removeBundleItem = (index) => {
    setFormData(prev => ({
      ...prev,
      bundleItems: prev.bundleItems.filter((_, i) => i !== index)
    }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/admin/products/${id}`, {
          method: 'DELETE'
        });
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <PageTransition className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/admin')} className="hover:bg-white/10 p-2 rounded-full transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-sm font-bold uppercase tracking-wider font-mono text-red-400">
            [ INVENTORY // MANAGER ]
          </h1>
          <div className="w-10" />
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-black italic uppercase text-white">
            Products
          </h1>
          <Button
            variant="primary"
            size="sm"
            onClick={openAddModal}
            icon={<span className="material-symbols-outlined text-sm">add</span>}
          >
            Add Product
          </Button>
        </div>

        {/* Product List */}
        <div className="flex flex-col gap-4">
          {/* Desktop Header */}
          <div className="hidden md:grid grid-cols-7 gap-4 border-b border-white/10 pb-3 px-4">
            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Image</div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Name</div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Price</div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Category</div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Multiplicador</div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Stock</div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold text-right">Actions</div>
          </div>

          {/* Product Items */}
          {products.map((product, index) => {
            const hasMult = product.hasMultiplier || product.has_multiplier || false;
            const multVal = product.entryMultiplier || product.entry_multiplier || 1;
            
            return (
              <div key={`admin-prod-${product.id}-${index}`} className="bg-white/5 md:bg-transparent border border-white/10 md:border-b md:border-x-0 md:border-t-0 md:border-white/5 rounded-xl md:rounded-none p-4 md:p-4 hover:bg-white/5 transition-colors grid grid-cols-1 md:grid-cols-7 gap-4 md:items-center">
                {/* Image & Mobile Header */}
                <div className="flex items-center gap-4 md:block">
                  <img src={product.images[0]} alt={product.name} className="w-16 h-16 md:w-10 md:h-10 object-cover rounded border border-white/10 flex-shrink-0" />
                  <div className="md:hidden flex-1 min-w-0">
                    <p className="text-white font-bold text-sm truncate flex items-center gap-2">
                    <span>{product.name}</span>
                    {Number(product.is_active) === 0 && (
                      <span className="material-symbols-outlined text-red-500 text-sm" title="Oculto / Inactivo">visibility_off</span>
                    )}
                  </p>
                    <p className="font-mono text-xs text-primary">${product.price.toFixed(2)}</p>
                  </div>
                </div>
                
                {/* Desktop Name */}
                <div className="hidden md:block text-white font-bold text-xs truncate" data-testid="product-name">
                  <div className="flex items-center gap-2">
                    <span>{product.name}</span>
                    {Number(product.is_active) === 0 && (
                      <span className="material-symbols-outlined text-red-500 text-sm" title="Oculto / Inactivo">visibility_off</span>
                    )}
                  </div>
                </div>
                {/* Desktop Price */}
                <div className="hidden md:block font-mono text-xs text-primary">${product.price.toFixed(2)}</div>
                
                {/* Category */}
                <div className="flex justify-between md:block text-xs">
                  <span className="md:hidden text-gray-500 uppercase font-bold">Category</span>
                  <span className="text-gray-400 uppercase">{product.category}</span>
                </div>

                {/* Multiplier */}
                <div className="flex justify-between md:block text-xs">
                  <span className="md:hidden text-gray-500 uppercase font-bold">Multiplicador</span>
                  {hasMult && multVal > 1 ? (
                    <span className="bg-primary/20 text-primary border border-primary/40 font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                      {multVal}X ACTIVADO
                    </span>
                  ) : (
                    <span className="text-gray-500 font-mono text-[10px]">1X (Base)</span>
                  )}
                </div>

                {/* Stock */}
                <div className="flex justify-between md:block text-xs">
                  <span className="md:hidden text-gray-500 uppercase font-bold">Stock</span>
                  <span className="font-mono text-white">{product.stock !== undefined ? product.stock : '∞'}</span>
                </div>

              {/* Actions */}
              <div className="flex justify-end md:justify-end gap-2 pt-4 md:pt-0 border-t border-white/10 md:border-none mt-2 md:mt-0">
                <button 
                  onClick={() => handleEdit(product)}
                  className="bg-white/5 hover:bg-white/10 md:bg-transparent md:hover:bg-transparent border border-white/10 md:border-none text-gray-400 hover:text-white px-3 py-1.5 md:p-1 rounded transition-colors flex items-center justify-center gap-2 flex-1 md:flex-none"
                  title="Edit Product"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  <span className="md:hidden text-xs uppercase font-bold">Edit</span>
                </button>
                <button 
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500/10 hover:bg-red-500/20 md:bg-transparent md:hover:bg-transparent border border-red-500/20 md:border-none text-red-500 hover:text-red-400 px-3 py-1.5 md:p-1 rounded transition-colors flex items-center justify-center gap-2 flex-1 md:flex-none"
                  title="Delete Product"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  <span className="md:hidden text-xs uppercase font-bold">Delete</span>
                </button>
              </div>
            </div>
          );
        })}
          {products.length === 0 && (
            <div className="py-12 text-center text-gray-500 font-mono text-xs uppercase bg-white/5 border border-white/10 rounded-xl">
              No products found
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/80 backdrop-blur-sm p-4 pt-12 pb-24 overflow-y-auto">
          <div className="bg-[#121212] border border-white/10 rounded-xl w-full max-w-2xl my-8 relative">
            <div className="flex justify-between items-center p-4 border-b border-white/10 sticky top-0 bg-[#121212] z-10 rounded-t-xl">
              <h3 className="font-bold uppercase tracking-wider text-sm text-white">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Product Name"
                  name="name"
                  value={formData.name}
                  onChange={handleNameChange}
                  required
                  placeholder="Ex: Hoodie Drift"
                />
                
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
                    Product Image (Drag & Drop)
                  </label>
                  <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center transition-colors cursor-pointer overflow-hidden h-[82px] ${isDragging ? 'border-primary bg-primary/10' : 'border-white/20 bg-white/5 hover:border-white/40'}`}
                    onClick={() => document.getElementById('image-upload').click()}
                  >
                    <input 
                      type="file" 
                      id="image-upload" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    
                    {formData.imageUrl ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-black">
                        <img src={formData.imageUrl} alt="Preview" className="h-full object-contain" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/60 transition-opacity">
                          <span className="material-symbols-outlined text-white text-3xl">swap_horiz</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center pointer-events-none mt-1">
                        <span className="material-symbols-outlined text-gray-400 text-2xl mb-0">cloud_upload</span>
                        <p className="text-[9px] text-primary uppercase font-bold tracking-wider">Max 2MB • 1080x1080 • WebP/PNG</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Input
                  label="Price (USD)"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Compare At (USD)"
                  name="compare_at_price"
                  type="number"
                  step="0.01"
                  value={formData.compare_at_price}
                  onChange={handleChange}
                  placeholder="Optional"
                />
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-[#151515] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary/50 font-mono text-sm"
                  >
                    <option value="hoodies">HOODIES</option>
                    <option value="tshirts">T-SHIRTS</option>
                    <option value="accessories">ACCESSORIES</option>
                    <option value="mystery">MYSTERY BOX</option>
                    <option value="quick_entries">QUICK ENTRIES</option>
                  </select>
                </div>
                <Input
                  label="Stock Qty"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="Ex: 50"
                />
              </div>

              <Input
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />

              <div className="border-t border-white/10 mt-2 pt-4">
                <div className="flex items-center gap-2 mb-4">
                  <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0">Advanced Attributes (Comma Separated)</h4>
                  <Tooltip content="Estos atributos generarán selectores en la página del producto para que el cliente elija (ej. seleccionar Talla o Color)." position="top">
                    <span className="material-symbols-outlined text-[12px] text-gray-500 hover:text-primary cursor-help">help</span>
                  </Tooltip>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Colors"
                    name="colors"
                    value={formData.colors}
                    onChange={handleChange}
                    placeholder="Black, Red, Neon"
                  />
                  <Input
                    label="Sizes"
                    name="sizes"
                    value={formData.sizes}
                    onChange={handleChange}
                    placeholder="S, M, L, XL"
                  />
                  <Input
                    label="Models"
                    name="models"
                    value={formData.models}
                    onChange={handleChange}
                    placeholder="350z, Skyline"
                  />
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <Input
                    label="Tags (Comma Separated)"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="BEST SELLER, NEW"
                  />
                  <label className="flex items-center gap-3 cursor-pointer mt-4 md:mt-6">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only"
                        checked={formData.featured}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      />
                      <div className={`w-10 h-6 bg-black border ${formData.featured ? 'border-primary' : 'border-white/20'} rounded-full transition-colors`}></div>
                      <div className={`absolute w-4 h-4 bg-white rounded-full top-1 transition-transform ${formData.featured ? 'translate-x-5 bg-primary' : 'translate-x-1'}`}></div>
                    </div>
                    <span className="text-sm font-bold uppercase tracking-wider text-white">Featured (Best Seller)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer mt-4">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={formData.isActive} 
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))} 
                      />
                      <div className={`w-10 h-6 bg-black border ${formData.isActive ? 'border-primary' : 'border-white/20'} rounded-full transition-colors`}></div>
                      <div className={`absolute w-4 h-4 bg-white rounded-full top-1 transition-transform ${formData.isActive ? 'translate-x-5 bg-primary' : 'translate-x-1'}`}></div>
                    </div>
                    <span className="text-sm font-bold uppercase tracking-wider text-white">Visible (Activo en Tienda)</span>
                  </label>
                </div>
              </div>

              {/* Multiplier Configuration Section */}
              <div className="border-t border-white/10 mt-2 pt-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 border border-white/10 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={formData.hasMultiplier}
                        onChange={(e) => setFormData(prev => ({ ...prev, hasMultiplier: e.target.checked }))}
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                    <div>
                      <p className="text-white text-xs font-bold uppercase font-mono mb-0">Activar Multiplicador Especial</p>
                      <p className="text-gray-400 text-[10px] font-mono">Si se desactiva, otorga la tasa base de 1 boleto por $1 USD (1x).</p>
                    </div>
                  </div>

                  {formData.hasMultiplier && (
                    <div className="w-full md:w-64">
                      <label className="block text-[10px] text-primary font-mono font-bold uppercase tracking-wider mb-1">
                        Multiplicador (ej. 2, 5, 20, 500)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          max="100000"
                          value={formData.entryMultiplier}
                          onChange={(e) => setFormData(prev => ({ ...prev, entryMultiplier: e.target.value }))}
                          className="w-full bg-[#151515] border border-primary/50 rounded-lg p-2 text-white font-mono font-bold text-sm focus:outline-none focus:border-primary pr-8"
                          required={formData.hasMultiplier}
                        />
                        <span className="absolute right-3 top-2 text-xs font-mono font-bold text-primary">X</span>
                      </div>
                      <p className="text-[10px] text-primary/90 font-mono mt-1 font-semibold">
                        Genera: {Math.floor((parseFloat(formData.price) || 0) * (parseInt(formData.entryMultiplier) || 1)).toLocaleString()} boletos (${parseFloat(formData.price) || 0} × {parseInt(formData.entryMultiplier) || 1}X)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Mystery Box Builder Section */}
              <div className="border-t border-white/10 mt-2 pt-4">
                <label className="flex items-center gap-3 cursor-pointer mb-4">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only"
                      checked={formData.isMysteryBox}
                      onChange={(e) => setFormData(prev => ({ ...prev, isMysteryBox: e.target.checked }))}
                    />
                    <div className={`w-10 h-6 bg-black border ${formData.isMysteryBox ? 'border-primary' : 'border-white/20'} rounded-full transition-colors`}></div>
                    <div className={`absolute w-4 h-4 bg-white rounded-full top-1 transition-transform ${formData.isMysteryBox ? 'translate-x-5 bg-primary' : 'translate-x-1'}`}></div>
                  </div>
                  <span className="text-sm font-bold uppercase tracking-wider text-white">Is Mystery Box Bundle?</span>
                </label>

                {formData.isMysteryBox && (
                  <div className="bg-black/50 border border-white/10 rounded-xl p-4 mt-2">
                    <h4 className="text-primary text-xs font-bold uppercase mb-4">Bundle Contents</h4>
                    
                    {/* Items List */}
                    <div className="space-y-2 mb-4">
                      {formData.bundleItems.length === 0 ? (
                        <p className="text-gray-500 text-xs font-mono">No items added to this bundle yet.</p>
                      ) : (
                        formData.bundleItems.map((item, index) => (
                          <div key={index} className="flex items-center justify-between bg-white/5 p-2 rounded border border-white/10">
                            <span className="text-sm text-white font-mono">{item.quantity}x {item.name}</span>
                            <button 
                              type="button" 
                              onClick={() => removeBundleItem(index)}
                              className="text-red-500 hover:text-red-400 p-1"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Add Item Form */}
                    <div className="flex flex-col md:flex-row gap-2 items-end">
                      <div className="flex-1 w-full">
                        <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
                          Select Product
                        </label>
                        <select
                          value={bundleItemSelect.productId}
                          onChange={(e) => setBundleItemSelect(prev => ({ ...prev, productId: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors text-sm"
                        >
                          <option value="" className="bg-[#121212] text-white">-- Choose Product --</option>
                          {products.filter(p => !p.isMysteryBox && p.id !== editingId).map((p, index) => (
                            <option key={`opt-${p.id}-${index}`} value={p.id} className="bg-[#121212] text-white">
                              {p.name} (Stock: {p.stock !== undefined ? p.stock : '∞'})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-24">
                        <Input
                          label="Qty"
                          type="number"
                          value={bundleItemSelect.quantity}
                          onChange={(e) => setBundleItemSelect(prev => ({ ...prev, quantity: e.target.value }))}
                          min="1"
                        />
                      </div>
                      <Button type="button" variant="primary" onClick={addBundleItem} className="h-[46px] mb-[2px]">
                        Add
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-white/10">
                <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary">{editingId ? 'Save Changes' : 'Create Product'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageTransition>
  );
};

export default AdminProducts;
