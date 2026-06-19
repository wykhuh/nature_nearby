// @vitest-environment jsdom

import jsdom from "jsdom";
import { expect, test, describe, beforeEach } from "vitest";
import {
  addiNatBBoxToMap,
  convertiNatBBoxToLatLng,
  convertiNatBBoxToLngLat,
  convertLnLatToiNatBBox,
  crossesAntimerdian,
  normalizeTerraDrawLngLat,
} from "../lib/map_utils";
import { defaultParams, setupMapAndStore } from "./fixtures/test_helpers";
import { leafletMapLayers } from "../lib/data_utils";
import type { LngLatType } from "../types/app";
import { drawBBoxHandler } from "../lib/search_bounding_box";
import { allTaxaRecord } from "../data/inat_data";

beforeEach(() => {
  const { JSDOM } = jsdom;

  let dom = new JSDOM(
    `<!doctype html>
<html lang="en">
  <body>
    <div id="map" style="width: 400px; height: 400px"></div>
   </body>
</html>`,
  );
  // @ts-ignore
  global.document = dom.window.document;
});

//    ||[___]||
// different coordinates within -180/180
let lonLatValid: LngLatType[][][] = [
  [
    [
      [-180, 5],
      [-180, -5],
      [-170, -5],
      [-170, 5],
      [-180, 5],
    ],
  ],
  [
    [
      [-95, -5],
      [-85, -5],
      [-85, 5],
      [-95, 5],
      [-95, -5],
    ],
  ],
  [
    [
      [-5, 5],
      [-5, -5],
      [5, -5],
      [5, 5],
      [-5, 5],
    ],
  ],
  [
    [
      [85, 5],
      [85, -5],
      [95, -5],
      [95, 5],
      [85, 5],
    ],
  ],
  [
    [
      [175, 5],
      [175, -5],
      [180, -5],
      [180, 5],
      [175, 5],
    ],
  ],
];

//    ||[___]||
// same coordinates within -180/180, but listed in different order to simulate drawing
// rectangles starting from different corners
let lonLatValidSame: LngLatType[][][] = [
  [
    [
      [-180, 5],
      [-180, 0],
      [-170, 0],
      [-170, 5],
      [-180, 5],
    ],
  ],
  [
    [
      [-170, 5],
      [-180, 5],
      [-180, 0],
      [-170, 0],
      [-170, 5],
    ],
  ],
  [
    [
      [-170, 0],
      [-170, 5],
      [-180, 5],
      [-180, 0],
      [-170, 0],
    ],
  ],
  [
    [
      [-180, 0],
      [-170, 0],
      [-170, 5],
      [-180, 5],
      [-180, 0],
    ],
  ],
];

//    [___]||  ||
// same coordinates less than -180
let lonLatLessSame: LngLatType[][][] = [
  [
    [
      [-190, 5],
      [-190, 0],
      [-180, 0],
      [-180, 5],
      [-190, 5],
    ],
  ],
  [
    [
      [-180, 5],
      [-190, 5],
      [-190, 0],
      [-180, 0],
      [-180, 5],
    ],
  ],
  [
    [
      [-180, 0],
      [-180, 5],
      [-190, 5],
      [-190, 0],
      [-180, 0],
    ],
  ],
  [
    [
      [-190, 0],
      [-180, 0],
      [-180, 5],
      [-190, 5],
      [-190, 0],
    ],
  ],
];

//    ||  ||[___]
// same coordinates greater than 180
let lonLatGreaterSame: LngLatType[][][] = [
  [
    [
      [180, 5],
      [180, 0],
      [190, 0],
      [190, 5],
      [180, 5],
    ],
    [
      [190, 5],
      [180, 5],
      [180, 0],
      [190, 0],
      [190, 5],
    ],
    [
      [190, 0],
      [190, 5],
      [180, 5],
      [180, 0],
      [190, 0],
    ],
    [
      [180, 0],
      [190, 0],
      [190, 5],
      [180, 5],
      [180, 0],
    ],
  ],
];

//    [||]  [||]
let antimerdianCoorsNegative: LngLatType[][][] = [
  [
    [
      [-190, 5],
      [-190, -0],
      [-170, -0],
      [-170, 5],
      [-190, 5],
    ],
  ],

  [
    [
      [-170, 5],
      [-190, 5],
      [-190, -0],
      [-170, -0],
      [-170, 5],
    ],
  ],

  [
    [
      [-170, 0],
      [-170, 5],
      [-190, 5],
      [-190, 0],
      [-170, 0],
    ],
  ],

  [
    [
      [-190, 0],
      [-170, 0],
      [-170, 5],
      [-190, 5],
      [-190, 0],
    ],
  ],
];

let antimerdianCoorsPostive: LngLatType[][][] = [
  [
    [
      [170, 5],
      [170, 0],
      [190, 0],
      [190, 5],
      [170, 5],
    ],
  ],
  [
    [
      [190, 5],
      [170, 5],
      [170, 0],
      [190, 0],
      [190, 5],
    ],
  ],
  [
    [
      [190, 0],
      [190, 5],
      [170, 5],
      [170, 0],
      [190, 0],
    ],
  ],
  [
    [
      [170, 0],
      [190, 0],
      [190, 5],
      [170, 5],
      [170, 0],
    ],
  ],
];

let expectedMapLayers = ["basemap: Open Street Map", "bounding box"];

describe("normalizeTerraDrawLngLat", () => {
  test.each(lonLatValid)(
    "normalizedLngLat same as original coordinates if coordinates are between -180/180",
    (coors) => {
      let { map } = setupMapAndStore();

      let results = normalizeTerraDrawLngLat(coors, map);

      expect(results.normalizedLngLat).toStrictEqual(coors);
    },
  );

  test("returns coordinates between -180/180 if coordinates are less than -180", () => {
    let { map } = setupMapAndStore();
    let coors: LngLatType[] = [
      [-190, 5],
      [-190, 0],
      [-180, 0],
      [-180, 5],
      [-190, 5],
    ];

    let results = normalizeTerraDrawLngLat(coors, map);

    // BUG: leaflet map.wrapLatLng works differently in live site and tests.
    // live site returns [[170,5],[170,0],[180,0],[180,5],[170,5]]
    expect(results.normalizedLngLat).toStrictEqual([
      [170, 5],
      [170, 0],
      [-180, 0],
      [-180, 5],
      [170, 5],
    ]);
  });

  test("returns coordinates is between -180/180 if coordinates are greater 180", () => {
    let { map } = setupMapAndStore();
    let coors: LngLatType[] = [
      [180, 5],
      [180, 0],
      [190, 0],
      [190, 5],
      [180, 5],
    ];

    let results = normalizeTerraDrawLngLat(coors, map);

    // BUG: leaflet map.wrapLatLng works differently in live site and tests.
    // live site returns [[-180,5],[-180,0],[-170,0],[-170,5],[-180,5]]
    expect(results.normalizedLngLat).toStrictEqual([
      [180, 5],
      [180, 0],
      [-170, 0],
      [-170, 5],
      [180, 5],
    ]);
  });
});

describe("convertLnLatToiNatBBox", () => {
  test.each(lonLatValidSame)(
    "returns same iNat bounding box regardless of order of coordinates",
    (coors) => {
      let { map } = setupMapAndStore();

      let { normalizedLngLat } = normalizeTerraDrawLngLat(coors, map);
      let result = convertLnLatToiNatBBox(normalizedLngLat, coors);

      expect(result).toStrictEqual({
        nelat: 5,
        nelng: -170,
        swlat: 0,
        swlng: -180,
      });
    },
  );

  test.each(lonLatLessSame)(
    "returns same iNat bounding box regardless of order of coordinates",
    (coors) => {
      let { map } = setupMapAndStore();

      let { normalizedLngLat } = normalizeTerraDrawLngLat(coors, map);
      let result = convertLnLatToiNatBBox(normalizedLngLat, coors);

      expect(result).toStrictEqual({
        nelat: 5,
        nelng: 170,
        swlat: 0,
        swlng: -180,
      });
    },
  );

  test.each(lonLatGreaterSame)(
    "returns same iNat bounding box regardless of order of coordinates",
    (coors) => {
      let { map } = setupMapAndStore();

      let { normalizedLngLat } = normalizeTerraDrawLngLat(coors, map);
      let result = convertLnLatToiNatBBox(normalizedLngLat, coors);

      expect(result).toStrictEqual({
        nelat: 5,
        nelng: 180,
        swlat: 0,
        swlng: -170,
      });
    },
  );

  test.each(antimerdianCoorsNegative)(
    "returns same iNat bounding box regardless of order of coordinates",
    (coors) => {
      let { map } = setupMapAndStore();

      let { normalizedLngLat } = normalizeTerraDrawLngLat(coors, map);
      let result = convertLnLatToiNatBBox(normalizedLngLat, coors);

      expect(result).toStrictEqual({
        nelat: 5,
        nelng: -170,
        swlat: 0,
        swlng: 170,
      });
    },
  );

  test.each(antimerdianCoorsPostive)(
    "returns same iNat bounding box regardless of order of coordinates",
    (coors) => {
      let { map } = setupMapAndStore();

      let { normalizedLngLat } = normalizeTerraDrawLngLat(coors, map);
      let result = convertLnLatToiNatBBox(normalizedLngLat, coors);

      expect(result).toStrictEqual({
        nelat: 5,
        nelng: -170,
        swlat: 0,
        swlng: 170,
      });
    },
  );
});

describe("drawBBoxHandler", () => {
  test.each(lonLatValidSame)(
    "adds NE/SW, selectedPlaces,placesMapLayers to store; add layer to map",
    (coors) => {
      let { store } = setupMapAndStore();
      store.selectedTaxa = [allTaxaRecord];
      store.observationsApiParams.taxon_id = allTaxaRecord.id.toString();
      store.observationsApiParams.colors = allTaxaRecord.color;

      drawBBoxHandler(structuredClone(coors), store);

      expect(store.observationsApiParams).toStrictEqual({
        ...defaultParams,
        nelat: 5,
        nelng: -170,
        swlat: 0,
        swlng: -180,
      });
      expect(store.placesMapLayers[0][0].getBounds()).toStrictEqual({
        _northEast: { lat: 5, lng: -170 },
        _southWest: { lat: 0, lng: -180 },
      });
      expect(store.placesMapLayers[0].length).toStrictEqual(1);
      expect(store.selectedPlaces[0].bounding_box?.coordinates).toStrictEqual([
        coors,
      ]);
      expect(leafletMapLayers(store)).toStrictEqual(expectedMapLayers);
    },
  );
});

describe("addiNatBBoxToMap", () => {
  test("takes iNat NE SW values, and adds bounding box to map", () => {
    let { store } = setupMapAndStore();
    store.selectedTaxa = [allTaxaRecord];
    store.observationsApiParams.taxon_id = allTaxaRecord.id.toString();
    store.observationsApiParams.colors = allTaxaRecord.color;
    store.observationsApiParams.nelat = 5;
    store.observationsApiParams.nelng = -170;
    store.observationsApiParams.swlat = 0;
    store.observationsApiParams.swlng = -180;

    addiNatBBoxToMap(store);

    expect(store.placesMapLayers[0][0].getBounds()).toStrictEqual({
      _northEast: { lat: 5, lng: -170 },
      _southWest: { lat: 0, lng: -180 },
    });
    expect(store.placesMapLayers[0][0].getLatLngs()).toStrictEqual([
      [
        { lat: 0, lng: -180 },
        { lat: 0, lng: -170 },
        { lat: 5, lng: -170 },
        { lat: 5, lng: -180 },
      ],
    ]);
    expect(leafletMapLayers(store)).toStrictEqual(expectedMapLayers);
  });

  test("works with bounding box that cross anitmerdian", () => {
    let { store } = setupMapAndStore();
    store.selectedTaxa = [allTaxaRecord];
    store.observationsApiParams.taxon_id = allTaxaRecord.id.toString();
    store.observationsApiParams.colors = allTaxaRecord.color;
    store.observationsApiParams.nelat = 5;
    store.observationsApiParams.nelng = -170;
    store.observationsApiParams.swlat = 0;
    store.observationsApiParams.swlng = 170;

    addiNatBBoxToMap(store);

    expect(store.placesMapLayers[0][0].getBounds()).toStrictEqual({
      _northEast: { lat: 5, lng: -170 },
      _southWest: { lat: 0, lng: -190 },
    });
    expect(store.placesMapLayers[0][0].getLatLngs()).toStrictEqual([
      [
        { lat: 0, lng: -190 },
        { lat: 0, lng: -170 },
        { lat: 5, lng: -170 },
        { lat: 5, lng: -190 },
      ],
    ]);
    expect(leafletMapLayers(store)).toStrictEqual(expectedMapLayers);
  });
});

describe("crossesAntimerdian", () => {
  test.each(antimerdianCoorsNegative)(
    "returns true if coordinates crosses antimerdian",
    (coors) => {
      let results = crossesAntimerdian(coors);

      expect(results).toBe(true);
    },
  );

  test.each(antimerdianCoorsPostive)(
    "returns true if coordinates crosses antimerdian",
    (coors) => {
      let results = crossesAntimerdian(coors);

      expect(results).toBe(true);
    },
  );

  test.each(lonLatValid)(
    "returns false if coordinates does not cross antimerdian",
    (coors) => {
      let results = crossesAntimerdian(coors);

      expect(results).toBe(false);
    },
  );
});

describe("convertiNatBBoxToLatLng", () => {
  test("takes iNat NE/SE and returns array of lat/long coordinates", () => {
    let { map } = setupMapAndStore();

    let bbox = { nelat: 5, nelng: -170, swlat: 0, swlng: -180 };
    let result = convertiNatBBoxToLatLng(bbox, map);

    expect(result).toStrictEqual([
      [0, -180],
      [0, -170],
      [5, -170],
      [5, -180],
      [0, -180],
    ]);
  });

  test("works with iNat NE/SE data that crosses the antimerdian", () => {
    let { map } = setupMapAndStore();

    let bbox = { nelat: 5, nelng: -170, swlat: 0, swlng: 170 };
    let result = convertiNatBBoxToLatLng(bbox, map);

    expect(result).toStrictEqual([
      [0, -190],
      [0, -170],
      [5, -170],
      [5, -190],
      [0, -190],
    ]);
  });
});

describe("convertiNatBBoxToLngLat", () => {
  test("takes iNat NE/SE and returns array of long.lat coordinates", () => {
    let bbox = { nelat: 5, nelng: -170, swlat: 0, swlng: -180 };
    let result = convertiNatBBoxToLngLat(bbox);

    expect(result).toStrictEqual([
      [-180, 0],
      [-170, 0],
      [-170, 5],
      [-180, 5],
      [-180, 0],
    ]);
  });

  test("works with iNat NE/SE data that crosses the antimerdian", () => {
    let bbox = { nelat: 5, nelng: -170, swlat: 0, swlng: 170 };
    let result = convertiNatBBoxToLngLat(bbox);

    expect(result).toStrictEqual([
      [-190, 0],
      [-170, 0],
      [-170, 5],
      [-190, 5],
      [-190, 0],
    ]);
  });
});
