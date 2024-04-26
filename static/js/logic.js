
    // Create the tile layer that will be the background of our map.
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
  
    // Create the map object with options.
let map = L.map("map", {
  center: [40, -98],
  zoom: 5,
});
streetmap.addTo(map);

function createMarkers(data) {

  function getValue(x) {
      return x > 90 ? "#47F79F" :
          x > 70 ? "#F79F47" :
          x > 50 ? "#F7F747" :
          x > 30 ? "#9FF747" :
          x > 10 ? "#47F747" :
              "#47F79F";
  }

  function style(feature) {
      return {
          "color": "#000000",
          "stroke": true,
          radius: feature.properties.mag * 4,
          fillColor: getValue(feature.geometry.coordinates[2]),
          weight: 0.25,
          opacity: 1,
          fillOpacity: 0.8
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
      let colors = ['#47F79F', '#47F747', '#9FF747', '#F7F747', '#F79F47', '#47F79F'];

      for (let i = 0; i < limits.length; i++) {
          div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
              + limits[i] + (limits[i + 1] ? "&ndash;" + limits[i + 1] + "<br>" : "+");
      }
      return div;
  };
  legend.addTo(map);
}
  
  
  // Perform an API call to the Citi Bike API to get the station information. Call createMarkers when it completes.
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);