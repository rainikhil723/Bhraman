const axios = require('axios');
const { getCoordinates, getRoute, findNearestRailway } = require('../utils/googleApi');
const { selectTransport } = require('../utils/transportLogic');

// Helper function to find nearest transport hubs
async function findNearestHub(coordinates) {
  try {
    // First try to find railway station (for intercity travel)
    const railwayStation = await findNearestRailway(coordinates);
    return railwayStation;
  } catch (error) {
    console.error("Hub finding error:", error.message);
    // Return original location if no hub found
    return {
      name: "No suitable hub found",
      coordinates: coordinates,
      distance: 0
    };
  }
}

// Calculate cost based on transport mode and distance
function calculateCost(distanceKm, transportMode) {
  // Base costs as per requirements
  const baseCosts = {
    'Walk': 0,
    'E-Rickshaw': 20,
    'Auto': 50,
    'Metro': 40,
    'Cab': 200,
    'Train': 200 + (distanceKm * 0.5) // Base + per km charge
  };
  
  return baseCosts[transportMode] || 50; // Default cost if mode not found
}

// Calculate duration based on transport mode and distance
function calculateDuration(distanceKm, transportMode) {
  // Average speeds in km/h
  const speeds = {
    'Walk': 5,
    'E-Rickshaw': 15,
    'Metro': 35,
    'Auto': 25,
    'Cab': 40,
    'Train': 80
  };
  
  const speed = speeds[transportMode] || 30;
  const timeHours = distanceKm / speed;
  const timeMinutes = Math.round(timeHours * 60);
  
  return {
    text: timeMinutes > 60 ? 
      `${Math.floor(timeMinutes/60)} hr ${timeMinutes%60} mins` : 
      `${timeMinutes} mins`,
    value: timeMinutes * 60 // seconds
  };
}

// Core recursive trip planning function
async function planSegmentedTrip(source, destination, preference) {
  try {
    // 1. Get coordinates for source and destination
    const sourceCoords = await getCoordinates(source);
    const destCoords = await getCoordinates(destination);
    
    // 2. Get direct route details to determine total distance
    const directRoute = await getRoute(sourceCoords, destCoords);
    const distanceKm = directRoute.distance.value / 1000; // Convert to km
    
    // 3. Decide if trip needs segmentation (intercity vs local)
    const segments = [];
    
    if (distanceKm > 50) {
      // INTERCITY TRIP: Create three segments (source → hub → hub → destination)
      
      // Find nearest hub to source
      const sourceHub = await findNearestHub(sourceCoords);
      
      // Find nearest hub to destination
      const destHub = await findNearestHub(destCoords);
      
      // First leg: Source to source hub
      if (sourceHub.distance > 0) {
        const firstLegDistance = sourceHub.distance;
        const firstLegTransport = selectTransport(firstLegDistance, preference);
        
        const firstLegRoute = await getRoute(sourceCoords, sourceHub.coordinates);
        
        segments.push({
          from: source,
          to: sourceHub.name,
          mode: firstLegTransport,
          distance: {
            text: `${firstLegDistance.toFixed(1)} km`,
            value: firstLegDistance * 1000
          },
          duration: calculateDuration(firstLegDistance, firstLegTransport),
          cost: calculateCost(firstLegDistance, firstLegTransport),
          instructions: `Take ${firstLegTransport} from ${source} to ${sourceHub.name}`,
          mapData: firstLegRoute
        });
      }
      
      // Middle leg: Hub to hub (train/flight)
      const middleLegDistance = distanceKm - (sourceHub.distance + destHub.distance);
      const middleLegTransport = 'Train'; // For intercity, default to train
      
      const middleLegRoute = await getRoute(sourceHub.coordinates, destHub.coordinates);
      
      segments.push({
        from: sourceHub.name,
        to: destHub.name,
        mode: middleLegTransport,
        distance: {
          text: `${middleLegDistance.toFixed(1)} km`,
          value: middleLegDistance * 1000
        },
        duration: calculateDuration(middleLegDistance, middleLegTransport),
        cost: calculateCost(middleLegDistance, middleLegTransport),
        instructions: `Take ${middleLegTransport} from ${sourceHub.name} to ${destHub.name}`,
        mapData: middleLegRoute
      });
      
      // Final leg: Destination hub to destination
      if (destHub.distance > 0) {
        const finalLegDistance = destHub.distance;
        const finalLegTransport = selectTransport(finalLegDistance, preference);
        
        const finalLegRoute = await getRoute(destHub.coordinates, destCoords);
        
        segments.push({
          from: destHub.name,
          to: destination,
          mode: finalLegTransport,
          distance: {
            text: `${finalLegDistance.toFixed(1)} km`,
            value: finalLegDistance * 1000
          },
          duration: calculateDuration(finalLegDistance, finalLegTransport),
          cost: calculateCost(finalLegDistance, finalLegTransport),
          instructions: `Take ${finalLegTransport} from ${destHub.name} to ${destination}`,
          mapData: finalLegRoute
        });
      }
    } else {
      // LOCAL TRIP: Create one direct segment
      const transport = selectTransport(distanceKm, preference);
      
      segments.push({
        from: source,
        to: destination,
        mode: transport,
        distance: directRoute.distance,
        duration: calculateDuration(distanceKm, transport),
        cost: calculateCost(distanceKm, transport),
        instructions: `Take ${transport} from ${source} to ${destination}`,
        mapData: directRoute
      });
    }
    
    return segments;
  } catch (error) {
    console.error("Trip planning error:", error);
    throw new Error(`Failed to plan trip: ${error.message}`);
  }
}

// Main controller function
exports.planTrip = async (req, res) => {
  try {
    const { source, destination, preference = "time" } = req.body;
    
    // Validate inputs
    if (!source || !destination) {
      return res.status(400).json({
        success: false,
        error: "Both source and destination are required"
      });
    }
    
    console.log(`Planning trip from ${source} to ${destination} (Preference: ${preference})`);
    
    // Plan the trip with segmentation logic
    const segments = await planSegmentedTrip(source, destination, preference);
    
    // Calculate totals
    const totalDistance = {
      value: segments.reduce((sum, segment) => sum + segment.distance.value, 0),
      text: `${(segments.reduce((sum, segment) => sum + segment.distance.value, 0) / 1000).toFixed(1)} km`
    };
    
    const totalDurationSeconds = segments.reduce((sum, segment) => sum + segment.duration.value, 0);
    const totalDurationMins = Math.floor(totalDurationSeconds / 60);
    const totalDurationText = totalDurationMins > 60 ? 
      `${Math.floor(totalDurationMins/60)} hr ${totalDurationMins%60} mins` : 
      `${totalDurationMins} mins`;
    
    const totalCost = segments.reduce((sum, segment) => sum + segment.cost, 0);
    
    // Return the complete trip plan
    res.json({
      success: true,
      start: source,
      end: destination,
      totalDistance: totalDistance,
      totalDuration: {
        text: totalDurationText,
        value: totalDurationSeconds
      },
      totalCost: `₹${totalCost}`,
      preference,
      segments
    });
    
  } catch (error) {
    console.error("Trip planning error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to plan route",
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};