const { globalSystemConfig } = require('../config/db');

// Haversine formula to compute exact physical distance in meters between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const phi1 = lat1 * Math.PI / 180;
  const phi2 = lat2 * Math.PI / 180;
  const deltaPhi = (lat2 - lat1) * Math.PI / 180;
  const deltaLambda = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

const verifyGeofence = (req, res, next) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Location verification parameters missing.' });
  }

  const distance = calculateDistance(
    latitude, 
    longitude, 
    globalSystemConfig.classroomCoords.lat, 
    globalSystemConfig.classroomCoords.lng
  );

  if (distance > globalSystemConfig.allowedRadiusMeters) {
    return res.status(403).json({ 
      message: `Geofence Violation. You are ${Math.round(distance)} meters away from the classroom context boundary.` 
    });
  }

  // If inside radius, append calculated distance to request body and pass control along
  req.calculatedDistance = `${Math.round(distance)}m radius lock`;
  next();
};

module.exports = { verifyGeofence };