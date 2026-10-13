const express = require('express');
const router = express.Router();

/**
 * Helper to call Google Routes API v2
 */
async function callComputeRoutes({ origin, destination, travelMode = 'WALK' }) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_MAPS_API_KEY is not configured on the backend');
  }

  // Format origin and destination
  let originObj = {};
  if (typeof origin === 'string') {
    originObj = { address: origin };
  } else if (origin.lat && origin.lng) {
    originObj = { location: { latLng: { latitude: origin.lat, longitude: origin.lng } } };
  }

  let destObj = {};
  if (typeof destination === 'string') {
    destObj = { address: destination };
  } else if (destination.lat && destination.lng) {
    destObj = { location: { latLng: { latitude: destination.lat, longitude: destination.lng } } };
  }

  const mode = travelMode.toUpperCase() === 'DRIVE' || travelMode.toUpperCase() === 'DRIVING' ? 'DRIVE' : 'WALK';

  const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.legs.steps,routes.description,routes.warnings',
    },
    body: JSON.stringify({
      origin: originObj,
      destination: destObj,
      travelMode: mode,
      languageCode: 'en-US',
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    const errorMsg = data?.error?.message || response.statusText;
    throw new Error(`Google Routes API error: ${errorMsg}`);
  }

  if (!data.routes || data.routes.length === 0) {
    throw new Error('No route found between these locations');
  }

  const route = data.routes[0];
  const leg = route.legs?.[0] || {};

  return {
    distanceMeters: route.distanceMeters,
    durationSeconds: parseInt(route.duration) || 0,
    encodedPolyline: route.polyline?.encodedPolyline || '',
    description: route.description || '',
    steps: (leg.steps || []).map(s => ({
      instructions: s.navigationInstruction?.instructions || 'Continue',
      distance: s.localizedValues?.distance || { text: `${s.distanceMeters} m` },
      duration: s.localizedValues?.staticDuration || { text: s.staticDuration },
      startLocation: s.startLocation?.latLng,
      endLocation: s.endLocation?.latLng,
    })),
  };
}

// POST /api/routes/calculate
router.post('/calculate', async (req, res) => {
  try {
    const { origin, destination, travelMode } = req.body;
    if (!origin || !destination) {
      return res.status(400).json({ success: false, message: 'origin and destination are required' });
    }

    const routeData = await callComputeRoutes({ origin, destination, travelMode });
    res.json({
      success: true,
      data: routeData,
    });
  } catch (err) {
    console.error('Route calculation error:', err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// GET /api/routes/test - Test route between Chennai and Coimbatore
router.get('/test', async (req, res) => {
  try {
    const origin = req.query.origin || 'Chennai, Tamil Nadu, India';
    const destination = req.query.destination || 'Coimbatore, Tamil Nadu, India';
    const mode = req.query.mode || 'DRIVE';

    const routeData = await callComputeRoutes({ origin, destination, travelMode: mode });
    res.json({
      success: true,
      message: `Successfully calculated route from ${origin} to ${destination}`,
      data: routeData,
    });
  } catch (err) {
    console.error('Route test error:', err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
