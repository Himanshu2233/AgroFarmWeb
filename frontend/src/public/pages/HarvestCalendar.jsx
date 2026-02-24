import { useState, useEffect } from 'react';
import { getAllProducts } from '../../api';
import { useDocumentTitle } from '../../utils/useDocumentTitle';
import { useScrollToTop } from '../../utils/useScrollToTop';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/40 to-sky-50/30">
        <div className="bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-400 text-white py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="h-10 bg-white/20 rounded w-1/3 mb-3"></div>
            <div className="h-5 bg-white/15 rounded w-1/2"></div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/40 to-sky-50/30">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-400 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🌾</span>
            <h1 className="text-3xl md:text-4xl font-bold">Harvest Calendar</h1>
          </div>
          <p className="text-cyan-50 text-lg">Discover what's fresh and in season throughout the year</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
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
            <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-100">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🌾</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No products available</h3>
              <p className="text-gray-500 mb-4">No products found for {selectedSeason === 'All' ? 'any season' : `${selectedSeason} season`}</p>
              {selectedSeason !== 'All' && (
                <button
                  onClick={() => setSelectedSeason('All')}
                  className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                >
                  View All Seasons
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className={`w-full h-24 bg-gradient-to-br ${SEASON_COLORS[product.season || 'Year-round']} rounded-lg flex items-center justify-center mb-3 overflow-hidden`}>
                    {product.image ? (
                      <img src={`${API_URL}${product.image}`} alt={product.name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-4xl">{product.emoji || '🌱'}</span>
                    )}
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                      product.image ? (
                        <img
                          key={product.id}
                          src={`${API_URL}${product.image}`}
                          alt={product.name}
                          title={product.name}
                          className="w-7 h-7 rounded object-cover"
                        />
                      ) : (
                        <span
                          key={product.id}
                          className="text-xl"
                          title={product.name}
                        >
                          {product.emoji || '🌱'}
                        </span>
                      )
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
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
