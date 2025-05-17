const findNearestRailway = async (location) => {
    try {
        const { lat, lng } = location;

        // Search for nearby railway stations using Mapbox keyword search
        const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/railway station.json`, {
            params: {
                proximity: `${lng},${lat}`,
                access_token: process.env.GOOGLE_MAPS_API_KEY,
                types: 'poi',
                limit: 5,
                country: 'IN'
            },
            timeout: 10000
        });

        if (!response.data.features.length) return null;

        // Sort results manually by Euclidean distance
        const sorted = response.data.features.sort((a, b) => {
            const distA = Math.hypot(a.center[0] - lng, a.center[1] - lat);
            const distB = Math.hypot(b.center[0] - lng, b.center[1] - lat);
            return distA - distB;
        });

        const station = sorted[0];
        const stationLocation = { lat: station.center[1], lng: station.center[0] };

        const route = await getRoute(location, stationLocation);

        return {
            name: station.text,
            distance: route.distance.value / 1000, // in km
            coordinates: stationLocation,
            address: station.place_name
        };
    } catch (error) {
        console.error('Railway station search error:', error.message);
        return null;
    }
};
