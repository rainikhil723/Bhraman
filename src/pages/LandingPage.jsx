import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { MapPin, Clock, Brain, Route, Filter, Zap, ArrowRight, Search } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

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
    navigate("/city-not-found");
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

      {/* Featured Cities */}
      <section id="explore" className="px-6 py-16 bg-gray-50">
        <h3 className="text-3xl font-semibold text-center text-blue-700 mb-10">Explore Indian Cities</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCities.map((city) => (
            <div
              key={city.name}
              className="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition group "
            >
              <img
                src={city.img}
                alt={city.name}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-60 text-white flex flex-col justify-center items-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h4 className="text-2xl font-bold mb-2">{city.name}</h4>
                <p className="text-sm text-center">{city.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trip Planner Section */}
      <section id="planner" className="px-6 py-16 bg-white border-t">
        <h3 className="text-3xl font-semibold text-center text-blue-700 mb-10">Plan Your Trip</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Choose Destination</label>
            <input type="text" className="w-full px-4 py-3 border rounded-xl shadow-sm" placeholder="E.g., Delhi" />
            <label className="block text-gray-700 mt-6 mb-2 font-medium">Travel Dates</label>
            <input type="date" className="w-full px-4 py-3 border rounded-xl shadow-sm" />
            <label className="block text-gray-700 mt-6 mb-2 font-medium">Number of People</label>
            <input type="number" className="w-full px-4 py-3 border rounded-xl shadow-sm" placeholder="e.g., 2" />
            <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
              Generate Itinerary
            </button>
          </div>
          <div className="bg-blue-50 p-6 rounded-xl shadow">
            <h4 className="text-xl font-semibold mb-4 text-blue-600">Sample Plan Preview</h4>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>🕘 Estimated Time to Visit: 3 Days</li>
              <li>🚕 Best Transport: Metro + Auto Rickshaw</li>
              <li>🍽 Famous Food: Chole Bhature, Paratha</li>
              <li>🛍 What to Buy: Handicrafts, Spices</li>
              <li>💸 Budget Estimate: ₹5,000 - ₹7,000</li>
            </ul>
          </div>
        </div>
      </section>

           {/* Footer */}
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
