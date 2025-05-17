const axios = require("axios");
const { findNearest } = require('./locationUtils'); // Helper for finding nearest points of interest

const GOOGLE_API_TIMEOUT = 10000;

// Uses Mapbox Geocoding API
const getCoordinates = async (address) => {
    try {
        const formattedAddress = address.endsWith("India") ? address : `${address}, India`;

        const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(formattedAddress)}.json`, {
            params: {
                access_token: process.env.GOOGLE_MAPS_API_KEY,
                country: "IN",
                limit: 1
            },
            timeout: GOOGLE_API_TIMEOUT
        });

        if (!response.data.features.length) {
            throw new Error(`Location not found: ${address}`);
        }

        const place = response.data.features[0];
        return {
            lat: place.center[1],
            lng: place.center[0],
            formattedAddress: place.place_name
        };
    } catch (error) {
        console.error(`Geocoding error for address: ${address}`, error.message);
        throw new Error(`Could not locate: ${address}`);
    }
};

// Enhanced to auto-switch travel mode based on distance (<=5km = walk/cycle/rickshaw)
const getRoute = async (origin, destination, preferredMode = 'driving') => {
    try {
        if (!origin || !destination) {
            throw new Error("Missing origin/destination coordinates");
        }

        const coords = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;

        // Get distance first (via simple directions API with driving to decide mode)
        const probeResp = await axios.get(`https://api.mapbox.com/directions/v5/mapbox/driving/${coords}`, {
            params: {
                access_token: process.env.GOOGLE_MAPS_API_KEY,
                overview: "simplified",
                steps: false
            },
            timeout: GOOGLE_API_TIMEOUT
        });

        if (!probeResp.data.routes.length) {
            throw new Error("Route probing failed");
        }

        const distance = probeResp.data.routes[0].distance; // in meters

        // Mode adjustment based on distance
        let mode = preferredMode;
        if (distance < 1000) mode = "walking";
        else if (distance < 3000) mode = "cycling";
        else if (distance < 5000) mode = "driving"; // Simulated as eRickshaw

        const { data } = await axios.get(`https://api.mapbox.com/directions/v5/mapbox/${mode}/${coords}`, {
            params: {
                access_token: process.env.GOOGLE_MAPS_API_KEY,
                steps: true,
                overview: "full",
                geometries: "polyline"
            },
            timeout: GOOGLE_API_TIMEOUT
        });

        const route = data.routes[0];
        const steps = route.legs[0].steps;

        return {
            distance: {
                text: `${(route.distance / 1000).toFixed(2)} km`,
                value: route.distance
            },
            duration: {
                text: `${Math.ceil(route.duration / 60)} mins`,
                value: route.duration
            },
            start: `${origin.lat},${origin.lng}`,
            end: `${destination.lat},${destination.lng}`,
            polyline: { points: route.geometry },
            bounds: null,
            steps: steps.map(step => ({
                travel_mode: mode,
                instructions: step.maneuver.instruction,
                distance: `${(step.distance).toFixed(0)} m`,
                duration: `${Math.ceil(step.duration)} sec`,
                polyline: null
            })),
            coordinates: getRouteCoordinates({ overview_polyline: { points: route.geometry } })
        };
    } catch (error) {
        console.error('Routing error:', error.message);
        throw new Error(`Could not calculate route: ${error.message}`);
    }
};

// Search with Mapbox Geocoding API + keyword filtering
const searchNearby = async (location, keyword, radius = 5000) => {
    try {
        const query = encodeURIComponent(keyword);
        const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json`, {
            params: {
                proximity: `${location.lng},${location.lat}`,
                access_token: process.env.GOOGLE_MAPS_API_KEY,
                types: 'poi',
                limit: 5
            },
            timeout: GOOGLE_API_TIMEOUT
        });

        if (!response.data.features.length) {
            throw new Error(`No results for ${keyword}`);
        }

        // Sort manually by distance
        const sorted = response.data.features.sort((a, b) => {
            const da = Math.hypot(a.center[0] - location.lng, a.center[1] - location.lat);
            const db = Math.hypot(b.center[0] - location.lng, b.center[1] - location.lat);
            return da - db;
        });

        const nearest = sorted[0];
        const coords = { lat: nearest.center[1], lng: nearest.center[0] };
        const route = await getRoute(location, coords);

        return {
            name: nearest.text,
            distance: route.distance.value / 1000,
            coordinates: coords,
            address: nearest.place_name
        };
    } catch (error) {
        console.error(`${keyword} search error:`, error.message);
        throw new Error(`Could not find nearest ${keyword}`);
    }
};

const findNearestRailway = async (location) => {
    return await searchNearby(location, "railway station", 10000);
};

const findNearestMetroStation = async (location) => {
    return await searchNearby(location, "metro station", 5000);
};

const findNearestBusTerminal = async (location) => {
    return await searchNearby(location, "bus terminal", 5000);
};

// Polyline decoding
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
//updated
