import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";

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
    navigate(`/results/${city.toLowerCase()}`);
  };

  const handleSearch = () => {
    if (query) {
      navigate(`/results/${query.toLowerCase()}`);
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

      <footer className="bg-blue-600 text-white">
  <div className="w-full max-w-screen-2xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 text-left">
    
    {/* Get in Touch */}
    <div>
      <h3 className="text-lg mb-4 font-bold text-white">Get in Touch</h3>
      <p className="mb-2 flex items-start gap-2">
        <span>📍</span>
        <span>Bhraman Tourism Office, Ministry of Tourism, Government of India, Transport Bhawan, Sansad Marg, New Delhi - 110001</span>
      </p>
      <p className="mb-2 flex items-center gap-2">
        <span>📧</span>
        <span>info@incredibleindia.org</span>
      </p>
      <p className="flex items-center gap-2">
        <span>📞</span>
        <span>+91 11-23311237</span>
      </p>

      {/* Quick Links under Get in Touch */}
      <div className="mt-10">
        <h3 className="text-lg  mb-4 font-bold text-white">Quick Links</h3>
        <ul className="space-y-2 list-disc list-inside">
          <li>Explore Destinations</li>
          <li>Travel Guidelines</li>
          <li>Culture & Heritage</li>
          <li>Contact Support</li>
          <li>About Incredible India</li>
          <li>Travel FAQs</li>
        </ul>
      </div>
    </div>

    {/* Department of Tourism */}
    <div>
      <h3 className="text-lg font-bold mb-4 text-white">Ministry of Tourism</h3>
      <ul className="space-y-2 list-disc list-inside">
        <li>Tourism Policy</li>
        <li>Annual Reports</li>
        <li>Press Releases</li>
        <li>Right to Information</li>
        <li>Incredible India Campaign</li>
        <li>Media Gallery</li>
        <li>Research & Statistics</li>
        <li>Tenders & Notices</li>
      </ul>
      <h4 className="mt-6 mb-3 font-bold text-white text-lg">Hospitality & Services</h4>
      <ul className="space-y-2 list-disc list-inside">
        <li>Hotel Listing</li>
        <li>Travel Agent Registration</li>
        <li>Homestay Initiatives</li>
        <li>Tour Guide Program</li>
      </ul>
    </div>

    {/* Trade */}
    <div>
      <h3 className="text-lg font-bold mb-4 text-white">Tourism Initiatives</h3>
      <ul className="space-y-2 list-disc list-inside">
        <li>Invest in Indian Tourism</li>
        <li>Swadesh Darshan Scheme</li>
        <li>PRASHAD Scheme</li>
        <li>Bhraman</li>
        <li>Tourism Mart India</li>
        <li>Eco-Tourism Development</li>
        <li>Rural Tourism Projects</li>
        <li>Skill Development in Hospitality</li>
        <li>Digital Tourism Tools</li>
        <li>Start-up India in Tourism</li>
        <li>Medical & Wellness Tourism</li>
        <li>Heritage City Development</li>
        <li>Accredited Service Providers</li>
        <li>Tourism Vision 2047</li>
      </ul>
    </div>
  </div>

  {/* Bottom Bar */}
  <div className="py-6 bg-blue-600 text-center text-sm border-t border-blue-100">
    © 2025 BhramanAI. Built for Incredible India 🇮🇳
  </div>
</footer>


    </div>
  );
}