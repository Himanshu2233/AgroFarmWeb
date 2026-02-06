import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: '🥛',
      title: 'Fresh Milk',
      description: 'Daily fresh milk from our healthy cows',
      color: 'from-blue-500 to-cyan-500',
      link: '/products'
    },
    {
      icon: '🥚',
      title: 'Farm Eggs',
      description: 'Organic eggs from free-range hens',
      color: 'from-amber-500 to-orange-500',
      link: '/products'
    },
    {
      icon: '🥬',
      title: 'Fresh Vegetables',
      description: 'Seasonal vegetables grown naturally',
      color: 'from-green-500 to-emerald-500',
      link: '/products'
    },
    {
      icon: '🐄',
      title: 'Farm Animals',
      description: 'Healthy livestock for your needs',
      color: 'from-purple-500 to-pink-500',
      link: '/animals'
    },
  ];

  const steps = [
    { number: 1, title: 'Browse Products', desc: 'Check daily available stock', icon: '🔍' },
    { number: 2, title: 'Select Schedule', desc: 'Daily, Weekly or Monthly', icon: '📅' },
    { number: 3, title: 'Book Products', desc: 'Choose quantity & dates', icon: '🛒' },
    { number: 4, title: 'Get Delivery', desc: 'Fresh products at your door', icon: '🚚' },
  ];

  const stats = [
    { value: '500+', label: 'Happy Customers' },
    { value: '50+', label: 'Farm Products' },
    { value: '100%', label: 'Organic' },
    { value: '24/7', label: 'Support' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Enhanced */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-800 via-green-700 to-emerald-800 text-white py-24 sm:py-32 px-6">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-600/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-600/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
        </div>
        
        {/* Floating farm icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <span className="absolute top-20 left-[10%] text-4xl opacity-20 animate-float">🌾</span>
          <span className="absolute top-40 right-[15%] text-5xl opacity-20 animate-float animation-delay-200">🌻</span>
          <span className="absolute bottom-20 left-[20%] text-4xl opacity-20 animate-float animation-delay-300">🍃</span>
          <span className="absolute bottom-40 right-[10%] text-5xl opacity-20 animate-float animation-delay-500">🌿</span>
        </div>
        
        <div className={`max-w-6xl mx-auto text-center relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 animate-fadeIn">
            🌱 Farm Fresh • Organic • Sustainable
          </span>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 font-display leading-tight">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              AgroFarm
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-green-100 mb-10 max-w-2xl mx-auto">
            Fresh farm products delivered to your doorstep daily! 
            Experience the taste of nature with our organic produce.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <span>🛒</span>
              Browse Products
            </Link>
            <Link
              to="/animals"
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              <span>🐄</span>
              View Animals
            </Link>
          </div>
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 50L60 45.7C120 41 240 33 360 35.2C480 37 600 50 720 54.8C840 60 960 56 1080 50C1200 44 1320 35 1380 31.2L1440 27V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V50Z" fill="#f9fdf9"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 -mt-6 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`text-center transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl sm:text-4xl font-bold text-gradient">{stat.value}</div>
                <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
              Our Offerings
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-display">
              What We Provide
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From fresh dairy to organic vegetables, we bring the best of the farm directly to you
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className={`group relative bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <div className="relative">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Arrow indicator */}
                  <div className="mt-4 flex items-center text-green-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1">
                    <span>Explore</span>
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Enhanced */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
              Simple Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-display">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get fresh farm products in just 4 simple steps
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`relative text-center group transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-green-300 to-green-200" />
                )}
                
                {/* Step circle */}
                <div className="relative z-10 w-16 h-16 mx-auto bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg shadow-green-500/25 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  {step.icon}
                </div>
                
                {/* Step number badge */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-orange-400 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                  {step.number}
                </div>
                
                <h3 className="font-bold text-gray-900 mt-5 mb-2 group-hover:text-green-700 transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-r from-green-700 to-emerald-700 rounded-3xl p-10 sm:p-16 text-center text-white overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full" />
            </div>
            
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-display">
                Ready to Get Started?
              </h2>
              <p className="text-green-100 mb-8 max-w-xl mx-auto">
                Join thousands of happy customers who trust AgroFarm for their daily fresh produce needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 bg-white text-green-700 hover:bg-green-50 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Create Account
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300"
                >
                  View Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Preview */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
              Customer Love
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-display">
              What Our Customers Say
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "The freshest milk I've ever tasted! Delivery is always on time.",
                author: "Sita Thapa",
                role: "Regular Customer",
                avatar: "ST"
              },
              {
                quote: "Love the organic vegetables. My family's health has improved so much!",
                author: "Ramesh Gurung",
                role: "Weekly Subscriber",
                avatar: "RG"
              },
              {
                quote: "Best farm eggs in the city. The app makes ordering so easy!",
                author: "Anita Shrestha",
                role: "Daily Subscriber",
                avatar: "AS"
              },
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-semibold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}