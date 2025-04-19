import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ResultsPage = ({ location }) => {
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [state, setState] = useState({
    source: location?.state?.source || '',
    destination: location?.state?.destination || '',
    preference: location?.state?.preference || 'balanced',
  });

  useEffect(() => {
    if (state.source && state.destination) {
      fetchTripData();
    }
  }, [state.source, state.destination]);

  const fetchTripData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/planTrip`, {
        source: state.source,
        destination: state.destination,
        preference: state.preference || 'balanced',
      });
      setTripData(response.data);
    } catch (err) {
      setError('Error fetching trip data.');
    } finally {
      setLoading(false);
    }
  };

  const renderTripSummary = () => {
    if (!tripData) return null;

    const { source, destination, totalCost, totalTime, totalDistance } = tripData.summary;
    return (
      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Trip Summary</h2>
        <p><strong>Source:</strong> {source}</p>
        <p><strong>Destination:</strong> {destination}</p>
        <p><strong>Total Cost:</strong> ₹{totalCost}</p>
        <p><strong>Total Time:</strong> {totalTime} hrs</p>
        <p><strong>Total Distance:</strong> {totalDistance} km</p>
      </div>
    );
  };

  const renderRouteBreakdown = () => {
    if (!tripData || !tripData.routes) return null;

    return (
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Segmented Route Breakdown</h2>
        {tripData.routes.map((route, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h3 className="text-xl font-semibold">{route.transportMode}</h3>
            <p><strong>Duration:</strong> {route.duration} mins</p>
            <p><strong>Cost:</strong> ₹{route.cost}</p>
            <p><strong>Distance:</strong> {route.distance} km</p>
            <p><strong>From:</strong> {route.start} <strong>To:</strong> {route.end}</p>
            <div className="mt-2">
              {/* Display map or route image here if available */}
              {route.mapImage && <img src={route.mapImage} alt="Route Map" className="w-full h-auto rounded-md" />}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderError = () => {
    if (!error) return null;
    return <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow-md">{error}</div>;
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      {loading ? (
        <div className="text-center text-lg">Loading trip details...</div>
      ) : (
        <>
          {renderError()}
          {renderTripSummary()}
          {renderRouteBreakdown()}
        </>
      )}
    </div>
  );
};

export default ResultsPage;
