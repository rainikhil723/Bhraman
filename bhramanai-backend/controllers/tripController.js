const axios = require('axios');
const {
  getCoordinates,
  
  findNearestRailway,
  findNearestMetroStation,
  findNearestBusTerminal,
} = require('../googleApi');
const { selectTransport } = require('../utils/transportLogic');

/**
 * Helper function to find nearest transport hub (railway, metro, bus)
 * @param {object} coordinates - {lat, lng}
 * @param {string} tripType - "intercity" or "local"
 * @returns {object} Nearest hub info or fallback
 */
const predefinedHubs = {
  Delhi: { name: 'New Delhi Railway Station', coordinates: { lat: 28.6139, lng: 77.2090 }, distance: 0 },
  Agra: { name: 'Agra Cantt Railway Station', coordinates: { lat: 27.1767, lng: 78.0081 }, distance: 0 },
};

async function getRoute(origin, destination) {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
      params: {
        origin: `${origin.lat},${origin.lng}`,
        destination: `${destination.lat},${destination.lng}`,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    if (response.data.status === "OK" && response.data.routes && response.data.routes.length > 0) {
      const route = response.data.routes[0];
      
      // Ensure the route has legs and the necessary distance information
      if (route.legs && route.legs.length > 0) {
        return {
          ...route,
          distance: route.legs[0].distance || { value: 0, text: "0 km" },
          duration: route.legs[0].duration || { value: 0, text: "0 mins" }
        };
      }
      
      return {
        ...route,
        distance: { value: 0, text: "0 km" },
        duration: { value: 0, text: "0 mins" }
      };
    } else {
      console.error("Google Directions API error:", response.data.error_message || "No routes found");
      throw new Error("Failed to fetch route");
    }
  } catch (error) {
    console.error("Error fetching route:", error.message);
    throw new Error("Failed to fetch route");
  }
}

async function findNearestHub(coordinates, tripType = 'intercity') {
  try {
    const [railway, metro, bus] = await Promise.all([
      findNearestRailway(coordinates).catch(() => null),
      findNearestMetroStation(coordinates).catch(() => null),
      findNearestBusTerminal(coordinates).catch(() => null),
    ]);

    console.log('Hubs found:', { railway, metro, bus });

    const hubs = [railway, metro, bus].filter(Boolean).sort((a, b) => a.distance - b.distance);

    if (!hubs.length) {
      return {
        name: 'No suitable hub found',
        coordinates,
        distance: 0,
        error: 'No transport hubs found within a reasonable distance.',
      };
    }

    return hubs[0];
  } catch (error) {
    console.error('Hub finding error:', error.message);
    return {
      name: 'No suitable hub found',
      coordinates,
      distance: 0,
      error: error.message,
    };
  }
}

/**
 * Calculate cost based on transport mode and distance
 * @param {number} distanceKm - Distance in kilometers
 * @param {string} transportMode - Mode of transport
 * @returns {number} Cost in rupees
 */
function calculateCost(distanceKm, transportMode) {
  const baseCosts = {
    Walk: 0,
    'E-Rickshaw': 20,
    Auto: 50,
    Metro: 40,
    Cab: 200,
    Train: 200 + distanceKm * 0.5, // Base + per km charge
  };

  const cost = baseCosts[transportMode] || 50;
  return Math.round(cost);
}

/**
 * Calculate duration based on transport mode and distance
 * @param {number} distanceKm - Distance in kilometers
 * @param {string} transportMode - Mode of transport
 * @returns {object} Duration object with text and value (in seconds)
 */
function calculateDuration(distanceKm, transportMode) {
  const speeds = {
    Walk: 5,
    'E-Rickshaw': 15,
    Metro: 35,
    Auto: 25,
    Cab: 40,
    Train: 80,
  };

  const speed = speeds[transportMode] || 30;
  const timeHours = distanceKm / speed;
  const timeMinutes = Math.max(1, Math.round(timeHours * 60));

  let text;
  const hours = Math.floor(timeMinutes / 60);
  const minutes = timeMinutes % 60;

  if (hours === 0) {
    text = `${minutes} mins`;
  } else if (minutes === 0) {
    text = `${hours} hr`;
  } else {
    text = `${hours} hr ${minutes} mins`;
  }

  return {
    text: text,
    value: timeMinutes * 60, // seconds
  };
}

/**
 * Core recursive trip planning function
 * Segments trip into optimal legs based on distance and location type.
 */
async function planSegmentedTrip(source, destination, preference) {
  try {
    const sourceCoords = await getCoordinates(source);
    const destCoords = await getCoordinates(destination);

    const directRoute = await getRoute(sourceCoords, destCoords); // Call Google Directions API
    const distanceKm = directRoute && directRoute.distance && directRoute.distance.value 
      ? directRoute.distance.value / 1000 
      : 0;

    const segments = [];

    if (distanceKm > 50) {
      // Intercity trip logic
      const sourceHub = await findNearestHub(sourceCoords, 'intercity');
      const destHub = await findNearestHub(destCoords, 'intercity');

      if (sourceHub && destHub) {
        // First leg: Source to source hub
        const firstLegRoute = await getRoute(sourceCoords, sourceHub.coordinates);
        const firstLegDistance = firstLegRoute && firstLegRoute.distance || { value: 0, text: "0 km" };
        
        segments.push({
          from: source,
          to: sourceHub.name,
          mode: selectTransport(sourceHub.distance, preference),
          distance: firstLegDistance,
          duration: calculateDuration(sourceHub.distance, selectTransport(sourceHub.distance, preference)),
          cost: calculateCost(sourceHub.distance, selectTransport(sourceHub.distance, preference)),
          instructions: `Take transport from ${source} to ${sourceHub.name}`,
          mapData: firstLegRoute || {}, // Include mapData with fallback
        });

        // Middle leg: Source hub to destination hub
        const middleLegRoute = await getRoute(sourceHub.coordinates, destHub.coordinates);
        const middleLegDistanceKm = middleLegRoute && middleLegRoute.distance && middleLegRoute.distance.value 
          ? middleLegRoute.distance.value / 1000 
          : 0;
          
        segments.push({
          from: sourceHub.name,
          to: destHub.name,
          mode: 'Train',
          distance: middleLegRoute && middleLegRoute.distance || { value: 0, text: "0 km" },
          duration: calculateDuration(middleLegDistanceKm, 'Train'),
          cost: calculateCost(middleLegDistanceKm, 'Train'),
          instructions: `Take train from ${sourceHub.name} to ${destHub.name}`,
          mapData: middleLegRoute || {}, // Include mapData with fallback
        });

        // Final leg: Destination hub to destination
        const finalLegRoute = await getRoute(destHub.coordinates, destCoords);
        const finalLegDistance = finalLegRoute && finalLegRoute.distance || { value: 0, text: "0 km" };
        
        segments.push({
          from: destHub.name,
          to: destination,
          mode: selectTransport(destHub.distance, preference),
          distance: finalLegDistance,
          duration: calculateDuration(destHub.distance, selectTransport(destHub.distance, preference)),
          cost: calculateCost(destHub.distance, selectTransport(destHub.distance, preference)),
          instructions: `Take transport from ${destHub.name} to ${destination}`,
          mapData: finalLegRoute || {}, // Include mapData with fallback
        });
      }
    } else {
      // Local trip logic
      const directTransport = selectTransport(distanceKm, preference);
      segments.push({
        from: source,
        to: destination,
        mode: directTransport,
        distance: directRoute && directRoute.distance || { value: 0, text: "0 km" },
        duration: calculateDuration(distanceKm, directTransport),
        cost: calculateCost(distanceKm, directTransport),
        instructions: `Take ${directTransport} from ${source} to ${destination}`,
        mapData: directRoute || {}, // Include mapData with fallback
      });
    }

    return segments;
  } catch (error) {
    console.error('Trip planning error:', error);
    throw new Error(`Failed to plan trip: ${error.message}`);
  }
}

/**
 * Main controller function for trip planning
 * Handles the POST /api/planTrip endpoint
 */
exports.planTrip = async (req, res) => {
  try {
    const { source, destination, preference = 'time' } = req.body;

    // Validate inputs
    if (!source || !destination) {
      return res.status(400).json({
        success: false,
        error: 'Both source and destination are required',
      });
    }

    console.log(`Planning trip from ${source} to ${destination} (Preference: ${preference})`);

    // Plan the trip with segmentation logic
    const segments = await planSegmentedTrip(source, destination, preference);

    // Calculate totals with safe access to properties
    const totalDistanceValue = segments.reduce((sum, segment) => {
      return sum + (segment.distance && typeof segment.distance.value === 'number' ? segment.distance.value : 0);
    }, 0);
    
    const totalDistanceKm = totalDistanceValue / 1000;

    const totalDistance = {
      value: totalDistanceValue,
      text: `${totalDistanceKm.toFixed(1)} km`,
    };

    const totalDurationSeconds = segments.reduce((sum, segment) => {
      return sum + (segment.duration && typeof segment.duration.value === 'number' ? segment.duration.value : 0);
    }, 0);
    
    const totalDurationMins = Math.floor(totalDurationSeconds / 60);

    // Format duration text
    let totalDurationText;
    const hours = Math.floor(totalDurationMins / 60);
    const minutes = totalDurationMins % 60;

    if (hours === 0) {
      totalDurationText = `${minutes} mins`;
    } else if (minutes === 0) {
      totalDurationText = `${hours} hr`;
    } else {
      totalDurationText = `${hours} hr ${minutes} mins`;
    }

    // Calculate total cost with safe access
    const totalCost = segments.reduce((sum, segment) => {
      return sum + (typeof segment.cost === 'number' ? segment.cost : 0);
    }, 0);

    // Return the complete trip plan
    res.json({
      success: true,
      start: source,
      end: destination,
      totalDistance: totalDistance,
      totalDuration: {
        text: totalDurationText,
        value: totalDurationSeconds,
      },
      totalCost: `₹${totalCost}`,
      preference,
      segments,
    });
  } catch (error) {
    console.error('Trip planning error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to plan route',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
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
