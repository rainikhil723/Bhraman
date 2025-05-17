const axios = require('axios');
require("dotenv").config();
const { selectTransport } = require('../utils/transportLogic');

/**
 * Pre-defined transport hubs for major cities
 */
const predefinedHubs = {
  Delhi: { name: 'New Delhi Railway Station', coordinates: { lat: 28.6139, lng: 77.2090 }, distance: 0 },
  'New Delhi': { name: 'New Delhi Railway Station', coordinates: { lat: 28.6139, lng: 77.2090 }, distance: 0 },
  Agra: { name: 'Agra Cantt Railway Station', coordinates: { lat: 27.1767, lng: 78.0081 }, distance: 0 },
  Varanasi: { name: 'Varanasi Junction', coordinates: { lat: 25.3290, lng: 83.0096 }, distance: 0 },
  Mumbai: { name: 'Mumbai Central', coordinates: { lat: 18.9691, lng: 72.8193 }, distance: 0 },
  Chennai: { name: 'Chennai Central', coordinates: { lat: 13.0827, lng: 80.2707 }, distance: 0 },
  Kolkata: { name: 'Howrah Junction', coordinates: { lat: 22.5839, lng: 88.3425 }, distance: 0 },
  Bangalore: { name: 'Bengaluru City Junction', coordinates: { lat: 12.9784, lng: 77.5746 }, distance: 0 },
  Hyderabad: { name: 'Secunderabad Junction', coordinates: { lat: 17.4344, lng: 78.5013 }, distance: 0 }
};

/**
 * Gets coordinates for a location string using Mapbox Geocoding API
 * @param {string} location - Location as a string
 * @returns {Promise<{lat: number, lng: number}>} Coordinates object
 */
async function getCoordinates(location) {
  try {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json`,
      {
        params: {
          access_token: process.env.GOOGLE_MAPS_API_KEY,
          country: 'in',
          limit: 1
        },
      }
    );

    if (!response.data.features || response.data.features.length === 0) {
      throw new Error(`Failed to geocode location: ${location}`);
    }

    const coordinates = response.data.features[0].center;
    // Mapbox returns [lng, lat] so we need to swap them for our format
    return { lat: coordinates[1], lng: coordinates[0] };
  } catch (error) {
    console.error(`Geocoding error for location "${location}":`, error.message);
    throw new Error(`Could not find coordinates for "${location}"`);
  }
}

/**
 * Finds the nearest railway station to the given coordinates using Mapbox API
 * @param {Object} coordinates - {lat, lng} object
 * @returns {Promise<Object>} - Railway station details
 */
async function findNearestRailway(coordinates) {
  try {
    const { lat, lng } = coordinates;
    const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/train%20station.json`, {
      params: {
        proximity: `${lng},${lat}`, // Note: Mapbox uses lng,lat order
        access_token: process.env.GOOGLE_MAPS_API_KEY,
        limit: 1,
        radius: 15000, // 15km radius
        types: 'poi'
      },
      timeout: 10000
    });

    if (!response.data.features || !response.data.features.length) {
      console.warn("No railway stations found");
      return null;
    }
    
    const station = response.data.features[0];
    const stationCoords = {
      lat: station.center[1],
      lng: station.center[0]
    };
    
    // Calculate distance to the station
    const distance = calculateHaversineDistance(
      coordinates.lat, coordinates.lng,
      stationCoords.lat, stationCoords.lng
    );
    
    return {
      name: station.text,
      coordinates: stationCoords,
      distance: distance,
      address: station.place_name
    };
  } catch (error) {
    console.error('Railway station search error:', error.message);
    return null;
  }
}

/**
 * Finds the nearest metro station to the given coordinates using Mapbox API
 * @param {Object} coordinates - {lat, lng} object
 * @returns {Promise<Object>} - Metro station details
 */
async function findNearestMetroStation(coordinates) {
  try {
    const { lat, lng } = coordinates;
    const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/metro%20station.json`, {
      params: {
        proximity: `${lng},${lat}`, // Note: Mapbox uses lng,lat order
        access_token: process.env.GOOGLE_MAPS_API_KEY,
        limit: 1,
        radius: 5000, // 5km radius
        types: 'poi'
      },
      timeout: 10000
    });

    if (!response.data.features || !response.data.features.length) {
      console.warn("No metro stations found");
      return null;
    }
    
    const station = response.data.features[0];
    const stationCoords = {
      lat: station.center[1],
      lng: station.center[0]
    };
    
    // Calculate distance to the station
    const distance = calculateHaversineDistance(
      coordinates.lat, coordinates.lng,
      stationCoords.lat, stationCoords.lng
    );
    
    return {
      name: station.text,
      coordinates: stationCoords,
      distance: distance,
      address: station.place_name
    };
  } catch (error) {
    console.error('Metro station search error:', error.message);
    return null;
  }
}

/**
 * Finds the nearest bus terminal to the given coordinates using Mapbox API
 * @param {Object} coordinates - {lat, lng} object
 * @returns {Promise<Object>} - Bus terminal details
 */
async function findNearestBusTerminal(coordinates) {
  try {
    const { lat, lng } = coordinates;
    const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/bus%20terminal.json`, {
      params: {
        proximity: `${lng},${lat}`, // Note: Mapbox uses lng,lat order
        access_token: process.env.GOOGLE_MAPS_API_KEY,
        limit: 1,
        radius: 10000, // 10km radius
        types: 'poi'
      },
      timeout: 10000
    });

    if (!response.data.features || !response.data.features.length) {
      console.warn("No bus terminals found");
      return null;
    }
    
    const terminal = response.data.features[0];
    const terminalCoords = {
      lat: terminal.center[1],
      lng: terminal.center[0]
    };
    
    // Calculate distance to the terminal
    const distance = calculateHaversineDistance(
      coordinates.lat, coordinates.lng,
      terminalCoords.lat, terminalCoords.lng
    );
    
    return {
      name: terminal.text,
      coordinates: terminalCoords,
      distance: distance,
      address: terminal.place_name
    };
  } catch (error) {
    console.error('Bus terminal search error:', error.message);
    return null;
  }
}

/**
 * Gets route details between two coordinates using Mapbox Directions API
 * @param {Object} origin - {lat, lng} for origin
 * @param {Object} destination - {lat, lng} for destination
 * @returns {Promise<Object>} - Route details
 */
async function getRoute(origin, destination) {
  try {
    // Mapbox expects coordinates as lng,lat
    const originCoord = `${origin.lng},${origin.lat}`;
    const destCoord = `${destination.lng},${destination.lat}`;
    
    const response = await axios.get(`https://api.mapbox.com/directions/v5/mapbox/driving/${originCoord};${destCoord}`, {
      params: {
        access_token: process.env.GOOGLE_MAPS_API_KEY,
        geometries: 'geojson',
        overview: 'full',
        steps: true
      },
      timeout: 10000
    });

    if (response.data.routes && response.data.routes.length > 0) {
      const route = response.data.routes[0];
      
      // Convert Mapbox response to match our expected format
      const distance = {
        value: route.distance, // in meters
        text: `${(route.distance / 1000).toFixed(1)} km`
      };
      
      const duration = {
        value: route.duration, // in seconds
        text: formatDuration(route.duration)
      };
      
      return {
        ...route,
        distance,
        duration
      };
    } else {
      console.error("Mapbox Directions API error: No routes found");
      throw new Error("Failed to fetch route");
    }
  } catch (error) {
    console.error("Error fetching route:", error.message);
    throw new Error("Failed to fetch route");
  }
}

/**
 * Format duration in seconds to a human-readable string
 * @param {number} seconds - Duration in seconds
 * @returns {string} - Formatted duration string
 */
function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${minutes} mins`;
  } else if (remainingMinutes === 0) {
    return `${hours} hr`;
  } else {
    return `${hours} hr ${remainingMinutes} mins`;
  }
}

/**
 * Finds the nearest transport hub to the given coordinates
 * @param {Object} coordinates - {lat, lng} object
 * @param {string} tripType - "intercity" or "local"
 * @returns {Promise<Object>} - Transport hub details
 */
async function findNearestHub(coordinates, tripType = 'intercity') {
  try {
    // Try to determine the city based on the coordinates
    const cityInfo = await determineCityFromCoordinates(coordinates);
    let cityName = cityInfo ? cityInfo.city : null;
    
    console.log(`Determined city: ${cityName}`);
    
    // Check if we have a predefined hub for this city
    if (cityName && predefinedHubs[cityName]) {
      const hubInfo = predefinedHubs[cityName];
      const distance = calculateHaversineDistance(
        coordinates.lat, coordinates.lng,
        hubInfo.coordinates.lat, hubInfo.coordinates.lng
      );
      
      console.log(`Using predefined hub for ${cityName}: ${hubInfo.name}`);
      return { ...hubInfo, distance };
    }
    
    // If no predefined hub, search for nearby transport hubs
    console.log(`Searching for transport hubs near coordinates: ${coordinates.lat}, ${coordinates.lng}`);
    
    const [railway, metro, bus] = await Promise.all([
      findNearestRailway(coordinates).catch(() => null),
      findNearestMetroStation(coordinates).catch(() => null),
      findNearestBusTerminal(coordinates).catch(() => null),
    ]);

    console.log('Hubs found:', { 
      railway: railway ? `${railway.name} (${railway.distance.toFixed(2)}km)` : 'None',
      metro: metro ? `${metro.name} (${metro.distance.toFixed(2)}km)` : 'None', 
      bus: bus ? `${bus.name} (${bus.distance.toFixed(2)}km)` : 'None'
    });

    // Create a list of valid hubs
    const hubs = [railway, metro, bus].filter(Boolean);
    
    // For intercity trips, prioritize railway stations
    if (tripType === 'intercity' && railway) {
      console.log(`Selected railway station for intercity trip: ${railway.name}`);
      return railway;
    }
    
    // For local trips, prioritize metro stations if available and close enough
    if (tripType === 'local' && metro && metro.distance < 5) {
      console.log(`Selected metro station for local trip: ${metro.name}`);
      return metro;
    }
    
    // Sort by distance and take the closest
    if (hubs.length > 0) {
      const sortedHubs = hubs.sort((a, b) => a.distance - b.distance);
      console.log(`Selected nearest hub: ${sortedHubs[0].name}`);
      return sortedHubs[0];
    }

    // No hubs found, return a fallback
    console.warn("No suitable transport hubs found");
    return {
      name: 'No suitable hub found',
      coordinates,
      distance: 0,
      error: 'No transport hubs found within a reasonable distance.',
    };
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
 * Determine city from coordinates using Mapbox reverse geocoding
 * @param {Object} coordinates - {lat, lng} object
 * @returns {Promise<Object>} - City information
 */
async function determineCityFromCoordinates(coordinates) {
  try {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates.lng},${coordinates.lat}.json`,
      {
        params: {
          access_token: process.env.GOOGLE_MAPS_API_KEY,
          types: 'place'
        },
      }
    );

    if (!response.data.features || !response.data.features.length) {
      return null;
    }

    // Extract city from features
    const cityFeature = response.data.features.find(feature => 
      feature.place_type.includes('place')
    );
    
    if (cityFeature) {
      return { city: cityFeature.text };
    }

    return null;
  } catch (error) {
    console.error('Reverse geocoding error:', error.message);
    return null;
  }
}

/**
 * Calculate haversine distance between two points
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
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
    Cycle: 0,
    'E-Rickshaw': 20,
    Auto: 50,
    Metro: 40,
    Cab: 100,
    Train: 150 + distanceKm * 0.5, // Base + per km charge
    Bus: 80 + distanceKm * 0.3, // Base + per km charge
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
    Cycle: 12,
    'E-Rickshaw': 15,
    Metro: 35,
    Auto: 25,
    Cab: 40,
    Train: 80,
    Bus: 30,
  };

  const speed = speeds[transportMode] || 30;
  const timeHours = distanceKm / speed;
  const timeMinutes = Math.max(5, Math.round(timeHours * 60));

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
 * Select transport for short distance trips (under 5 km)
 * @param {number} distanceKm - Distance in kilometers
 * @param {string} preference - User preference (eco, balanced, comfort)
 * @returns {string} Transport mode
 */
function selectShortDistanceTransport(distanceKm, preference) {
  if (distanceKm <= 1) {
    // Very short distance options
    if (preference === 'eco') return 'Walk';
    if (preference === 'balanced') return distanceKm <= 0.5 ? 'Walk' : 'E-Rickshaw';
    return 'Auto'; // comfort preference
  } else if (distanceKm <= 3) {
    // Short distance options
    if (preference === 'eco') return distanceKm <= 2 ? 'Walk' : 'Cycle';
    if (preference === 'balanced') return 'E-Rickshaw';
    return 'Auto'; // comfort preference
  } else if (distanceKm <= 5) {
    // Medium-short distance options
    if (preference === 'eco') return 'Cycle';
    if (preference === 'balanced') return 'Auto';
    return 'Cab'; // comfort preference
  }
  
  // For distances > 5km, use the existing transport selection logic
  return null;
}

/**
 * Extract city name from address string
 * @param {string} address - Full address string
 * @returns {string} City name
 */
function extractCityName(address) {
  // Simple extraction - assumes format like "Street, City, State" or "City"
  const parts = address.split(',').map(part => part.trim());
  
  // Try to find known cities in the address parts
  const knownCities = Object.keys(predefinedHubs);
  for (const part of parts) {
    for (const city of knownCities) {
      if (part.toLowerCase().includes(city.toLowerCase())) {
        return city;
      }
    }
  }
  
  // Fallback to the second part if available, otherwise the first part
  return parts.length > 1 ? parts[1] : parts[0];
}

/**
 * Core recursive trip planning function
 * Segments trip into optimal legs based on distance and location type.
 */
async function planSegmentedTrip(source, destination, preference) {
  try {
    console.log(`Planning trip from "${source}" to "${destination}" with preference: ${preference}`);
    
    // Get coordinates for source and destination
    const sourceCoords = await getCoordinates(source);
    const destCoords = await getCoordinates(destination);
    
    console.log(`Source coordinates: ${sourceCoords.lat}, ${sourceCoords.lng}`);
    console.log(`Destination coordinates: ${destCoords.lat}, ${destCoords.lng}`);

    // Get direct route to calculate total distance
    const directRoute = await getRoute(sourceCoords, destCoords);
    const distanceKm = directRoute && directRoute.distance && directRoute.distance.value 
      ? directRoute.distance.value / 1000 
      : calculateHaversineDistance(sourceCoords.lat, sourceCoords.lng, destCoords.lat, destCoords.lng);

    console.log(`Direct distance: ${distanceKm.toFixed(2)} km`);
    
    const segments = [];

    // Extract city names from addresses
    const sourceCity = extractCityName(source);
    const destCity = extractCityName(destination);
    
    console.log(`Source city: ${sourceCity}, Destination city: ${destCity}`);

    // Special case for short distances (under 5 km)
    if (distanceKm <= 5) {
      console.log("Planning short distance trip");
      const shortDistanceTransport = selectShortDistanceTransport(distanceKm, preference);
      
      segments.push({
        from: source,
        to: destination,
        mode: shortDistanceTransport,
        distance: directRoute.distance || { text: `${distanceKm.toFixed(1)} km` },
        duration: calculateDuration(distanceKm, shortDistanceTransport),
        cost: calculateCost(distanceKm, shortDistanceTransport),
        instructions: `Take ${shortDistanceTransport} from ${source} to ${destination}`,
        mapData: directRoute,
      });
    }
    // If different cities or long distance, plan an intercity trip
    else if (sourceCity !== destCity || distanceKm > 50) {
      console.log("Planning intercity trip");
      
      // Find nearest hubs for source and destination
      let sourceHub;
      if (predefinedHubs[sourceCity]) {
        sourceHub = { ...predefinedHubs[sourceCity] };
        sourceHub.distance = calculateHaversineDistance(
          sourceCoords.lat, sourceCoords.lng,
          sourceHub.coordinates.lat, sourceHub.coordinates.lng
        );
      } else {
        sourceHub = await findNearestHub(sourceCoords, 'intercity');
      }
      
      let destHub;
      if (predefinedHubs[destCity]) {
        destHub = { ...predefinedHubs[destCity] };
        destHub.distance = calculateHaversineDistance(
          destCoords.lat, destCoords.lng,
          destHub.coordinates.lat, destHub.coordinates.lng
        );
      } else {
        destHub = await findNearestHub(destCoords, 'intercity');
      }
      
      console.log(`Source hub: ${sourceHub.name}, distance: ${sourceHub.distance.toFixed(2)} km`);
      console.log(`Destination hub: ${destHub.name}, distance: ${destHub.distance.toFixed(2)} km`);

      // First leg: Source to source hub (if not already at the hub)
      if (sourceHub.distance > 0.5) {
        const firstLegDistance = sourceHub.distance;
        // Use short distance transport for first leg if applicable
        const firstLegTransport = firstLegDistance <= 5 
          ? selectShortDistanceTransport(firstLegDistance, preference)
          : selectTransport(firstLegDistance, preference);
        
        let firstLegRoute;
        try {
          firstLegRoute = await getRoute(sourceCoords, sourceHub.coordinates);
        } catch (error) {
          console.warn(`Couldn't get route for first leg: ${error.message}`);
          firstLegRoute = { distance: { text: `${firstLegDistance.toFixed(1)} km` } };
        }
        
        segments.push({
          from: source,
          to: sourceHub.name,
          mode: firstLegTransport,
          distance: firstLegRoute.distance || { text: `${firstLegDistance.toFixed(1)} km` },
          duration: calculateDuration(firstLegDistance, firstLegTransport),
          cost: calculateCost(firstLegDistance, firstLegTransport),
          instructions: `Take ${firstLegTransport} from ${source} to ${sourceHub.name}`,
          mapData: firstLegRoute,
        });
      }

      // Middle leg: Source hub to destination hub (if different hubs)
      if (sourceHub.name !== destHub.name && sourceHub.name !== 'No suitable hub found' && destHub.name !== 'No suitable hub found') {
        const hubToHubDistance = calculateHaversineDistance(
          sourceHub.coordinates.lat, sourceHub.coordinates.lng,
          destHub.coordinates.lat, destHub.coordinates.lng
        );
        
        // Determine appropriate transport for hub-to-hub leg
        let hubToHubTransport = 'Train';
        if (hubToHubDistance < 50) {
          hubToHubTransport = preference === 'comfort' ? 'Cab' : 'Bus';
        }
        
        let hubToHubRoute;
        try {
          hubToHubRoute = await getRoute(sourceHub.coordinates, destHub.coordinates);
        } catch (error) {
          console.warn(`Couldn't get route for hub-to-hub leg: ${error.message}`);
          hubToHubRoute = { distance: { text: `${hubToHubDistance.toFixed(1)} km` } };
        }
        
        segments.push({
          from: sourceHub.name,
          to: destHub.name,
          mode: hubToHubTransport,
          distance: hubToHubRoute.distance || { text: `${hubToHubDistance.toFixed(1)} km` },
          duration: calculateDuration(hubToHubDistance, hubToHubTransport),
          cost: calculateCost(hubToHubDistance, hubToHubTransport),
          instructions: `Take ${hubToHubTransport.toLowerCase()} from ${sourceHub.name} to ${destHub.name}`,
          mapData: hubToHubRoute,
        });
      }

      // Final leg: Destination hub to destination (if not already at the hub)
      if (destHub.distance > 0.5) {
        const finalLegDistance = destHub.distance;
        // Use short distance transport for final leg if applicable
        const finalLegTransport = finalLegDistance <= 5 
          ? selectShortDistanceTransport(finalLegDistance, preference)
          : selectTransport(finalLegDistance, preference);
        
        let finalLegRoute;
        try {
          finalLegRoute = await getRoute(destHub.coordinates, destCoords);
        } catch (error) {
          console.warn(`Couldn't get route for final leg: ${error.message}`);
          finalLegRoute = { distance: { text: `${finalLegDistance.toFixed(1)} km` } };
        }
        
        segments.push({
          from: destHub.name,
          to: destination,
          mode: finalLegTransport,
          distance: finalLegRoute.distance || { text: `${finalLegDistance.toFixed(1)} km` },
          duration: calculateDuration(finalLegDistance, finalLegTransport),
          cost: calculateCost(finalLegDistance, finalLegTransport),
          instructions: `Take ${finalLegTransport} from ${destHub.name} to ${destination}`,
          mapData: finalLegRoute,
        });
      }
    } 
    // If same city or medium distance, plan a local trip
    else {
      console.log("Planning local trip");
      const directTransport = selectTransport(distanceKm, preference);
      
      segments.push({
        from: source,
        to: destination,
        mode: directTransport,
        distance: directRoute.distance || { text: `${distanceKm.toFixed(1)} km` },
        duration: calculateDuration(distanceKm, directTransport),
        cost: calculateCost(distanceKm, directTransport),
        instructions: `Take ${directTransport} from ${source} to ${destination}`,
        mapData: directRoute,
      });
    }

    // If no segments were created (which shouldn't happen), add a default segment
    if (segments.length === 0) {
      const defaultTransport = distanceKm <= 5
        ? selectShortDistanceTransport(distanceKm, preference)
        : selectTransport(distanceKm, preference);
        
      segments.push({
        from: source,
        to: destination,
        mode: defaultTransport,
        distance: directRoute.distance || { text: `${distanceKm.toFixed(1)} km` },
        duration: calculateDuration(distanceKm, defaultTransport),
        cost: calculateCost(distanceKm, defaultTransport),
        instructions: `Take ${defaultTransport} from ${source} to ${destination}`,
        mapData: directRoute,
      });
    }

    console.log(`Generated ${segments.length} segments for the trip`);
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
    const { source, destination, preference = 'balanced' } = req.body;

    // Validate inputs
    if (!source || !destination) {
      return res.status(400).json({
        success: false,
        error: 'Both source and destination are required',
      });
    }

    console.log(`Planning trip from "${source}" to "${destination}" (Preference: ${preference})`);

    // Plan the trip with segmentation logic
    const segments = await planSegmentedTrip(source, destination, preference);

    // Calculate totals
    let totalDistanceValue = 0;
    let totalDurationSeconds = 0;
    let totalCost = 0;

    segments.forEach(segment => {
      // Handle distance
      if (segment.distance) {
        if (typeof segment.distance.value === 'number') {
          totalDistanceValue += segment.distance.value;
        } else {
          // If value is not available, try to extract from text
          const distanceText = segment.distance.text || '';
          const distanceMatch = distanceText.match(/(\d+(\.\d+)?)/);
          if (distanceMatch) {
            totalDistanceValue += parseFloat(distanceMatch[0]) * 1000; // Convert km to meters
          }
        }
      }

      // Handle duration
      if (segment.duration && typeof segment.duration.value === 'number') {
        totalDurationSeconds += segment.duration.value;
      }

      // Handle cost
      if (typeof segment.cost === 'number') {
        totalCost += segment.cost;
      }
    });

    // Convert total distance to kilometers for display
    const totalDistanceKm = totalDistanceValue / 1000;

    // Format duration text
    let totalDurationText;
    const totalDurationMins = Math.floor(totalDurationSeconds / 60);
    const hours = Math.floor(totalDurationMins / 60);
    const minutes = totalDurationMins % 60;

    if (hours === 0) {
      totalDurationText = `${minutes} mins`;
    } else if (minutes === 0) {
      totalDurationText = `${hours} hr`;
    } else {
      totalDurationText = `${hours} hr ${minutes} mins`;
    }

    // Return the complete trip plan
    res.json({
      success: true,
      start: source,
      end: destination,
      totalDistance: {
        value: totalDistanceValue,
        text: `${totalDistanceKm.toFixed(1)} km`,
      },
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
