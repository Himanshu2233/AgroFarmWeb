import { useState, useEffect } from 'react';
import { getAllProducts } from '../api';
import { useDocumentTitle } from '../utils/useDocumentTitle';
import { useScrollToTop } from '../utils/useScrollToTop';

const SEASONS = ['Spring', 'Summer', 'Fall', 'Winter'];
const SEASON_COLORS = {
  Spring: 'from-pink-400 to-green-400',
  Summer: 'from-yellow-400 to-orange-400',
  Fall: 'from-orange-400 to-red-400',
  Winter: 'from-blue-400 to-cyan-400',
  'Year-round': 'from-green-400 to-emerald-500'
};

const SEASON_EMOJIS = {
  Spring: '🌸',
  Summer: '☀️',
  Fall: '🍂',
  Winter: '❄️',
  'Year-round': '🌱'
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function HarvestCalendar() {
  useDocumentTitle('Harvest Calendar');
  useScrollToTop();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState('All');
  const [currentMonth] = useState(new Date().getMonth());

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProductsForSeason = (season) => {
    if (season === 'All') {
      return products;
    }
    return products.filter(p => p.season === season);
  };

  const getProductsForMonth = (monthIndex) => {
    const monthStr = String(monthIndex + 1).padStart(2, '0');
    
    return products.filter(product => {
      // If year-round, always available
      if (product.season === 'Year-round' || !product.availability_start || !product.availability_end) {
        return true;
      }

      const [startMonth] = product.availability_start.split('-');
      const [endMonth] = product.availability_end.split('-');

      // Check if current month is within availability range
      if (startMonth <= endMonth) {
        return monthStr >= startMonth && monthStr <= endMonth;
      } else {
        // Wraps around year (e.g., Nov-Feb)
        return monthStr >= startMonth || monthStr <= endMonth;
      }
    });
  };

  const filteredProducts = selectedSeason === 'All' 
    ? products 
    : getProductsForSeason(selectedSeason);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🌾 Harvest Calendar</h1>
          <p className="text-gray-600">
            Discover what's fresh and in season throughout the year
          </p>
        </div>

        {/* Season Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedSeason('All')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                selectedSeason === 'All'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Seasons
            </button>
            {SEASONS.map(season => (
              <button
                key={season}
                onClick={() => setSelectedSeason(season)}
                className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  selectedSeason === season
                    ? `bg-gradient-to-r ${SEASON_COLORS[season]} text-white shadow-md`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{SEASON_EMOJIS[season]}</span>
                <span>{season}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Seasonal Products */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {selectedSeason === 'All' ? 'All Products' : `${selectedSeason} Harvest`}
          </h2>
          
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌾</div>
              <p className="text-gray-600">No products available for this season</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className={`w-full h-24 bg-gradient-to-br ${SEASON_COLORS[product.season || 'Year-round']} rounded-lg flex items-center justify-center mb-3`}>
                    <span className="text-4xl">{product.emoji || '🌱'}</span>
                  </div>
                  <h3 className="font-medium text-gray-800 text-sm mb-1">{product.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{SEASON_EMOJIS[product.season || 'Year-round']}</span>
                    <span className="text-xs text-gray-500">{product.season || 'Year-round'}</span>
                  </div>
                  {product.availability_start && product.availability_end && (
                    <p className="text-xs text-gray-400 mt-1">
                      {product.availability_start} to {product.availability_end}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Monthly Calendar */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📅 Monthly Availability</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {MONTHS.map((month, index) => {
              const monthProducts = getProductsForMonth(index);
              const isCurrentMonth = index === currentMonth;
              
              return (
                <div
                  key={month}
                  className={`border-2 rounded-xl p-4 ${
                    isCurrentMonth
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`font-semibold ${isCurrentMonth ? 'text-green-700' : 'text-gray-800'}`}>
                      {month}
                    </h3>
                    {isCurrentMonth && (
                      <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {monthProducts.slice(0, 12).map(product => (
                      <span
                        key={product.id}
                        className="text-xl"
                        title={product.name}
                      >
                        {product.emoji || '🌱'}
                      </span>
                    ))}
                    {monthProducts.length > 12 && (
                      <span className="text-xs text-gray-500 self-center">
                        +{monthProducts.length - 12}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    {monthProducts.length} product{monthProducts.length !== 1 ? 's' : ''}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
          <h3 className="font-semibold text-gray-800 mb-4">Season Guide</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[...SEASONS, 'Year-round'].map(season => (
              <div key={season} className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${SEASON_COLORS[season]} rounded-lg flex items-center justify-center text-2xl`}>
                  {SEASON_EMOJIS[season]}
                </div>
                <span className="text-sm text-gray-700">{season}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
