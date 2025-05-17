/**
 * Selects the optimal transport mode based on distance and user preference
 * @param {number} distanceKm - Distance in kilometers
 * @param {string} preference - User preference: "time", "cost", or "comfort"
 * @returns {string} Selected transport mode
 */
/**
 * Selects the optimal transport mode based on distance and user preference
 * @param {number} distanceKm - Distance in kilometers
 * @param {string} preference - User preference: "time", "cost", or "comfort"
 * @returns {string} Selected transport mode
 */
function selectTransport(distanceKm, preference = 'time') {
    if (distanceKm < 1) return 'Walk';
    if (distanceKm < 4) return preference === 'comfort' ? 'Auto' : 'E-Rickshaw';
    if (distanceKm < 15) {
      if (preference === 'cost') return 'E-Rickshaw';
      if (preference === 'comfort') return 'Auto';
      return 'Metro';
    }
    if (distanceKm < 30) {
      if (preference === 'cost') return 'Metro';
      return 'Cab';
    }
    return 'Train';
  }

module.exports = {
    selectTransport
};
//old
