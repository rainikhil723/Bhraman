import React, { useState ,useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { MapPin, Clock, Brain, Route, Filter, Zap, ArrowRight, Search } from 'lucide-react';


export default function LandingPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
 const [isVisible, setIsVisible] = useState({});
  const cityList = ["Delhi", "Jaipur", "Varanasi", "Mumbai", "Agra", "Uttarakhand", "Amritsar", "Hyderabad", "Bengaluru", "Pune", "Goa", "Udaipur"];

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    const filtered = cityList.filter((city) =>
      city.toLowerCase().startsWith(value.toLowerCase())
    );
    setSuggestions(value ? filtered : []);
  };

const handleSuggestionClick = (city) => {
  const cityLower = city.toLowerCase();
  const matched = cityList.map(c => c.toLowerCase());
  if (matched.includes(cityLower)) {
    navigate(`/results/${cityLower}`);
  } else {
    navigate("/c");
  }
};


const handleSearch = () => {
  if (query) {
    const city = query.toLowerCase();
    const matched = cityList.map(c => c.toLowerCase());
    if (matched.includes(city)) {
      navigate(`/results/${city}`);
    } else {
      navigate("/city-not-found");

    }
  }
};



  const featuredCities = [
    {
      name: "Delhi",
      img: "https://img.freepik.com/premium-photo/india-gate-night-illuminated-view-new-delhi_400112-1259.jpg?w=2000",
      description:
        "Delhi, the capital of India, blends history with modernity. Explore iconic spots like India Gate and Red Fort, savor street food in Chandni Chowk, and enjoy vibrant markets and cultural hubs across the city.",
    },
    {
      name: "Jaipur",
      img: "https://costoffliving.com/wp-content/uploads/2019/07/hawa-mahal.jpg",
      description:
        "Jaipur, the Pink City, is famous for its palaces, forts, and colorful bazaars. Visit Hawa Mahal and Amber Fort while experiencing the charm of Rajasthani culture and cuisine.",
    },
    {
      name: "Varanasi",
      img: "https://www.andbeyond.com/wp-content/uploads/sites/5/iStock_000058485880_XXXLarge.jpg",
      description:
        "Varanasi, a spiritual heart of India, is known for its Ganga Aarti, ghats, and sacred temples. It's a city where timeless traditions and devotion meet along the banks of the Ganges.",
    }
  ];
    const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Planning",
      description: "Smart algorithms analyze your preferences to create personalized itineraries"
    },
    {
      icon: <Route className="w-8 h-8" />,
      title: "Multi-Modal Routes",
      description: "Optimized transport combinations across trains, flights, buses, and local transit"
    },
    {
      icon: <Filter className="w-8 h-8" />,
      title: "Smart Filters",
      description: "Time and budget constraints automatically integrated into your travel plan"
    }
  ];

    // Intersection Observer for fade-in animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login clicked");
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative w-full min-h-screen overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0">
          <source src="/videos/Adventure.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-center px-4 z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Discover India with Intelligence
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-4">
            Smart planning, real-time info, and personalized travel — all in one app.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search city or place..."
                value={query}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full px-4 py-3 rounded-xl text-black shadow focus:outline-none"
              />
              {suggestions.length > 0 && (
                <ul className="absolute left-0 right-0 mt-1 bg-white rounded-xl shadow z-10 max-h-40 overflow-y-auto">
                  {suggestions.map((city) => (
                    <li
                      key={city}
                      onClick={() => handleSuggestionClick(city)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                    >
                      {city}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              onClick={handleSearch}
              className="w-full sm:w-auto px-6 py-0 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-all"
            >
              Explore Now
            </button>
          </div>
        </div>
      </section>

      {/* What is BhramanAI */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div 
            data-animate
            id="features-title"
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible['features-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Travel Intelligence
              <span className="block text-blue-600">Redefined</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              BhramanAI combines artificial intelligence with deep travel expertise to create seamless, personalized journeys across India
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                data-animate
                id={`feature-${index}`}
                className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 ${
                  isVisible[`feature-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cities */}
      <section id="cities" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div 
            data-animate
            id="cities-title"
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible['cities-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Discover India's
              <span className="block text-blue-600">Heritage Cities</span>
            </h2>
            <p className="text-xl text-gray-600">
              Explore curated destinations with AI-powered insights and local expertise
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredCities.map((city, index) => (
              <div
                key={city.name}
                data-animate
                id={`city-${index}`}
                className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 ${
                  isVisible[`city-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={city.img}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-1">{city.name}</h3>
                    <p className="text-sm text-white/80">{city.highlights}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {city.description}
                  </p>
                  <button 
                    onClick={() => handleSuggestionClick(city.name)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors group"
                  >
                    Explore {city.name}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Smart Planner CTA */}
      <section id="planner" className="py-20 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-6">
          <div 
            data-animate
            id="planner-content"
            className={`text-center text-white transition-all duration-1000 ${
              isVisible['planner-content'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Plan Your
                <span className="block text-yellow-400">Perfect Journey?</span>
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Let our AI create a personalized itinerary based on your preferences, budget, and time constraints
              </p>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20">
                <h3 className="text-2xl font-semibold mb-6 text-white">Smart Planning Preview</h3>
                <div className="grid md:grid-cols-3 gap-6 text-left">
                  <div className="flex items-start gap-3">
                    <Clock className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-white mb-1">Time Optimization</h4>
                      <p className="text-blue-100 text-sm">AI calculates optimal durations and schedules</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Route className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-white mb-1">Smart Routes</h4>
                      <p className="text-blue-100 text-sm">Multi-modal transport combinations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Zap className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-white mb-1">Real-time Updates</h4>
                      <p className="text-blue-100 text-sm">Live adjustments based on conditions</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg">
                Start Planning My Trip
              </button>
            </div>
          </div>
        </div>
      </section>



     <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-6">BhramanAI</h3>
              <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
                Intelligent travel planning powered by AI, designed to make exploring India seamless and personalized. Part of the Digital India initiative.
              </p>
              <div className="space-y-2 text-gray-400">
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Ministry of Tourism, New Delhi
                </p>
                <p className="flex items-center gap-2">
                  <span>📧</span>
                  info@bhramanai.gov.in
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Destinations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Travel Guidelines</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Tourism Initiatives</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Incredible India</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Digital Tourism</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Swadesh Darshan</a></li>
                <li><a href="#" className="hover:text-white transition-colors">PRASHAD</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2025 BhramanAI. Powered by Ministry of Tourism, Government of India 🇮🇳</p>
          </div>
        </div>
      </footer>
    </div>


    
  );
}
