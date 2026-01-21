import { useState, useEffect } from 'react';
import { getAllAnimals, createAnimal, updateAnimal, deleteAnimal } from '../../api/animalService.js';
import BackButton from '../../components/common/BackButton.jsx';

export default function AdminAnimals() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    age: '',
    weight: '',
    price: '',
    quantity: 1,
    emoji: '🐄'
  });

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      const data = await getAllAnimals();
      setAnimals(data);
    } catch (error) {
      console.error('Failed to fetch animals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAnimal) {
        await updateAnimal(editingAnimal.id, {
          ...formData,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity)
        });
      } else {
        await createAnimal({
          ...formData,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity)
        });
      }
      resetForm();
      fetchAnimals();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save animal');
    }
  };

  const handleEdit = (animal) => {
    setEditingAnimal(animal);
    setFormData({
      name: animal.name,
      description: animal.description || '',
      age: animal.age || '',
      weight: animal.weight || '',
      price: animal.price,
      quantity: animal.quantity,
      emoji: animal.emoji || '🐄'
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this animal?')) return;
    try {
      await deleteAnimal(id);
      fetchAnimals();
    } catch (error) {
      alert('Failed to delete animal');
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      age: '',
      weight: '',
      price: '',
      quantity: 1,
      emoji: '🐄'
    });
    setEditingAnimal(null);
    setShowForm(false);
  };

  const emojis = ['🐄', '🐃', '🐐', '🐑', '🐔', '🦆', '🐖', '🐎'];

  // Stats
  const stats = {
    total: animals.length,
    totalCount: animals.reduce((sum, a) => sum + a.quantity, 0),
    totalValue: animals.reduce((sum, a) => sum + (a.price * a.quantity), 0),
    types: [...new Set(animals.map(a => a.emoji))].length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-orange-800 font-medium">Loading animals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 py-8 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <BackButton to="/admin" label="Back to Dashboard" />
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Animal Management
            </h1>
            <p className="text-gray-600 mt-1">Manage your livestock inventory</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`mt-4 md:mt-0 px-6 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
              showForm 
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white'
            }`}
          >
            {showForm ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Close Form
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Animal
              </>
            )}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                <span className="text-xl">📋</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                <p className="text-gray-500 text-sm">Listings</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center">
                <span className="text-xl">🐄</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.totalCount}</p>
                <p className="text-gray-500 text-sm">Total Animals</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                <span className="text-xl">💰</span>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-800">Rs. {stats.totalValue.toLocaleString()}</p>
                <p className="text-gray-500 text-sm">Total Value</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                <span className="text-xl">🏷️</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.types}</p>
                <p className="text-gray-500 text-sm">Types</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-6 rounded-t-2xl">
                <h2 className="text-2xl font-bold">
                  {editingAnimal ? 'Edit Animal' : 'Add New Animal'}
                </h2>
                <p className="text-orange-100 mt-1">
                  {editingAnimal ? 'Update animal details' : 'Fill in the details below'}
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1.5">Animal Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      required
                      placeholder="e.g., Holstein Cow"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1.5">Emoji</label>
                    <select
                      name="emoji"
                      value={formData.emoji}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-2xl"
                    >
                      {emojis.map((e) => (
                        <option key={e} value={e}>{e}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1.5">Age</label>
                    <input
                      type="text"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="e.g., 2 years"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1.5">Weight</label>
                    <input
                      type="text"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="e.g., 350 kg"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1.5">Price (Rs.) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      required
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1.5">Quantity *</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      min="1"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1.5">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
                    placeholder="Describe the animal (breed, health, etc.)..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
                  >
                    {editingAnimal ? 'Update Animal' : 'Add Animal'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Animals Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {animals.map((animal, index) => (
            <div 
              key={animal.id} 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300 group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Header with Emoji */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 text-center relative">
                <span className="text-7xl group-hover:scale-110 transition-transform duration-300 inline-block">
                  {animal.emoji || '🐄'}
                </span>
                {/* Quantity Badge */}
                <span className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm text-orange-600 text-sm rounded-full font-bold shadow-sm">
                  ×{animal.quantity}
                </span>
              </div>
              
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-3">{animal.name}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Age
                    </span>
                    <span className="font-medium text-gray-800">{animal.age || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                      </svg>
                      Weight
                    </span>
                    <span className="font-medium text-gray-800">{animal.weight || 'N/A'}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <p className="text-2xl font-bold text-orange-600">
                    Rs. {Number(animal.price).toLocaleString()}
                    <span className="text-sm text-gray-500 font-normal"> each</span>
                  </p>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(animal)}
                    className="flex-1 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(animal.id)}
                    className="flex-1 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {animals.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🐄</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No animals yet</h3>
            <p className="text-gray-500 mb-6">Start by adding your first animal listing</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
            >
              Add Your First Animal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}