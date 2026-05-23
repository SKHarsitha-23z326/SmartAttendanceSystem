const { globalSystemConfig } = require('../config/db');

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const phi1 = lat1 * Math.PI / 180;
  const phi2 = lat2 * Math.PI / 180;
  const deltaPhi = (lat2 - lat1) * Math.PI / 180;
  const deltaLambda = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(deltaPhi / 2) ** 2 +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const verifyGeofence = (req, res, next) => {
  const lat = parseFloat(req.body.latitude);
  const lng = parseFloat(req.body.longitude);

  if (isNaN(lat) || isNaN(lng)) {
    return res.status(400).json({ message: 'Location coordinates missing or invalid.' });
  }

  if (!globalSystemConfig.isSessionActive) {
    return res.status(400).json({ message: 'Attendance window has closed for this session.' });
  }

  const distance = calculateDistance(
    lat, lng,
    globalSystemConfig.classroomCoords.lat,
    globalSystemConfig.classroomCoords.lng
  );

  if (distance > globalSystemConfig.allowedRadiusMeters) {
    return res.status(403).json({
      message: `Geofence violation. You are ${Math.round(distance)}m from the classroom.`
    });
  }

  req.calculatedDistance = `${Math.round(distance)}m`;
  next();
};

module.exports = { verifyGeofence };