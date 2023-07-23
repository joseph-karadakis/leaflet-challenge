var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Fetch the GeoJSON data
fetch(url)
  .then((response) => response.json())
  .then((data) => {
    // Create a function to determine the marker size based on the earthquake magnitude
    function getMarkerSize(magnitude) {
      return magnitude * 5;
    }

    // Create a function to determine the marker color based on the earthquake depth
    function getMarkerColor(depth) {
      if (depth < 10) return 'green';
      else if (depth < 30) return 'yellow';
      else if (depth < 50) return 'orange';
      else if (depth < 70) return 'red';
      else if (depth < 90) return 'purple';
      else return 'black';
    }

    // Initialize the map
    var map = L.map('map').setView([0, 0], 2);

    // Add the OpenStreetMap tiles as the base layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // Loop through the data and create markers for each earthquake
    data.features.forEach((quake) => {
      var lat = quake.geometry.coordinates[1];
      var lon = quake.geometry.coordinates[0];
      var mag = quake.properties.mag;
      var depth = quake.geometry.coordinates[2];
      var markerSize = getMarkerSize(mag);
      var markerColor = getMarkerColor(depth);

      L.circleMarker([lat, lon], {
        radius: markerSize,
        fillColor: markerColor,
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      })
        .addTo(map)
        .bindPopup(
          `<b>Magnitude: ${mag}</b><br><b>Depth: ${depth} km</b><br><b>Location: ${quake.properties.place}</b>`
        );
    });

    // Create a legend
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend');
      var grades = [-10, 10, 30, 50, 70, 90];
      var labels = [];

      div.innerHTML = '<h4>Depth (km)</h4>';
      // Loop through the depth intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
          '<i style="background:' +
          getMarkerColor(grades[i] + 1) +
          '"></i> ' +
          grades[i] +
          (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }

      return div;
    };
    legend.addTo(map);
  });
