// src/components/CityLayout.js
import React from "react";
import { Link } from "react-router-dom";
import TransportForm from "./TransportForm";
import MonumentCard from "./MonumentCard";

export default function CityLayout({ cityName, videoSrc, about, places }) {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 shadow bg-white">
        <h1 className="text-2xl font-bold text-blue-600">BhramanAI</h1>
        <Link to="/" className="text-blue-500 hover:underline">Back to Home</Link>
      </nav>

      {/* Hero Video */}
      <section className="relative w-full h-[30vh] overflow-hidden">
      <div style={{ height: '600px' }}>
  <video
    autoPlay
    muted
    loop
    style={{ height: '600px', width: '100%', objectFit: 'cover' }}
  >
    <source src={videoSrc} type="video/mp4" />
  </video>
</div>




        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h2 className="text-4xl text-white font-bold">Welcome to {cityName}</h2>
        </div>
      </section>

      {/* About Section */}
      <section className="px-6 py-10">
        <h3 className="text-3xl font-semibold text-blue-700 mb-4">About {cityName}</h3>
        <p className="text-gray-700 text-lg">{about}</p>
      </section>

      {/* Places to Visit */}
      <section className="px-6 py-10 bg-gray-100">
        <h3 className="text-3xl font-semibold text-blue-700 mb-6">Top Attractions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {places.map((place, i) => (
            <MonumentCard key={i} name={place.name} image={place.image} desc={place.desc} />
          ))}
        </div>
      </section>

      {/* Transport Form */}
      <section className="px-6 py-16 bg-white border-t">
        <TransportForm city={cityName} />
      </section>

      <footer className="py-6 bg-blue-50 text-center text-sm text-gray-600">
        © 2025 BhramanAI | Explore Bharat 🇮🇳
      </footer>
    </div>
  );
}
