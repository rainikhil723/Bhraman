import { useLocation } from 'react-router-dom';
import { GoogleMap, LoadScript, DirectionsRenderer } from '@react-google-maps/api';
import { 
  FaWalking, 
  FaTrain, 
  FaSubway, 
  FaTaxi, 
  FaBus, 
  FaMotorcycle,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaClock,
  FaRoad
} from 'react-icons/fa';

const transportIcons = {
  Walk: <FaWalking className="text-green-600 text-2xl" />,
  Metro: <FaSubway className="text-blue-600 text-2xl" />,
  Train: <FaTrain className="text-purple-600 text-2xl" />,
  Cab: <FaTaxi className="text-yellow-600 text-2xl" />,
  Bus: <FaBus className="text-red-500 text-2xl" />,
  Auto: <FaMotorcycle className="text-orange-500 text-2xl" />,
  'E-Rickshaw': <FaMotorcycle className="text-teal-500 text-2xl" />
};

const InfoCard = ({ icon, title, value }) => (
  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
    <div className="text-blue-600">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="font-medium">{value || '--'}</p>
    </div>
  </div>
);

// Helper function to extract display value from distance/duration objects
const getDisplayValue = (value) => {
  if (!value) return '--';
  if (typeof value === 'string') return value;
  if (value.text) return value.text;
  return JSON.stringify(value); // fallback for unexpected formats
};

export default function ResultsPage() {
  const { state } = useLocation();
  const tripData = state?.trip;

  if (!tripData) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">No Trip Planned Yet</h2>
          <p className="text-gray-600 mb-6">Please enter your journey details to see the optimal route</p>
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Plan a Trip
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Trip Overview Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-blue-800 flex items-center gap-2">
          <FaMapMarkerAlt className="text-blue-600" />
          Journey Summary
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoCard 
            icon={<FaMapMarkerAlt className="text-blue-500" />} 
            title="From" 
            value={tripData.start} 
          />
          <InfoCard 
            icon={<FaMapMarkerAlt className="text-red-500" />} 
            title="To" 
            value={tripData.end} 
          />
          <InfoCard 
            icon={<FaRoad className="text-green-500" />} 
            title="Total Distance" 
            value={getDisplayValue(tripData.totalDistance)} 
          />
          <InfoCard 
            icon={<FaClock className="text-purple-500" />} 
            title="Total Duration" 
            value={getDisplayValue(tripData.totalDuration)} 
          />
          <InfoCard 
            icon={<FaRupeeSign className="text-yellow-500" />} 
            title="Estimated Cost" 
            value={tripData.totalCost} 
          />
          <InfoCard 
            icon={<FaSubway className="text-blue-400" />} 
            title="Preference" 
            value={tripData.preference?.charAt(0).toUpperCase() + tripData.preference?.slice(1)} 
          />
        </div>
      </div>

      {/* Trip Segments */}
      {tripData.segments?.map((segment, index) => (
        <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          {/* Segment Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-blue-100 rounded-full">
              {transportIcons[segment.mode] || transportIcons.Cab}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Leg {index + 1}: {segment.mode || 'Transport'}
              </h2>
              <p className="text-gray-600">
                {segment.from} → {segment.to}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {segment.instructions}
              </p>
            </div>
          </div>

          {/* Segment Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <InfoCard 
              icon={<FaRoad className="text-green-500" />} 
              title="Distance" 
              value={getDisplayValue(segment.distance)} 
            />
            <InfoCard 
              icon={<FaClock className="text-purple-500" />} 
              title="Duration" 
              value={getDisplayValue(segment.duration)} 
            />
            <InfoCard 
              icon={<FaRupeeSign className="text-yellow-500" />} 
              title="Cost" 
              value={segment.cost ? `₹${segment.cost}` : '--'} 
            />
          </div>

          {/* Interactive Map */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <FaMapMarkerAlt className="text-blue-500" />
              Route Map
            </h3>
            <div className="h-80 rounded-lg overflow-hidden border border-gray-300 shadow-sm">
              <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  center={
                    segment.mapData?.routes?.[0]?.bounds?.getCenter?.() || 
                    { lat: 28.6139, lng: 77.2090 } // Default to Delhi
                  }
                  zoom={segment.mapData ? 12 : 10}
                  options={{
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: true,
                    zoomControl: true
                  }}
                >
                  {segment.mapData && (
                    <DirectionsRenderer
                      directions={segment.mapData}
                      options={{
                        suppressMarkers: true,
                        polylineOptions: {
                          strokeColor: '#3B82F6',
                          strokeWeight: 5,
                          strokeOpacity: 0.8
                        },
                        markerOptions: {
                          visible: false
                        }
                      }}
                    />
                  )}
                </GoogleMap>
              </LoadScript>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
//old one