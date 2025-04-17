const findNearestRailway = async (location) => {
    try {
        const { lat, lng } = location;
        const response = await axios.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json", {
            params: {
                location: `${lat},${lng}`,
                radius: 10000,
                type: "train_station",
                key: process.env.GOOGLE_MAPS_API_KEY,
                rankby: "distance"
            },
            timeout: 10000
        });

        if (!response.data.results.length) return null;
        
        const station = response.data.results[0];
        const route = await getRoute(location, station.geometry.location);
        
        return {
            name: station.name,
            distance: route.distance.value / 1000,
            coordinates: station.geometry.location,
            address: station.vicinity
        };
    } catch (error) {
        console.error('Railway station search error:', error);
        return null;
    }
};