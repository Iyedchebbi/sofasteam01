
import React, { useState } from 'react';
import { Product } from '../types';
import { generateProductDescription } from '../services/geminiService';
import { Plus, Edit2, Trash2, Wand2, Loader2, X, Save, Eye, EyeOff, AlertTriangle } from 'lucide-react';

interface AdminPanelProps {
  products: Product[];
  onAddProduct: (product: Product) => Promise<void>;
  onUpdateProduct: (product: Product) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<boolean>;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  products, 
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct,
  onClose
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: '',
    price: 0,
    description: '',
    image: '',
    in_stock: true
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      ...product,
      price: Number(product.price) // Ensure it's a number
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', category: '', price: 0, description: '', image: '', in_stock: true });
    setIsSaving(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    if (!formData.name?.trim()) { alert("Product Name is required"); return; }
    if (!formData.category?.trim()) { alert("Category is required"); return; }
    // Allow 0, but check for NaN
    if (formData.price === undefined || isNaN(Number(formData.price))) { alert("Valid Price is required"); return; }
    
    setIsSaving(true);
    try {
      const productData = {
        ...formData,
        price: Number(formData.price), // Ensure number type for DB
        image: formData.image || '',
        description: formData.description || '',
        in_stock: formData.in_stock ?? true
      } as Product;

      if (editingId) {
        await onUpdateProduct({ ...productData, id: editingId });
      } else {
        await onAddProduct({ ...productData, id: 'temp' });
      }
      resetForm();
    } catch (error) { 
      console.error("Save failed", error);
      // Error is alerted in parent
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirmationId) return;
    setIsDeleting(true);
    try {
        const success = await onDeleteProduct(deleteConfirmationId);
        if (success) setDeleteConfirmationId(null);
    } catch (error) { 
        console.error("Delete failed", error); 
    } finally { 
        setIsDeleting(false); 
    }
  };

  const handleGenerateDescription = async () => {
    if (!formData.name || !formData.category) { alert("Enter name and category first."); return; }
    setIsGenerating(true);
    try {
      const desc = await generateProductDescription(formData.name, formData.category);
      setFormData(prev => ({ ...prev, description: desc }));
    } catch (e) { alert("Failed to generate description."); } 
    finally { setIsGenerating(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto relative z-10 flex flex-col">
        <div className="p-6 border-b flex justify-between items-center bg-white/80 backdrop-blur sticky top-0 z-20">
          <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-6 h-6" /></button>
        </div>

        <div className="p-8 space-y-8 flex-1 overflow-y-auto">
          {/* Editor */}
          <form onSubmit={handleSave} className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              {editingId ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input type="text" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-5 py-3 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-brand-500" placeholder="Product Name" required />
              <input type="text" value={formData.category || ''} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full px-5 py-3 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-brand-500" placeholder="Category" required />
              <input 
                type="number" 
                step="0.01"
                min="0"
                value={formData.price === 0 ? '' : formData.price} 
                onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })} 
                className="w-full px-5 py-3 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-brand-500" 
                placeholder="Price (RON)" 
                required
              />
              <input type="text" value={formData.image || ''} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full px-5 py-3 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-brand-500" placeholder="Image URL (optional)" />

              <div className="col-span-full flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm cursor-pointer" onClick={() => setFormData({ ...formData, in_stock: !formData.in_stock })}>
                 <button type="button" className={`w-12 h-6 rounded-full transition-colors relative ${formData.in_stock ? 'bg-green-500' : 'bg-gray-300'}`}>
                   <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${formData.in_stock ? 'left-7' : 'left-1'}`} />
                 </button>
                 <span className="font-medium text-gray-700 select-none">{formData.in_stock ? 'Visible in Store' : 'Hidden / Out of Stock'}</span>
              </div>

              <div className="col-span-full relative">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-gray-500">Description</label>
                    <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1 rounded-full flex items-center gap-1">
                        {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />} Generate with AI
                    </button>
                </div>
                <textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-5 py-3 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-brand-500 h-32 resize-none" placeholder="Enter product description..." />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
                <button type="submit" disabled={isSaving} className="flex-1 bg-brand-900 text-white py-3 rounded-xl font-bold hover:bg-brand-800 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
                    {editingId ? 'Update Product' : 'Create Product'}
                </button>
                {editingId && <button type="button" onClick={resetForm} className="px-6 py-3 bg-white text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-colors">Cancel</button>}
            </div>
          </form>

          {/* List */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Inventory ({products.length})</h3>
            {products.map(product => (
                <div key={product.id} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all">
                    <div className="relative shrink-0">
                        <img 
                          src={product.image || 'https://placehold.co/400x500/e2e8f0/64748b?text=No+Image'} 
                          alt={product.name} 
                          className={`w-16 h-16 object-cover rounded-xl ${!product.in_stock ? 'grayscale opacity-50' : ''}`}
                          onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x500/e2e8f0/64748b?text=No+Image'; }}
                        />
                        {!product.in_stock && <div className="absolute inset-0 flex items-center justify-center"><EyeOff className="w-5 h-5 text-gray-600" /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 line-clamp-1">{product.name}</h4>
                        <p className="text-sm text-gray-500">{Number(product.price).toFixed(2)} RON</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                        <button onClick={() => handleEdit(product)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Edit2 className="w-5 h-5" /></button>
                        <button onClick={() => setDeleteConfirmationId(product.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><Trash2 className="w-5 h-5" /></button>
                    </div>
                </div>
            ))}
          </div>
        </div>

        {/* Delete Modal */}
        {deleteConfirmationId && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                <div className="bg-white shadow-2xl rounded-[2rem] p-8 max-w-sm w-full text-center border border-red-100">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500"><AlertTriangle className="w-8 h-8" /></div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Product?</h3>
                    <p className="text-gray-500 mb-6">This action cannot be undone.</p>
                    <div className="flex gap-3">
                        <button onClick={() => setDeleteConfirmationId(null)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">Cancel</button>
                        <button onClick={confirmDelete} disabled={isDeleting} className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 flex items-center justify-center gap-2">
                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
