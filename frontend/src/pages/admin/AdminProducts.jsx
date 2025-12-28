import { useState, useEffect } from 'react';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../../api/productService.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    unit: 'per kg',
    stock: '',
    category: 'vegetables',
    emoji: '🌱',
    image: null
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = { ...formData };
      
      // Don't send image if it's null (for updates without new image)
      if (!submitData.image) {
        delete submitData.image;
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, submitData);
        alert('Product updated!');
      } else {
        await createProduct(submitData);
        alert('Product created!');
      }
      resetForm();
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      unit: product.unit,
      stock: product.stock,
      category: product.category || 'vegetables',
      emoji: product.emoji || '🌱',
      image: null
    });
    // Show existing image as preview
    if (product.image) {
      setImagePreview(`${API_URL}${product.image}`);
    } else {
      setImagePreview(null);
    }
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      fetchProducts();
      alert('Product deleted!');
    } catch (error) {
      alert('Failed to delete product');
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      unit: 'per kg',
      stock: '',
      category: 'vegetables',
      emoji: '🌱',
      image: null
    });
    setEditingProduct(null);
    setImagePreview(null);
    setShowForm(false);
  };

  const emojis = ['🥛', '🥚', '🍅', '🥔', '🥬', '🥕', '🧅', '🧀', '🍎', '🍌', '🌽', '🌾', '🌱'];
  const categories = ['dairy', 'vegetables', 'fruits', 'grains', 'other'];
  const units = ['per kg', 'per liter', 'per piece', 'per bundle', 'per dozen'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-green-800">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-800">🥬 Manage Products</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-800 hover:bg-green-700 text-white px-6 py-2 rounded-full transition"
          >
            {showForm ? '✕ Close' : '➕ Add Product'}
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-green-800 mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Emoji</label>
                <select
                  name="emoji"
                  value={formData.emoji}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  {emojis.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Unit</label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  {units.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Stock *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Image Upload */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-1">Product Image</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setFormData({ ...formData, image: null });
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-sm"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Max file size: 5MB. Formats: JPG, PNG, GIF, WebP</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="bg-green-800 hover:bg-green-700 text-white px-8 py-2 rounded-full transition"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-2 rounded-full transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-md overflow-hidden">
              {/* Product Image or Emoji */}
              <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                {product.image ? (
                  <img
                    src={`${API_URL}${product.image}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-6xl">{product.emoji || '🌱'}</span>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-bold text-green-800">{product.name}</h3>
                <p className="text-gray-600">₹{product.price} {product.unit}</p>
                <p className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  Stock: {product.stock}
                </p>
                <p className="text-xs text-gray-500 capitalize">Category: {product.category}</p>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 text-blue-600 hover:text-blue-800 border border-blue-600 py-1 rounded-full text-sm"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 text-red-600 hover:text-red-800 border border-red-600 py-1 rounded-full text-sm"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center text-gray-500">
            No products found. Add your first product!
          </div>
        )}
      </div>
    </div>
  );
}