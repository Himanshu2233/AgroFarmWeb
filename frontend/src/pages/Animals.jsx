import { useState, useEffect } from 'react';
import { getAllAnimals } from '../api/animalService.js';

export default function Animals() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      const data = await getAllAnimals();
      setAnimals(data);
    } catch (err) {
      setError('Failed to load animals');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🐄</div>
          <p className="text-xl text-green-800">Loading animals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-green-800 mb-2">🐄 Animals for Sale</h1>
        <p className="text-gray-600 mb-8">Healthy domestic animals from our farm</p>

        {animals.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl shadow-md">
            <div className="text-4xl mb-4">🐄</div>
            <p className="text-gray-600">No animals available right now</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {animals.map((animal) => (
              <div
                key={animal.id}
                className="bg-white rounded-2xl shadow-md p-6 flex gap-6 hover:shadow-lg transition"
              >
                <span className="text-6xl">{animal.emoji || '🐄'}</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-green-800">{animal.name}</h3>
                  {animal.description && (
                    <p className="text-gray-500 text-sm mt-1">{animal.description}</p>
                  )}
                  <div className="text-gray-600 mt-2 space-y-1">
                    <p>🎂 Age: {animal.age || 'N/A'}</p>
                    <p>⚖️ Weight: {animal.weight || 'N/A'}</p>
                    <p>📦 Available: {animal.quantity}</p>
                  </div>
                  <p className="text-2xl font-bold text-orange-500 mt-3">
                    ₹{Number(animal.price).toLocaleString()}
                  </p>
                  <button className="mt-3 bg-green-800 hover:bg-green-700 text-white px-6 py-2 rounded-full transition">
                    Enquire Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}