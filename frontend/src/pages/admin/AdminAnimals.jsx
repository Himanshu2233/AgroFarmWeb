import { useState, useEffect } from 'react';
import { getAllAnimals, createAnimal, updateAnimal, deleteAnimal } from '../../api/animalService.js';

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
        alert('Animal updated!');
      } else {
        await createAnimal({
          ...formData,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity)
        });
        alert('Animal added!');
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
      alert('Animal deleted!');
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-green-800">Loading animals...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-800">🐄 Manage Animals</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full transition"
          >
            {showForm ? '✕ Close' : '➕ Add Animal'}
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-green-800 mb-4">
              {editingAnimal ? 'Edit Animal' : 'Add New Animal'}
            </h2>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Animal Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Emoji</label>
                <select
                  name="emoji"
                  value={formData.emoji}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  {emojis.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Age</label>
                <input
                  type="text"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="e.g., 2 years"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Weight</label>
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="e.g., 350 kg"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded-full transition"
                >
                  {editingAnimal ? 'Update Animal' : 'Add Animal'}
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

        {/* Animals Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {animals.map((animal) => (
            <div key={animal.id} className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex gap-4">
                <span className="text-5xl">{animal.emoji || '🐄'}</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-green-800">{animal.name}</h3>
                  <p className="text-gray-600">Age: {animal.age || 'N/A'}</p>
                  <p className="text-gray-600">Weight: {animal.weight || 'N/A'}</p>
                  <p className="text-gray-600">Quantity: {animal.quantity}</p>
                  <p className="text-xl font-bold text-orange-500 mt-2">
                    ₹{Number(animal.price).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 mt-4 pt-4 border-t">
                <button
                  onClick={() => handleEdit(animal)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(animal.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {animals.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center text-gray-500">
            No animals found. Add your first animal!
          </div>
        )}
      </div>
    </div>
  );
}