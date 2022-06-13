import { Controller } from "@hotwired/stimulus"
import mapboxgl from "mapbox-gl"
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder"

export default class extends Controller {
  static values = {
    apiKey: String,
    markers: Array
  }

  connect() {
    mapboxgl.accessToken = this.apiKeyValue

    this.map = new mapboxgl.Map({
      container: this.element,
      style: "mapbox://styles/mapbox/outdoors-v11"
    })
    this.directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',
      profile: 'mapbox/driving',
      alternatives: false,
      geometries: 'geojson',
      controls: { instructions: false },
      flyTo: false
    });

    this.#addMarkersToMap()
    this.#fitMapToMarkers()
    this.#locateUser()
    this.#controlButtons()
    this.#navigateTo()
    this.#turf()
    this.#displayObtacles()
    // this.#directionsTo()

    // this.map.addControl(new MapboxGeocoder({ accessToken: mapboxgl.accessToken,
    //   mapboxgl: mapboxgl }))
  }
    #turf(){
      let clearances = {}
      let coordinates = []
      // console.log(this.markersValue)
      this.markersValue.forEach(marker => {
        coordinates= [marker.lng, marker.lat]
        // coordinates.toArray()
    // console.log(coordinates)
      this.clearances = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: coordinates
            },
            properties: {
              clearance: "13' 2"
            }
          },
        ]}
  });
  }

  #displayObtacles() {
    // console.log("clearances",this.clearances)
    const obstacle = turf.buffer(this.clearances, 0.25, { units: 'kilometers' });
    const bbox = [0, 0, 0, 0];
    const polygon = turf.bboxPolygon(bbox);
    // console.log(polygon)
    this.map.on('style.load', () => {
      this.map.addLayer({
        id: 'clearances',
        type: 'fill',
        source: {
          type: 'geojson',
          data: obstacle
        },
        layout: {},
        paint: {
          'fill-color': '#f03b20',
          'fill-opacity': 0.1,
          'fill-outline-color': '#f03b20'
        }
  })
});
// Source and layer for the route
this.map.addSource('theRoute', {
  type: 'geojson',
  data: {
    type: 'Feature'
  }
});

this.map.addLayer({
  id: 'theRoute',
  type: 'line',
  source: 'theRoute',
  layout: {
    'line-join': 'round',
    'line-cap': 'round'
  },
  paint: {
    'line-color': '#cccccc',
    'line-opacity': 0.5,
    'line-width': 13,
    'line-blur': 0.5
  }
});

    // Source and layer for the bounding box
    this.map.addSource('theBox', {
      type: 'geojson',
      data: {
        type: 'Feature'
      }
    });
    this.map.addLayer({
      id: 'theBox',
      type: 'fill',
      source: 'theBox',
      layout: {},
      paint: {
        'fill-color': '#FFC300',
        'fill-opacity': 0.5,
        'fill-outline-color': '#FFC300'
      }
    });
      let counter = 0;
      const maxAttempts = 50;
      let emoji = '';
      let collision = '';
      let detail = '';
      const reports = document.getElementById('reports');

      function addCard(id, element, clear, detail) {
      const card = document.createElement('div');
      card.className = 'card';
      // Add the response to the individual report created above
      const heading = document.createElement('div');
      // Set the class type based on clear value
      heading.className =
      clear === true
      ? 'card-header route-found'
      : 'card-header obstacle-found';
      heading.innerHTML =
      id === 0
      ? `${emoji} The route ${collision}`
      : `${emoji} Route ${id} ${collision}`;

      const details = document.createElement('div');
      details.className = 'card-details';
      details.innerHTML = `This ${detail} obstacles.`;

      card.appendChild(heading);
      card.appendChild(details);
      element.insertBefore(card, element.firstChild);
      }

      function noRoutes(element) {
      const card = document.createElement('div');
      card.className = 'card';
      // Add the response to the individual report created above
      const heading = document.createElement('div');
      heading.className = 'card-header no-route';
      emoji = '🛑';
      heading.innerHTML = `${emoji} Ending search.`;

      // Add details to the individual report
      const details = document.createElement('div');
      details.className = 'card-details';
      details.innerHTML = `No clear route found in ${counter} tries.`;

      card.appendChild(heading);
      card.appendChild(details);
      element.insertBefore(card, element.firstChild);
      }

      this.directions.on('clear', () => {
      this.map.setLayoutProperty('theRoute', 'visibility', 'none');
      this.map.setLayoutProperty('theBox', 'visibility', 'none');

      counter = 0;
      reports.innerHTML = '';
      });

      this.directions.on('route', (event) => {
      // Hide the route and box by setting the opacity to zero
      this.map.setLayoutProperty('theRoute', 'visibility', 'none');
      this.map.setLayoutProperty('theBox', 'visibility', 'none');

      if (counter >= maxAttempts) {
      noRoutes(reports);
      } else {
      // Make each route visible
      for (const route of event.route) {
      // Make each route visible
      this.map.setLayoutProperty('theRoute', 'visibility', 'visible');
      this.map.setLayoutProperty('theBox', 'visibility', 'visible');

      // Get GeoJSON LineString feature of route
      const routeLine = polyline.toGeoJSON(route.geometry);

      // Create a bounding box around this route
      // The app will find a random point in the new bbox
      bbox = turf.bbox(routeLine);
      polygon = turf.bboxPolygon(bbox);

      // Update the data for the route
      // This will update the route line on the map
      this.map.getSource('theRoute').setData(routeLine);

      // Update the box
      this.map.getSource('theBox').setData(polygon);

      const clear = turf.booleanDisjoint(obstacle, routeLine);

      if (clear === true) {
        collision = 'does not intersect any obstacles!';
        detail = `takes ${(route.duration / 60).toFixed(
        0
        )} minutes and avoids`;
        emoji = '✔️';
        this.map.setPaintProperty('theRoute', 'line-color', '#74c476');
        // Hide the box
        this.map.setLayoutProperty('theBox', 'visibility', 'none');
        // Reset the counter
        counter = 0;
      } else {
      // Collision occurred, so increment the counter
        counter = counter + 1;
        // As the attempts increase, expand the search area
        // by a factor of the attempt count
        polygon = turf.transformScale(polygon, counter * 0.01);
        bbox = turf.bbox(polygon);
        collision = 'is bad.';
        detail = `takes ${(route.duration / 60).toFixed(
        0
        )} minutes and hits`;
        emoji = '⚠️';
        this.map.setPaintProperty('theRoute', 'line-color', '#de2d26');

        // Add a randomly selected waypoint to get a new route from the Directions API
        const randomWaypoint = turf.randomPoint(1, { bbox: bbox });
        this.directions.setWaypoint(
        0,
        randomWaypoint['features'][0].geometry.coordinates
        );
      }
      // Add a new report section to the sidebar
        addCard(counter, reports, clear, detail);
    }
    }
  });
  }



  #controlButtons() {
    // Add zoom and rotation controls to the map.
    this.map.addControl(new mapboxgl.NavigationControl());
  }

  // #directionsTo(){
  //   this.map.addControl(this.directions, 'top-right');
  //   this.map.scrollZoom.enable();
  // }

  #navigateTo() {
    this.map.addControl(
      new MapboxDirections({
      accessToken: mapboxgl.accessToken,

      }),
      'top-left'
      );
  }

  #locateUser() {
    // Add geolocate control to the map.
    this.map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true
      })
    );
  }

  #addMarkersToMap() {
    this.markersValue.forEach((marker) => {
      const popup = new mapboxgl.Popup().setHTML(marker.info_window)

      // Create a HTML element for your custom marker
      const customMarker = document.createElement("div")
      customMarker.className = "marker"
      customMarker.style.backgroundImage = `url('${marker.image_url}')`
      customMarker.style.backgroundSize = "contain"
      customMarker.style.width = "45px"
      customMarker.style.height = "45px"

      // Pass the element as an argument to the new marker
      new mapboxgl.Marker(customMarker)
        .setLngLat([marker.lng, marker.lat])
        .setPopup(popup)
        .addTo(this.map)
    })
  }
  #fitMapToMarkers() {
    const bounds = new mapboxgl.LngLatBounds()
    this.markersValue.forEach(marker => bounds.extend([ marker.lng, marker.lat ]))
    this.map.fitBounds(bounds, { padding: 70, maxZoom: 15, duration: 0 })
  }
}
