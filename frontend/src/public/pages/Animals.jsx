import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllAnimals } from '../../api/animalService.js';
import { useAuth } from '../../contexts';
import { Pagination, SearchBar, AnimalEnquiryModal } from '../../components';
import { useDocumentTitle } from '../../utils';

export default function Animals() {
  useDocumentTitle('Farm Animals');
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-orange-800 font-medium">Loading animals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">😞</span>
          </div>
          <p className="text-xl text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🐄</span>
            <h1 className="text-3xl md:text-4xl font-bold">Farm Animals</h1>
          </div>
          <p className="text-orange-100 text-lg">Healthy livestock from our trusted farm</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search animals by name or description..."
            className="max-w-md"
            color="orange"
          />
          {searchTerm && (
            <p className="text-sm text-gray-500 mt-2">
              Showing {animals.filter(a => 
                a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.description?.toLowerCase().includes(searchTerm.toLowerCase())
              ).length} of {animals.length} animals
            </p>
          )}
        </div>

        {animals.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🐄</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No animals available</h3>
            <p className="text-gray-500">Check back later for new livestock</p>
          </div>
        ) : (
          <>
            {/* Paginated animals */}
            {(() => {
              // Filter animals by search term
              const filteredAnimals = animals.filter(a => 
                !searchTerm ||
                a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.description?.toLowerCase().includes(searchTerm.toLowerCase())
              );
              const startIndex = (currentPage - 1) * itemsPerPage;
              const paginatedAnimals = filteredAnimals.slice(startIndex, startIndex + itemsPerPage);
              
              if (filteredAnimals.length === 0) {
                return (
                  <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">🔍</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No animals found</h3>
                    <p className="text-gray-500">Try adjusting your search</p>
                  </div>
                );
              }
              
              return (
                <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedAnimals.map((animal, index) => (
              <div
                key={animal.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300 group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Animal Emoji Header */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-8 text-center relative">
                  <span className="text-8xl group-hover:scale-110 transition-transform duration-300 inline-block">
                    {animal.emoji || '🐄'}
                  </span>
                  {/* Quantity Badge */}
                  <span className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-orange-600 text-sm rounded-full font-bold shadow-sm">
                    {animal.quantity} available
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                    {animal.name}
                  </h3>
                  
                  {animal.description && (
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{animal.description}</p>
                  )}

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-gray-500 text-xs mb-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Age
                      </div>
                      <p className="font-semibold text-gray-800">{animal.age || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-gray-500 text-xs mb-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                        </svg>
                        Weight
                      </div>
                      <p className="font-semibold text-gray-800">{animal.weight || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-2xl font-bold text-orange-600 mb-4">
                      Rs. {Number(animal.price).toLocaleString()}
                      <span className="text-sm text-gray-500 font-normal ml-1">each</span>
                    </p>

                    {user?.role === 'admin' ? (
                      <span className="w-full bg-purple-50 text-purple-700 py-3 rounded-xl text-center font-medium text-sm flex items-center justify-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        You manage this
                      </span>
                    ) : (
                      <button 
                        onClick={() => !user ? navigate('/login', { state: { from: location } }) : setSelectedAnimal(animal)}
                        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3 rounded-xl font-medium transition-all shadow-sm hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Enquire Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
                </div>
                
                {/* Pagination */}
                {filteredAnimals.length > itemsPerPage && (
                  <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                    <Pagination
                      currentPage={currentPage}
                      totalItems={filteredAnimals.length}
                      itemsPerPage={itemsPerPage}
                      onPageChange={setCurrentPage}
                      onItemsPerPageChange={setItemsPerPage}
                      itemsPerPageOptions={[6, 9, 18, 36]}
                    />
                  </div>
                )}
                </>
              );
            })()}
          </>
        )}
      </div>

      {/* Animal Enquiry Modal */}
      {selectedAnimal && (
        <AnimalEnquiryModal
          animal={selectedAnimal}
          onClose={() => setSelectedAnimal(null)}
          onSuccess={() => {
            // Success toast is already shown in the modal
          }}
        />
      )}
    </div>
  );
}