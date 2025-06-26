import React, { useState, useEffect } from 'react';
import { MapPin, Zap, Route, Clock, Filter, Globe, Sparkles, ArrowRight, Brain, Compass } from 'lucide-react';

export default function CityNotFound() {
  const [animationStep, setAnimationStep] = useState(0);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setTimeout(() => setAnimationStep(1), 200);
    const timer2 = setTimeout(() => setAnimationStep(2), 800);
    const timer3 = setTimeout(() => setAnimationStep(3), 1400);
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const features = [
    {
      icon: Brain,
      title: "AI Trip Segmentation",
      description: "Smart itineraries tailored to your preferences",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Route,
      title: "Multi-Modal Plans",
      description: "Metro, train, cab, walk - all optimized",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Filter,
      title: "Smart Filters",
      description: "Time, budget, comfort - your way",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Globe,
      title: "10+ Cities & Growing",
      description: "New destinations added weekly",
      color: "from-orange-500 to-red-500"
    }
  ];

  const cities = ["Varanasi", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Mumbai", "Jaipur", "Lucknow"];
  const [displayedCities, setDisplayedCities] = useState([]);

  useEffect(() => {
    cities.forEach((city, index) => {
      setTimeout(() => {
        setDisplayedCities(prev => [...prev, city]);
      }, 2000 + index * 150);
    });
  }, []);

  return (
   <div 
  className="min-h-screen relative overflow-hidden"
  style={{
    background: 'linear-gradient(to bottom right, #0f172a, #581c87, #0f172a)'
  }}
  onMouseMove={handleMouseMove}
>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Cursor follow effect */}
      <div
        className="fixed w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl pointer-events-none transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Main content */}
        <div className="max-w-4xl mx-auto text-center">
          {/* Header with animation */}
          <div className={`transition-all duration-1000 ${animationStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <MapPin className="w-16 h-16 text-purple-400 animate-bounce" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Almost There!
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-2">
              Your destination isn't mapped yet, but
            </p>
            <p className="text-3xl md:text-4xl font-bold text-white mb-8 flex items-center justify-center gap-2">
              <Brain className="w-8 h-8 text-purple-400" />
              BhramanAI is learning
              <span className="inline-block animate-pulse">...</span>
            </p>
          </div>

          {/* Features showcase */}
          <div className={`transition-all duration-1000 delay-300 ${animationStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 cursor-pointer"
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                  
                  {hoveredFeature === index && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* City showcase */}
          <div className={`transition-all duration-1000 delay-600 ${animationStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 mb-12">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Globe className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-bold text-white">Currently Available Cities</h2>
              </div>
              
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {displayedCities.map((city, index) => (
                  <span
                    key={city}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white rounded-full border border-blue-400/30 text-sm font-medium animate-fadeIn"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {city}
                  </span>
                ))}
              </div>
              
              <p className="text-gray-300 text-lg">
                <span className="text-green-400 font-semibold">+3 new cities</span> added every week
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className={`transition-all duration-1000 delay-900 ${animationStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-3xl p-8 border border-purple-400/30">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Compass className="w-8 h-8 text-yellow-400" />
                <h2 className="text-3xl font-bold text-white">Experience the Magic</h2>
              </div>
              
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Discover how BhramanAI transforms travel planning with our showcase city. 
                See AI-powered itineraries, smart routing, and personalized recommendations in action.
              </p>
              
              <button 
                onClick={() => window.location.href = '/results/varanasi'}
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
              >
                  <span className="flex items-center gap-3">
                    <MapPin className="w-5 h-5" />
                    Explore Varanasi
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  
                  {/* Button glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10" />
                </button>
              
              <p className="text-sm text-gray-400 mt-4">
                Get a taste of what's coming to your city soon
              </p>
            </div>
          </div>
        </div>

        {/* Footer message */}
        <div className="mt-16 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <Zap className="w-4 h-4 text-yellow-400" />
            <p className="text-sm">
              Powered by AI • Built for the future of travel
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
