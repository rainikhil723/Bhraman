/**
 * Selects the optimal transport mode based on distance and user preference
 * @param {number} distanceKm - Distance in kilometers
 * @param {string} preference - User preference: "time", "cost", or "comfort"
 * @returns {string} Selected transport mode
 */
function selectTransport(distanceKm, preference = 'time') {
    // Base transport selection logic by distance
    let transport;
    
    if (distanceKm < 1) {
        transport = 'Walk';
    } else if (distanceKm < 4) {
        transport = 'E-Rickshaw';
    } else if (distanceKm < 15) {
        transport = 'Metro';
    } else if (distanceKm < 30) {
        transport = 'Auto';
    } else {
        transport = 'Cab';
    }
    
    // Adjust based on user preference
    if (preference === 'cost') {
        // Cheaper options
        if (distanceKm >= 4 && distanceKm < 15) {
            transport = 'E-Rickshaw'; // Cheaper than Metro
        } else if (distanceKm >= 15 && distanceKm < 30) {
            transport = 'Metro'; // Cheaper than Auto/Cab
        }
    } else if (preference === 'comfort') {
        // More comfortable options
        if (distanceKm >= 4 && distanceKm < 15) {
            transport = 'Auto'; // More comfortable than Metro
        } else if (distanceKm >= 1 && distanceKm < 4) {
            transport = 'Auto'; // More comfortable than E-Rickshaw
        }
    } else if (preference === 'time') {
        // Faster options
        if (distanceKm >= 15 && distanceKm < 30) {
            transport = 'Cab'; // Faster than Auto
        }
    }
    
    return transport;
}

module.exports = {
    selectTransport
};