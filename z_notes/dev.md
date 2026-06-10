-

```js
// timestamp in millisecond
Date.parse(new Date());

// date 1 week from time stamp
new Date(1780639226000 + 60 * 60 * 24 * 7 * 1000);
```

June 4, 2026

may 4, 2024 - July 4, 2024
may 4, 2025 - July 4, 2025
may 4, 2026 - June 4, 2026

may, june, july, 2024, 2025, 2026

30 days before, 30 days after June 4 for 2 years

june, 2025,

june, 2026
may,june,july 2026
june, 2025, 2026
june, july 2025, 2026
===

leaflet path

https://stackoverflow.com/questions/39578067/how-to-draw-and-route-path-in-leaflet-js-non-geographical-map

https://stackoverflow.com/questions/71890724/how-can-i-follow-a-user-mobile-phone-and-draw-a-path-on-a-map-using-leafletjs

https://stackoverflow.com/questions/48651799/how-do-i-simply-get-the-current-geolocation-using-leaflet-without-events

==

leaflet invalid longitude when scrolling

Coordinates not accurate when scrolling

https://github.com/Leaflet/Leaflet/issues/6772

You can use the WrapLatLng function to normalize values.

==

Prevent Leaflet panning indefinitely left or right

https://stackoverflow.com/questions/44209529/prevent-leaflet-panning-indefinitely-left-or-right

maxBounds: When this option is set, the map restricts the view to the given geographical bounds, bouncing the user back if the user tries to pan outside the view.

worldCopyJump: With this option enabled, the map tracks when you pan to another "copy" of the world and seamlessly jumps to the original one so that all overlays like markers and vector layers are still visible.

==
Wrapping lines/polygons across the antimeridian in Leaflet.js

https://stackoverflow.com/questions/40532496/wrapping-lines-polygons-across-the-antimeridian-in-leaflet-js

==

https://en.wikipedia.org/wiki/Geographic_coordinate_system

lat - 90 n to 90 s
long - 180 e, 0 , 180 w

```js
function renderDemoLayers(map: Map) {
  // ?nelat=34&nelng=-114&swlat=33&swlng=-115
  // nelat=0&nelng=20&swlat=-5&swlng=10
  // nelat=0&nelng=20&swlat=-5&swlng=10

  // -354.555124401 -366.316736996 1.197921372 -4.474123542

  function addmarker(point) {
    L.marker(point).bindPopup(`${point}`).addTo(map);
  }

  addmarker([0, 0]);
  addmarker([-90, 0]);
  addmarker([90, 0]);
  addmarker([0, 180]);
  addmarker([0, -180]);
  addmarker([90, -180]);
  addmarker([-90, 180]);

  // nelat=0&nelng=5&subview=map&swlat=-20&swlng=-5
  addmarker([0, -5]);
  addmarker([-20, 5]);

  var states = [
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [5.5, 0],
            [5.5, -20],
            [-5.5, -20],
            [-5.5, 0],
          ],
        ],
      },
    },
  ];

  return L.geoJSON(states, { color: "red" }).addTo(map);

  // -354.763069811 -363.7668646 2.615585951 -2.823088996
}
```
==
[Bug] Can't move or resize object across -180 or 180 longitude

https://github.com/JamesLMilner/terra-draw/issues/485
