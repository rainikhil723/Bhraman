import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TransportForm = () => {
  const navigate = useNavigate();
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [preference, setPreference] = useState('time');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestedLocations, setSuggestedLocations] = useState({ source: [], destination: [] });

  // Check server status on component mount
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/status', {
          method: 'GET',
        });
        if (!response.ok) {
          console.warn('Server might be experiencing issues');
        }
      } catch (err) {
        console.error('Server connection error:', err);
        setError('Unable to connect to server. Please try again later.');
      }
    };
    
    checkServerStatus();
  }, []);

  // Fetch location suggestions based on input
  const fetchSuggestions = async (input, type) => {
    if (!input || input.length < 3) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/locations/suggest?query=${encodeURIComponent(input)}`);
      if (response.ok) {
        const data = await response.json();
        setSuggestedLocations(prev => ({
          ...prev,
          [type]: data.suggestions || []
        }));
      }
    } catch (err) {
      console.error('Error fetching suggestions:', err);
    }
  };

  const handleInputChange = (e, setter, type) => {
    const value = e.target.value;
    setter(value);
    
    // Debounce suggestion requests
    setTimeout(() => {
      fetchSuggestions(value, type);
    }, 300);
  };

  const selectSuggestion = (value, setter, type) => {
    setter(value);
    setSuggestedLocations(prev => ({
      ...prev,
      [type]: []
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!source || !destination) {
      setError('Please provide both source and destination');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/planTrip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: source + (source.toLowerCase().includes('delhi') ? '' : ', Delhi'),
          destination: destination + (destination.toLowerCase().includes('agra') ? '' : ', Agra'),
          preference,
          includeCoordinates: true, // Request coordinates to help with station finding
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Trip planning failed');
      }

      if (data.warnings && data.warnings.length > 0) {
        console.warn('Trip planning warnings:', data.warnings);
      }

      navigate('/results', {
        state: {
          trip: {
            ...data,
            start: source,
            end: destination,
          },
        },
      });
    } catch (err) {
      console.error('API Error:', err);
      
      // More specific error messages based on observed issues
      if (err.message && err.message.includes("railway station")) {
        setError('Could not find railway stations near the provided locations. Please try more specific location names including city names.');
      } else {
        setError(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Plan Your Trip</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label htmlFor="source" className="block text-gray-700 font-medium mb-2">
            Starting Point
          </label>
          <input
            type="text"
            id="source"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter full address with city (e.g., Ramesh Nagar, Delhi)"
            value={source}
            onChange={(e) => handleInputChange(e, setSource, 'source')}
            required
          />
          {suggestedLocations.source.length > 0 && (
            <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto">
              {suggestedLocations.source.map((suggestion, index) => (
                <div 
                  key={index}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => selectSuggestion(suggestion, setSource, 'source')}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <label htmlFor="destination" className="block text-gray-700 font-medium mb-2">
            Destination
          </label>
          <input
            type="text"
            id="destination"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter full address with city (e.g., Taj Mahal, Agra)"
            value={destination}
            onChange={(e) => handleInputChange(e, setDestination, 'destination')}
            required
          />
          {suggestedLocations.destination.length > 0 && (
            <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto">
              {suggestedLocations.destination.map((suggestion, index) => (
                <div 
                  key={index}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => selectSuggestion(suggestion, setDestination, 'destination')}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Trip Preference
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="preference"
                value="time"
                checked={preference === 'time'}
                onChange={() => setPreference('time')}
                className="mr-2"
              />
              <span>Fastest</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="preference"
                value="cost"
                checked={preference === 'cost'}
                onChange={() => setPreference('cost')}
                className="mr-2"
              />
              <span>Cheapest</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="preference"
                value="comfort"
                checked={preference === 'comfort'}
                onChange={() => setPreference('comfort')}
                className="mr-2"
              />
              <span>Most Comfortable</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            loading ? 'cursor-wait' : ''
          }`}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Planning...
            </div>
          ) : (
            'Plan My Trip'
          )}
        </button>
      </form>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Tip: For better results, include full location names with city names (e.g., "Ramesh Nagar, Delhi" instead of just "Ramesh Nagar")</p>
      </div>
    </div>
  );
};

export default TransportForm;