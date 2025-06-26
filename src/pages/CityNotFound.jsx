import React from 'react';
import { Link } from 'react-router-dom';

export default function CityNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-center px-4">
      <div>
        <h1 className="text-4xl font-bold text-red-600 mb-4">Oops! City Not Found</h1>
        <p className="text-lg text-gray-700 mb-6">
          This city is not yet added. We’re working on it!<br />
          Meanwhile, explore the Varanasi experience to get an idea of BhramanAI.
        </p>
        <Link to="/results/varanasi">
          <button className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
            Explore Varanasi
          </button>
        </Link>
      </div>
    </div>
  );
}
