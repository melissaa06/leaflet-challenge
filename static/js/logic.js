
    // Create the tile layer that will be the background of our map.
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
  
    // Create the map object with options.
let map = L.map("map", {
  center: [30, -100],
  zoom: 4,
});
streetmap.addTo(map);

function createMarkers(data) {

  function getValue(x) {
      return x > 90 ? "#FF4419" :
          x > 70 ? "#FF8819" :
          x > 50 ? "#FFBF19" :
          x > 30 ? "#e0ff19" :
          x > 10 ? "#A4FF0F" :
              "#7cff0e";
  }

  function style(feature) {
      return {
          "color": "#000000",
          "stroke": true,
          radius: feature.properties.mag * 3,
          fillColor: getValue(feature.geometry.coordinates[2]),
          weight: 0.25,
          opacity: 1,
          fillOpacity: 0.9
      };
  }

  var dat = L.geoJson(data, {
      pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, style(feature));
      },

      onEachFeature: function (feature, layer) {
          layer.bindPopup("<strong>" + feature.properties.place + "</strong><br /><br />Magnitude: " +
              feature.properties.mag + "<br /><br />Depth: " + feature.geometry.coordinates[2]);
      }
  });
  dat.addTo(map);

  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
      let div = L.DomUtil.create("div", "info legend");
      let limits = [-10, 10, 30, 50, 70, 90];
      let colors = ['#7cff0e', '#A4FF0F', '#e0ff19', '#FFBF19', '#FF8819', '#FF4419'];

      for (let i = 0; i < limits.length; i++) {
          div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
              + limits[i] + (limits[i + 1] ? "&ndash;" + limits[i + 1] + "<br>" : "+");
      }
      return div;
  };
  legend.addTo(map);
}
  
  
  // Perform an API call to the earhquake data. Call createMarkers when it completes.
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);