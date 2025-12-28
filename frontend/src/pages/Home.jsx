export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-800 to-green-600 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">🌾 Welcome to AgroFarm</h1>
          <p className="text-xl mb-8">Fresh farm products delivered to your doorstep daily!</p>
          <button className="bg-orange-400 hover:bg-orange-500 text-white px-8 py-3 rounded-full text-lg font-medium transition">
            Book Now
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-md text-center hover:shadow-lg transition">
              <span className="text-5xl">🥛</span>
              <h3 className="text-xl font-bold mt-4 text-green-800">Fresh Milk</h3>
              <p className="text-gray-600 mt-2">Daily fresh milk from our healthy cows</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-md text-center hover:shadow-lg transition">
              <span className="text-5xl">🥚</span>
              <h3 className="text-xl font-bold mt-4 text-green-800">Farm Eggs</h3>
              <p className="text-gray-600 mt-2">Organic eggs from free-range hens</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-md text-center hover:shadow-lg transition">
              <span className="text-5xl">🥬</span>
              <h3 className="text-xl font-bold mt-4 text-green-800">Fresh Vegetables</h3>
              <p className="text-gray-600 mt-2">Seasonal vegetables grown naturally</p>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-green-50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="bg-green-800 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl font-bold">1</div>
              <h3 className="font-bold mt-4">Browse Products</h3>
              <p className="text-gray-600 text-sm">Check daily available stock</p>
            </div>
            <div>
              <div className="bg-green-800 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl font-bold">2</div>
              <h3 className="font-bold mt-4">Select Schedule</h3>
              <p className="text-gray-600 text-sm">Daily, Weekly or Monthly</p>
            </div>
            <div>
              <div className="bg-green-800 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl font-bold">3</div>
              <h3 className="font-bold mt-4">Book Products</h3>
              <p className="text-gray-600 text-sm">Choose quantity & dates</p>
            </div>
            <div>
              <div className="bg-green-800 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl font-bold">4</div>
              <h3 className="font-bold mt-4">Get Delivery</h3>
              <p className="text-gray-600 text-sm">Fresh products at your door</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}