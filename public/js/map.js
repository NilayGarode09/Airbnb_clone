mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: coordinates,
  zoom: 10
});

// Add red destination marker
new mapboxgl.Marker({ color: 'red' })
  .setLngLat(coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 10 })
      .setHTML("<p>Exact location will be provided after login</p>")
  )
  .addTo(map);

// Get user location
navigator.geolocation.getCurrentPosition(
  position => {
    const userCoords = [position.coords.longitude, position.coords.latitude];

    // Add blue user marker
    new mapboxgl.Marker({ color: 'blue' })
      .setLngLat(userCoords)
      .addTo(map);

    // Fit map to show both
    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend(userCoords).extend(coordinates);
    map.fitBounds(bounds, { padding: 60 });

    // Try drawing driving route
    drawRoute(userCoords, coordinates);
  },
  () => {
    alert("Could not get your location.");
  }
);

// Draw route function with fallback
async function drawRoute(start, end) {
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      console.warn("No driving route found. Drawing direct line instead.");
      drawStraightLine(start, end);
      return;
    }

    const route = data.routes[0].geometry;

    map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: route
      }
    });

    map.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#1DB954',
        'line-width': 5
      }
    });
  } catch (error) {
    console.error("Driving route error:", error);
    drawStraightLine(start, end);
  }
}

// Draw straight (air/water) line
function drawStraightLine(start, end) {
  const line = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [start, end]
    }
  };

  map.addSource('direct-line', {
    type: 'geojson',
    data: line
  });

  map.addLayer({
    id: 'direct-line',
    type: 'line',
    source: 'direct-line',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#0078FF', // blue line
      'line-width': 4,
      'line-dasharray': [2, 4] // dashed line for air/water feel
    }
  });
}
