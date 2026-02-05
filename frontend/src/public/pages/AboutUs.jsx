import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AboutUs() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const values = [
    {
      icon: '🌿',
      title: 'Quality & Freshness',
      description: 'We deliver only the freshest produce, harvested at peak ripeness for maximum nutrition and taste.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: '🤝',
      title: 'Trust & Transparency',
      description: 'Every product is traceable to its source. Know exactly where your food comes from.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: '👨‍🌾',
      title: 'Community Empowerment',
      description: 'We support local farmers by providing fair prices and direct market access.',
      color: 'from-orange-500 to-amber-500',
    },
    {
      icon: '♻️',
      title: 'Sustainability',
      description: 'Eco-friendly practices from farm to table. We care for our planet as much as our produce.',
      color: 'from-teal-500 to-green-500',
    },
  ];

  const stats = [
    { value: '500+', label: 'Happy Customers', icon: '😊' },
    { value: '50+', label: 'Local Farmers', icon: '👨‍🌾' },
    { value: '1000+', label: 'Products Delivered', icon: '📦' },
    { value: '5+', label: 'Years of Service', icon: '🏆' },
  ];

  const team = [
    { name: 'Sandhya Sapkota', role: 'Founder & CEO', avatar: 'RS', emoji: '👨‍💼' },
    { name: 'Himanshu Sah', role: 'Operations Head', avatar: 'ST', emoji: '👩‍💼' },
    { name: 'Krishna Gurung', role: 'Farm Relations', avatar: 'KG', emoji: '🧑‍🌾' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-800 via-green-700 to-emerald-800 text-white py-20 sm:py-28 px-6">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-600/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-600/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
        </div>

        {/* Floating farm icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <span className="absolute top-20 left-[10%] text-4xl opacity-20 animate-float">🌾</span>
          <span className="absolute top-32 right-[15%] text-5xl opacity-20 animate-float animation-delay-200">🌻</span>
          <span className="absolute bottom-20 left-[20%] text-4xl opacity-20 animate-float animation-delay-300">🍃</span>
          <span className="absolute bottom-32 right-[10%] text-5xl opacity-20 animate-float animation-delay-500">🌿</span>
        </div>

        <div className={`max-w-4xl mx-auto text-center relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 animate-fadeIn">
            🌱 Our Story
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 font-display leading-tight">
            About{' '}
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              AgroFarm
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-green-100 max-w-2xl mx-auto">
            We are dedicated to connecting farmers and consumers, making fresh and quality agricultural products accessible to everyone.
          </p>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 50L60 45.7C120 41 240 33 360 35.2C480 37 600 50 720 54.8C840 60 960 56 1080 50C1200 44 1320 35 1380 31.2L1440 27V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V50Z" fill="#f9fdf9"/>
          </svg>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-green-50/50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
            Our Mission
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 font-display">
            Bridging Farms & Families
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
            At AgroFarm, we believe everyone deserves access to fresh, healthy, and affordable farm products. 
            Our mission is to empower local farmers by providing them direct access to consumers, while ensuring 
            families receive the freshest produce right at their doorstep. We're building a sustainable ecosystem 
            where quality meets convenience.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl sm:text-4xl font-bold text-gradient">{stat.value}</div>
                <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
              What We Stand For
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-display">
              Our Core Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do, from sourcing to delivery
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className={`group relative bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                <div className="relative">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
                Our Vision
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 font-display">
                Building a Healthier Tomorrow
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                We envision a future where every family has access to fresh, organic, and locally-sourced 
                food. Where farmers thrive with fair compensation, and sustainable practices become the norm.
              </p>
              <ul className="space-y-4">
                {[
                  'Reduce food miles and carbon footprint',
                  'Support 1000+ local farmers by 2030',
                  'Make organic food affordable for all',
                  'Zero-waste packaging initiatives',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-700">
                    <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl flex items-center justify-center">
                <span className="text-9xl">🌾</span>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-orange-400 rounded-2xl flex items-center justify-center text-5xl shadow-lg">
                🚜
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
              The People Behind AgroFarm
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-display">
              Meet Our Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Passionate individuals working together to revolutionize farm-to-table delivery
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {team.map((member, index) => (
              <div
                key={index}
                className="text-center group"
              >
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-green-500/25">
                  {member.emoji}
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{member.name}</h3>
                <p className="text-gray-500 text-sm">{member.role}</p>
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
                Join the AgroFarm Family
              </h2>
              <p className="text-green-100 mb-8 max-w-xl mx-auto">
                Experience the difference of farm-fresh products. Start your journey with us today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 bg-white text-green-700 hover:bg-green-50 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Explore Products
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
