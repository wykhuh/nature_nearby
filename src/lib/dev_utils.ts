import type { Map } from "leaflet";
import L from "leaflet";

import type { CoordinatesType, LngLatType } from "../types/app";

export function createGeojsonDemo(coors: LngLatType[], map: Map) {
  let geojson: any = [
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [coors],
      },
    },
  ];

  let options: any = {
    color: "green",
    fillColor: undefined,
    fillOpacity: 0,
    weight: 1,
    style: { interactive: false },
  };
  L.geoJSON(geojson, options).addTo(map);
}

function addmarkerDemo(point: CoordinatesType, map: Map) {
  L.marker(point).bindPopup(`${point}`).addTo(map);
}

export function renderDemoLayers(map: Map) {
  addmarkerDemo([0, 0], map);
  // addmarkerDemo([-90, 0], map);
  // addmarkerDemo([90, 0], map);
  // addmarkerDemo([0, 180], map);
  // addmarkerDemo([0, -180], map);
  // addmarkerDemo([90, -180], map);
  // addmarkerDemo([-90, 180], map);

  // nelat=0&nelng=5&subview=map&swlat=-20&swlng=-5
  // addmarkerDemo([0, -5], map);
  // addmarkerDemo([-20, 5], map);

  let coors1: LngLatType[] = [
    [-190, 5],
    [-190, 0],
    [-180, 0],
    [-180, 5],
    [-190, 5],
  ];
  createGeojsonDemo(coors1, map);

  let coors2: LngLatType[] = [
    [-180, 5],
    [-180, 0],
    [-170, 0],
    [-170, 5],
    [-180, 5],
  ];
  createGeojsonDemo(coors2, map);

  let coors3: LngLatType[] = [
    [170, 5],
    [170, 0],
    [190, 0],
    [190, 5],
    [170, 5],
  ];
  createGeojsonDemo(coors3, map);
}
