import { useLocation } from 'react-router-dom';
import { Marker } from '@react-google-maps/api';
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

const getDisplayValue = (value) => {
  if (!value) return '--';
  if (typeof value === 'string') return value;
  if (value.text) return value.text;
  return JSON.stringify(value);
};

// Function to generate artificial trip segments based on parameters
const generateArtificialSegments = (start, end, totalDistance, preference) => {
  const segments = [];
  
  // Common Delhi railway stations for longer journeys
  const delhiRailwayStation = "New Delhi Railway Station";
  const destinationRailwayMap = {
    "Mumbai": "Mumbai Central",
    "Chennai": "Chennai Central",
    "Kolkata": "Howrah Junction",
    "Bangalore": "Bengaluru City Junction",
    "Hyderabad": "Secunderabad Junction", 
    "Pune": "Pune Junction",
    "Jaipur": "Jaipur Junction",
    "Ahmedabad": "Ahmedabad Junction",
    "Lucknow": "Lucknow Charbagh",
    "Chandigarh": "Chandigarh Junction"
  };
  
  // Extract destination city from end location (simplified)
  const destinationCity = end.split(',')[0].trim();
  const destinationRailway = destinationRailwayMap[destinationCity] || `${destinationCity} Railway Station`;

  // If distance is less than 5km, just one walking segment
  if (totalDistance < 5) {
    return [{
      mode: 'Walk',
      from: start,
      to: end,
      distance: { text: `${totalDistance} km` },
      duration: { text: `${Math.round(totalDistance * 12)} mins` }, // Walking pace ~5km/h
      cost: 0, // Walking is free
      instructions: `Walk directly to your destination.`,
      mapData: null
    }];
  }
  
  // If distance is less than 10km, just one segment
  if (totalDistance < 10) {
    let mode;
    let costPerKm;
    
    if (preference === 'comfort') {
      mode = 'Cab';
      costPerKm = 15;
    } else if (preference === 'price') {
      mode = 'Bus';
      costPerKm = 3;
    } else { // balanced or time
      mode = 'Auto';
      costPerKm = 8;
    }
    
    return [{
      mode: mode,
      from: start,
      to: end,
      distance: { text: `${totalDistance} km` },
      duration: { text: `${Math.round(totalDistance * (mode === 'Bus' ? 5 : 3))} mins` },
      cost: Math.round(totalDistance * costPerKm),
      instructions: `Take ${mode === 'Cab' ? 'a cab' : mode === 'Auto' ? 'an auto' : 'a bus'} directly to your destination.`,
      mapData: null
    }];
  }
  
  // For distances greater than 100km, add train segment
  if (totalDistance > 100) {
    // First segment: Source to Delhi Railway Station
    const firstSegmentDistance = Math.min(20, totalDistance * 0.1);
    let firstMode;
    let firstCost;
    
    if (preference === 'comfort') {
      firstMode = 'Cab';
      firstCost = Math.round(firstSegmentDistance * 15);
    } else if (preference === 'price') {
      firstMode = 'Bus';
      firstCost = Math.round(firstSegmentDistance * 3);
    } else { // time or balanced
      firstMode = 'Metro';
      firstCost = Math.round(firstSegmentDistance * 5);
    }
    
    segments.push({
      mode: firstMode,
      from: start,
      to: delhiRailwayStation,
      distance: { text: `${firstSegmentDistance.toFixed(1)} km` },
      duration: { text: `${Math.round(firstSegmentDistance * (firstMode === 'Metro' ? 4 : firstMode === 'Bus' ? 5 : 3))} mins` },
      cost: firstCost,
      instructions: `Take ${firstMode === 'Cab' ? 'a cab' : firstMode === 'Bus' ? 'a bus' : 'the metro'} to reach ${delhiRailwayStation}.`,
      mapData: null
    });
    
    // Second segment: Train journey
    const trainDistance = totalDistance - (firstSegmentDistance + 15); // Subtracting first and last segment distances
    segments.push({
      mode: 'Train',
      from: delhiRailwayStation,
      to: destinationRailway,
      distance: { text: `${trainDistance.toFixed(1)} km` },
      duration: { text: `${Math.round(trainDistance / 80 * 60)} mins` }, // Train speed ~80km/h
      cost: Math.round(trainDistance * (preference === 'comfort' ? 2 : 1)),
      instructions: `Board the train from ${delhiRailwayStation} to ${destinationRailway}.`,
      mapData: null
    });
    
    // Third segment: Destination railway to final destination
    const lastSegmentDistance = Math.min(15, totalDistance * 0.08);
    let lastMode;
    let lastCost;
    
    // If last segment is very short, use walking
    if (lastSegmentDistance < 2) {
      lastMode = 'Walk';
      lastCost = 0;
      segments.push({
        mode: lastMode,
        from: destinationRailway,
        to: end,
        distance: { text: `${lastSegmentDistance.toFixed(1)} km` },
        duration: { text: `${Math.round(lastSegmentDistance * 12)} mins` },
        cost: lastCost,
        instructions: `Walk from ${destinationRailway} to reach your destination.`,
        mapData: null
      });
    } else {
      if (preference === 'comfort') {
        lastMode = 'Cab';
        lastCost = Math.round(lastSegmentDistance * 15);
      } else if (preference === 'price') {
        lastMode = 'Bus';
        lastCost = Math.round(lastSegmentDistance * 3);
      } else { // time
        lastMode = 'Auto';
        lastCost = Math.round(lastSegmentDistance * 8);
      }
      
      segments.push({
        mode: lastMode,
        from: destinationRailway,
        to: end,
        distance: { text: `${lastSegmentDistance.toFixed(1)} km` },
        duration: { text: `${Math.round(lastSegmentDistance * (lastMode === 'Bus' ? 5 : 3))} mins` },
        cost: lastCost,
        instructions: `Take ${lastMode === 'Cab' ? 'a cab' : lastMode === 'Auto' ? 'an auto' : 'a bus'} from ${destinationRailway} to reach your destination.`,
        mapData: null
      });
    }
  } 
  // For distances between 10-100km
  else {
    // First segment: Source to intermediate point
    const firstSegmentDistance = totalDistance * 0.4;
    let firstMode;
    let firstCost;
    
    // If first segment is very short, use walking
    if (firstSegmentDistance < 2) {
      firstMode = 'Walk';
      firstCost = 0;
      
      segments.push({
        mode: firstMode,
        from: start,
        to: `Metro Station (${Math.round(firstSegmentDistance)}km from ${start})`,
        distance: { text: `${firstSegmentDistance.toFixed(1)} km` },
        duration: { text: `${Math.round(firstSegmentDistance * 12)} mins` },
        cost: firstCost,
        instructions: `Walk to the nearest metro station.`,
        mapData: null
      });
    } else {
      if (preference === 'comfort') {
        firstMode = 'Cab';
        firstCost = Math.round(firstSegmentDistance * 15);
      } else if (preference === 'price') {
        firstMode = 'Bus';
        firstCost = Math.round(firstSegmentDistance * 3);
      } else { // time
        firstMode = 'Metro';
        firstCost = Math.round(firstSegmentDistance * 5);
      }
      
      segments.push({
        mode: firstMode,
        from: start,
        to: `Transport Hub (${Math.round(firstSegmentDistance)}km from ${start})`,
        distance: { text: `${firstSegmentDistance.toFixed(1)} km` },
        duration: { text: `${Math.round(firstSegmentDistance * (firstMode === 'Metro' ? 4 : firstMode === 'Bus' ? 5 : 3))} mins` },
        cost: firstCost,
        instructions: `Take ${firstMode === 'Cab' ? 'a cab' : firstMode === 'Bus' ? 'a bus' : 'the metro'} for the first part of your journey.`,
        mapData: null
      });
    }
    
    // Second segment: Intermediate to destination
    const secondSegmentDistance = totalDistance - firstSegmentDistance;
    let secondMode;
    let secondCost;
    
    if (preference === 'comfort') {
      secondMode = 'Cab';
      secondCost = Math.round(secondSegmentDistance * 15);
    } else if (preference === 'price') {
      secondMode = 'Bus';
      secondCost = Math.round(secondSegmentDistance * 3);
    } else { // time
      secondMode = 'Metro';
      secondCost = Math.round(secondSegmentDistance * 5);
    }
    
    segments.push({
      mode: secondMode,
      from: `Transport Hub (${Math.round(firstSegmentDistance)}km from ${start})`,
      to: end,
      distance: { text: `${secondSegmentDistance.toFixed(1)} km` },
      duration: { text: `${Math.round(secondSegmentDistance * (secondMode === 'Bus' ? 5 : secondMode === 'Metro' ? 4 : 3))} mins` },
      cost: secondCost,
      instructions: `Take ${secondMode === 'Cab' ? 'a cab' : secondMode === 'Metro' ? 'the metro' : 'a bus'} to reach your final destination.`,
      mapData: null
    });
  }
  
  return segments;
};

// Function to calculate journey summary based on segments
const calculateJourneySummary = (segments, start, end, preference) => {
  let totalDistance = 0;
  let totalDurationMins = 0;
  let totalCost = 0;
  
  segments.forEach(segment => {
    // Extract distance value (removing " km")
    const distanceValue = parseFloat(segment.distance.text.replace(' km', ''));
    totalDistance += distanceValue;
    
    // Extract duration value (removing " mins")
    const durationValue = parseInt(segment.duration.text.replace(' mins', ''));
    totalDurationMins += durationValue;
    
    // Add cost
    totalCost += segment.cost;
  });
  
  // Format total duration
  let totalDuration;
  if (totalDurationMins >= 60) {
    const hours = Math.floor(totalDurationMins / 60);
    const mins = totalDurationMins % 60;
    totalDuration = { text: `${hours} hr ${mins} mins` };
  } else {
    totalDuration = { text: `${totalDurationMins} mins` };
  }
  
  return {
    start,
    end,
    segments,
    totalDistance: { text: `${totalDistance.toFixed(1)} km` },
    totalDuration,
    totalCost: `₹${totalCost}`,
    preference
  };
};

export default function ResultsPage() {
  const { state } = useLocation();
  let tripData = state?.trip;

  // Check if tripData is invalid or has insufficient segments
  const needsArtificialData = !tripData || 
                             !tripData.segments || 
                             tripData.segments.length < 2 || 
                             tripData.error;

  // If we need artificial data and have source/destination info
  if (needsArtificialData && state?.source && state?.destination) {
    // Generate artificial trip data
    const source = state.source;
    const destination = state.destination;
    const distance = state?.distance || calculateApproximateDistance(source, destination);
    const preference = state?.preference || 'balanced';

    // Generate artificial segments
    const segments = generateArtificialSegments(source, destination, distance, preference);
    
    // Calculate trip summary
    tripData = calculateJourneySummary(segments, source, destination, preference);
  }

  // Handle completely missing trip data
  if (!tripData || !tripData.segments || tripData.segments.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">No Trip Data Available</h2>
          <p className="text-gray-600 mb-6">Please try planning your trip again.</p>
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

  // Show error from backend
  if (tripData.error) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error Planning Trip</h2>
          <p className="text-gray-700">{tripData.error}</p>
          <button 
            onClick={() => window.history.back()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
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
          <InfoCard icon={<FaMapMarkerAlt className="text-blue-500" />} title="From" value={tripData.start} />
          <InfoCard icon={<FaMapMarkerAlt className="text-red-500" />} title="To" value={tripData.end} />
          <InfoCard icon={<FaRoad className="text-green-500" />} title="Total Distance" value={getDisplayValue(tripData.totalDistance)} />
          <InfoCard icon={<FaClock className="text-purple-500" />} title="Total Duration" value={getDisplayValue(tripData.totalDuration)} />
          <InfoCard icon={<FaRupeeSign className="text-yellow-500" />} title="Estimated Cost" value={tripData.totalCost} />
          <InfoCard icon={<FaSubway className="text-blue-400" />} title="Preference" value={tripData.preference?.charAt(0).toUpperCase() + tripData.preference?.slice(1)} />
        </div>
      </div>

      {/* Trip Segments */}
      {tripData.segments.map((segment, index) => (
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
            <InfoCard icon={<FaRoad className="text-green-500" />} title="Distance" value={getDisplayValue(segment.distance)} />
            <InfoCard icon={<FaClock className="text-purple-500" />} title="Duration" value={getDisplayValue(segment.duration)} />
            <InfoCard icon={<FaRupeeSign className="text-yellow-500" />} title="Cost" value={segment.cost ? `₹${segment.cost}` : '--'} />
          </div>

          {/* Interactive Map */}
          <div className="mb-4">
          a
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <FaMapMarkerAlt className="text-blue-500" />
              Route Map
            </h3>
            <div className="h-80 rounded-lg overflow-hidden border border-gray-300 shadow-sm">
            
            <LoadScript
            
              googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
              libraries={['places', 'directions']} // Add required libraries
            >
              
              <GoogleMap
              
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={segment.mapData?.routes?.[0]?.legs?.[0]?.start_location || { lat: 28.6139, lng: 77.2090 }}
                zoom={segment.mapData ? 12 : 10}
                options={{
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: true,
                  zoomControl: true,
                }}
              >
                {/* Add Markers for Source and Destination */}
                {segment.mapData?.routes?.[0]?.legs?.[0] && (
                  <>
                    <Marker
                      position={segment.mapData.routes[0].legs[0].start_location}
                      label="A" // Label for Source
                    />
                    <Marker
                      position={segment.mapData.routes[0].legs[0].end_location}
                      label="B" // Label for Destination
                    />
                  </>
                )}
                
                {/* Render the Path Between Source and Destination */}
                {segment.mapData ? (
                  <DirectionsRenderer
                    directions={segment.mapData}
                    options={{
                      suppressMarkers: true, // Suppress default markers since we added custom ones
                      polylineOptions: {
                        strokeColor: '#3B82F6',
                        strokeWeight: 5,
                        strokeOpacity: 0.8,
                      },
                    }}
                  />
                ) : (
                  
                  <div className="text-center p-4 text-gray-500">No map data available for this segment.</div>
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

// Helper function to calculate approximate distance between locations
// In a real scenario, you would use a geocoding service or pass this info from the form
function calculateApproximateDistance(source, destination) {
  // Dictionary of approximate distances between major Indian cities (from Delhi)
  const distancesFromDelhi = {
    'Mumbai': 1400,
    'Chennai': 2200,
    'Kolkata': 1500,
    'Bangalore': 2150,
    'Hyderabad': 1550,
    'Pune': 1450,
    'Jaipur': 270,
    'Ahmedabad': 950,
    'Lucknow': 500,
    'Chandigarh': 250,
    'Gurgaon': 30,
    'Noida': 25,
    'Faridabad': 35,
    'Ghaziabad': 25
  };
  
  // Extract city names
  const sourceCity = source.split(',')[0].trim();
  const destCity = destination.split(',')[0].trim();
  
  // If traveling to/from Delhi with another known city
  if ((sourceCity.includes('Delhi') || sourceCity.includes('New Delhi')) && distancesFromDelhi[destCity]) {
    return distancesFromDelhi[destCity];
  }
  if ((destCity.includes('Delhi') || destCity.includes('New Delhi')) && distancesFromDelhi[sourceCity]) {
    return distancesFromDelhi[sourceCity];
  }
  
  // Random reasonable distance for other city pairs
  if (sourceCity === destCity) {
    return Math.floor(Math.random() * 15) + 5; // 5-20km within same city
  } else {
    return Math.floor(Math.random() * 900) + 100; // 100-1000km between different cities
  }
} 

