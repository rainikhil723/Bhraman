const axios = require("axios");
const { findNearest } = require('./locationUtils'); // Helper for finding nearest points of interest

const GOOGLE_API_TIMEOUT = 10000; // 10 seconds timeout

const getCoordinates = async (address) => {
    try {
        // Format address for Indian context
        const formattedAddress = address.endsWith("India") ? address : `${address}, India`;

        const response = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
            params: {
                address: formattedAddress,
                key: process.env.GOOGLE_MAPS_API_KEY,
                region: "in",
                components: "country:IN"
            },
            timeout: GOOGLE_API_TIMEOUT
        });

        if (!response.data.results.length) {
            throw new Error(`Location not found: ${address}`);
        }

        return {
            lat: response.data.results[0].geometry.location.lat,
            lng: response.data.results[0].geometry.location.lng,
            formattedAddress: response.data.results[0].formatted_address
        };
    } catch (error) {
        console.error(`Geocoding error for address: ${address}`, error.message);
        throw new Error(`Could not locate: ${address}`);
    }
};

const getRoute = async (origin, destination, mode = 'driving') => {
    try {
        if (!origin || !destination) {
            throw new Error("Missing origin/destination coordinates");
        }

        const { data } = await axios.get("https://maps.googleapis.com/maps/api/directions/json", {
            params: {
                origin: `${origin.lat},${origin.lng}`,
                destination: `${destination.lat},${destination.lng}`,
                key: process.env.GOOGLE_MAPS_API_KEY,
                region: "in",
                mode: mode,
                alternatives: false
            },
            timeout: GOOGLE_API_TIMEOUT
        });

        if (data.status !== 'OK' || !data.routes.length) {
            throw new Error("No routes found between locations");
        }

        const route = data.routes[0];
        const leg = route.legs[0];

        return {
            distance: {
                text: leg.distance.text,
                value: leg.distance.value
            },
            duration: {
                text: leg.duration.text,
                value: leg.duration.value
            },
            start: leg.start_address,
            end: leg.end_address,
            polyline: route.overview_polyline,
            bounds: route.bounds,
            steps: leg.steps.map(step => ({
                travel_mode: step.travel_mode,
                instructions: step.html_instructions.replace(/<[^>]*>/g, ''),
                distance: step.distance.text,
                duration: step.duration.text,
                polyline: step.polyline
            })),
            coordinates: getRouteCoordinates(route)
        };
    } catch (error) {
        console.error('Routing error:', error.message);
        throw new Error(`Could not calculate route: ${error.message}`);
    }
};

const findNearestRailway = async (location) => {
    try {
        const { lat, lng } = location;
        
        // Search for railway stations within 10km radius
        const response = await axios.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json", {
            params: {
                location: `${lat},${lng}`,
                radius: 10000, // 10km radius
                type: "train_station",
                key: process.env.GOOGLE_MAPS_API_KEY,
                rankby: "distance"
            },
            timeout: GOOGLE_API_TIMEOUT
        });

        if (!response.data.results.length) {
            throw new Error("No railway stations found nearby");
        }

        const nearestStation = response.data.results[0];
        const stationLocation = {
            lat: nearestStation.geometry.location.lat,
            lng: nearestStation.geometry.location.lng
        };
        
        // Get distance from origin to station
        const route = await getRoute(location, stationLocation);
        
        return {
            name: nearestStation.name,
            distance: route.distance.value / 1000, // in km
            coordinates: stationLocation,
            address: nearestStation.vicinity
        };
    } catch (error) {
        console.error('Railway station search error:', error.message);
        throw new Error("Could not find nearest railway station");
    }
};

const findNearestMetroStation = async (location) => {
    try {
        const { lat, lng } = location;
        
        // Search for metro stations within 5km radius
        const response = await axios.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json", {
            params: {
                location: `${lat},${lng}`,
                radius: 5000, // 5km radius
                keyword: "metro station",
                key: process.env.GOOGLE_MAPS_API_KEY,
                rankby: "distance"
            },
            timeout: GOOGLE_API_TIMEOUT
        });

        if (!response.data.results.length) {
            throw new Error("No metro stations found nearby");
        }

        const nearestStation = response.data.results[0];
        const stationLocation = {
            lat: nearestStation.geometry.location.lat,
            lng: nearestStation.geometry.location.lng
        };
        
        // Get distance from origin to station
        const route = await getRoute(location, stationLocation);
        
        return {
            name: nearestStation.name,
            distance: route.distance.value / 1000, // in km
            coordinates: stationLocation,
            address: nearestStation.vicinity
        };
    } catch (error) {
        console.error('Metro station search error:', error.message);
        throw new Error("Could not find nearest metro station");
    }
};

const findNearestBusTerminal = async (location) => {
    try {
        const { lat, lng } = location;
        
        // Search for bus stations within 5km radius
        const response = await axios.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json", {
            params: {
                location: `${lat},${lng}`,
                radius: 5000, // 5km radius
                type: "bus_station",
                key: process.env.GOOGLE_MAPS_API_KEY,
                rankby: "distance"
            },
            timeout: GOOGLE_API_TIMEOUT
        });

        if (!response.data.results.length) {
            throw new Error("No bus terminals found nearby");
        }

        const nearestTerminal = response.data.results[0];
        const terminalLocation = {
            lat: nearestTerminal.geometry.location.lat,
            lng: nearestTerminal.geometry.location.lng
        };
        
        // Get distance from origin to terminal
        const route = await getRoute(location, terminalLocation);
        
        return {
            name: nearestTerminal.name,
            distance: route.distance.value / 1000, // in km
            coordinates: terminalLocation,
            address: nearestTerminal.vicinity
        };
    } catch (error) {
        console.error('Bus terminal search error:', error.message);
        throw new Error("Could not find nearest bus terminal");
    }
};

// Helper function to decode polyline into coordinates
const getRouteCoordinates = (route) => {
    const decoded = require('@mapbox/polyline').decode(route.overview_polyline.points);
    return decoded.map(([lat, lng]) => ({ lat, lng }));
};

module.exports = {
    getCoordinates,
    getRoute,
    findNearestRailway,
    findNearestMetroStation,
    findNearestBusTerminal,
    getRouteCoordinates
};