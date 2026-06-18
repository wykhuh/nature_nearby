// @vitest-environment jsdom

import jsdom from "jsdom";
import {
  expect,
  test,
  describe,
  beforeAll,
  afterEach,
  afterAll,
  beforeEach,
  vi,
} from "vitest";
import {
  placeCountry,
  placeCity,
  createCurrentLocationDemo,
  createBboxDemo,
} from "../fixtures/data";
import {
  createMockServer,
  defaultParams,
  setupMapAndStore,
} from "../fixtures/test_helpers";
import { initApp, initPopulateMap } from "../../lib/init_app";
import { bboxPlaceRecord } from "../../data/inat_data";
import { removePlace } from "../../lib/search_places";
import { drawBBoxHandler } from "../../lib/search_bounding_box";
import type { LatLngType } from "../../types/app";
import { currentLocationHandler } from "../../lib/search_current_place";
import type { ViewSearch } from "../../components/ViewSearch/component";
import { getLatLong } from "../../lib/geolocation";
import { validGeolocationType } from "../../data/app_data";

const server = createMockServer();
beforeAll(() => {
  server.listen();
});
afterEach(() => {
  server.resetHandlers();
  vi.restoreAllMocks();
});
afterAll(() => {
  server.close();
});
vi.mock(import("../../lib/geolocation"), () => {
  return { getLatLong: vi.fn() };
});

beforeEach(() => {
  const { JSDOM } = jsdom;

  let dom = new JSDOM(
    `<!doctype html>
<html lang="en">
  <body>
    <div id="map" style="width: 400px; height: 400px"></div>
    <div id="form"><input id="latitude"><input id="longitude"></container>
   </body>
</html>`,
  );
  // @ts-ignore
  global.document = dom.window.document;

  vi.mocked(getLatLong).mockResolvedValue({
    coords: {
      latitude: 10,
      longitude: 10,
      accuracy: 1,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    },
    timestamp: 1,
  });

  const mockGeolocation = {
    watchPosition: vi.fn().mockImplementation((success) =>
      success({
        coords: {
          latitude: 10,
          longitude: 10,
        },
        timestamp: 123456,
      }),
    ),
    clearWatch: vi.fn().mockImplementation(() => {}),
  };
  navigator.geolocation = mockGeolocation;
});

describe("removePlace", () => {
  test("remove one place from store and map", async () => {
    let { map, store, terraDraw, layerControl } = setupMapAndStore();

    await initApp(`?place_id=${placeCity.id}`, "/", store);
    await initPopulateMap(map, terraDraw, layerControl, store);

    expect(store.observationsApiParams).toStrictEqual({
      ...defaultParams,
      place_id: placeCity.id,
    });
    expect(store.selectedPlaces).toStrictEqual([placeCity]);
    expect(Object.keys(store.placesMapLayers)).toStrictEqual([
      `${placeCity.id}`,
    ]);

    await removePlace(placeCity.id, store);

    expect(store.observationsApiParams).toStrictEqual({
      ...defaultParams,
    });
    expect(store.selectedPlaces).toStrictEqual([]);
    expect(Object.keys(store.placesMapLayers)).toStrictEqual([]);
  });

  test("remove multiple place from store and map", async () => {
    let { map, store, terraDraw, layerControl } = setupMapAndStore();

    await initApp(`?place_id=${placeCity.id},${placeCountry.id}`, "/", store);
    await initPopulateMap(map, terraDraw, layerControl, store);

    expect(store.observationsApiParams).toStrictEqual({
      ...defaultParams,
      place_id: `${placeCity.id},${placeCountry.id}`,
    });
    expect(store.selectedPlaces).toStrictEqual([placeCity, placeCountry]);
    expect(Object.keys(store.placesMapLayers)).toStrictEqual([
      `${placeCity.id}`,
      `${placeCountry.id}`,
    ]);

    await removePlace(placeCity.id, store);

    expect(store.observationsApiParams).toStrictEqual({
      ...defaultParams,
      place_id: `${placeCountry.id}`,
    });
    expect(store.selectedPlaces).toStrictEqual([placeCountry]);
    expect(Object.keys(store.placesMapLayers)).toStrictEqual([
      `${placeCountry.id}`,
    ]);

    await removePlace(placeCountry.id, store);

    expect(store.observationsApiParams).toStrictEqual({
      ...defaultParams,
    });
    expect(store.selectedPlaces).toStrictEqual([]);
    expect(Object.keys(store.placesMapLayers)).toStrictEqual([]);
  });

  test.each(validGeolocationType)(
    "remove current place from store and map",
    async (type) => {
      let { map, store, terraDraw, layerControl } = setupMapAndStore();
      let currentPlace = createCurrentLocationDemo();

      await initApp(`?lat=10&lng=10&geolocation=${type}`, "/", store);
      await initPopulateMap(map, terraDraw, layerControl, store);

      expect(store.observationsApiParams).toStrictEqual({
        ...defaultParams,
        lat: 10,
        lng: 10,
        radius: 1.6,
      });
      expect(store.geolocation).toBe(type);
      if (type === "tracking") {
        expect(store.trackingTimestamp).toStrictEqual(123456);
      }
      expect(store.selectedPlaces).toStrictEqual([currentPlace]);
      expect(Object.keys(store.placesMapLayers)).toStrictEqual([]);
      expect(store.placesMarkers.map((m) => m._latlng)).toStrictEqual([
        { lat: 10, lng: 10 },
        { lat: 10, lng: 10 },
      ]);

      await removePlace(currentPlace.id, store);

      expect(store.observationsApiParams).toStrictEqual({
        ...defaultParams,
      });
      expect(store.selectedPlaces).toStrictEqual([]);
      expect(Object.keys(store.placesMapLayers)).toStrictEqual([]);
      expect(store.placesMarkers).toStrictEqual([]);
    },
  );

  test("remove custom boundary from store and map", async () => {
    let { map, store, terraDraw, layerControl } = setupMapAndStore();
    let customBoundary = createBboxDemo();

    await initApp(`?nelat=0&nelng=0&swlat=0&swlng=0`, "/", store);
    await initPopulateMap(map, terraDraw, layerControl, store);

    expect(store.observationsApiParams).toStrictEqual({
      ...defaultParams,
      nelat: 0,
      nelng: 0,
      swlat: 0,
      swlng: 0,
    });
    expect(store.selectedPlaces).toStrictEqual([customBoundary]);
    expect(Object.keys(store.placesMapLayers)).toStrictEqual([
      `${customBoundary.id}`,
    ]);

    await removePlace(customBoundary.id, store);

    expect(store.observationsApiParams).toStrictEqual({
      ...defaultParams,
    });
    expect(store.selectedPlaces).toStrictEqual([]);
    expect(Object.keys(store.placesMapLayers)).toStrictEqual([]);
  });

  test.each(validGeolocationType)(
    "remove place when place and current place",
    async (type) => {
      let { map, store, terraDraw, layerControl } = setupMapAndStore();
      let currentPlace = createCurrentLocationDemo();

      await initApp(
        `?place_id=${placeCity.id}&lat=10&lng=10&geolocation=${type}`,
        "/",
        store,
      );
      await initPopulateMap(map, terraDraw, layerControl, store);

      expect(store.observationsApiParams).toStrictEqual({
        ...defaultParams,
        lat: 10,
        lng: 10,
        radius: 1.6,
        place_id: placeCity.id,
      });
      expect(store.geolocation).toStrictEqual(type);
      if (type === "tracking") {
        expect(store.trackingTimestamp).toStrictEqual(123456);
      }
      expect(store.selectedPlaces).toStrictEqual([placeCity, currentPlace]);
      expect(Object.keys(store.placesMapLayers)).toStrictEqual([
        `${placeCity.id}`,
      ]);
      expect(store.placesMarkers.map((m) => m._latlng)).toStrictEqual([
        { lat: 10, lng: 10 },
        { lat: 10, lng: 10 },
      ]);

      await removePlace(placeCity.id, store);

      expect(store.observationsApiParams).toStrictEqual({
        ...defaultParams,
        lat: 10,
        lng: 10,
        radius: 1.6,
      });
      expect(store.selectedPlaces).toStrictEqual([currentPlace]);
      expect(Object.keys(store.placesMapLayers)).toStrictEqual([]);
      expect(store.placesMarkers.map((m) => m._latlng)).toStrictEqual([
        { lat: 10, lng: 10 },
        { lat: 10, lng: 10 },
      ]);
    },
  );

  test.each(validGeolocationType)(
    "remove current place when place and current place",
    async (type) => {
      let { map, store, terraDraw, layerControl } = setupMapAndStore();
      let currentPlace = createCurrentLocationDemo();

      await initApp(
        `?place_id=${placeCity.id}&lat=10&lng=10&geolocation=${type}`,
        "/",
        store,
      );
      await initPopulateMap(map, terraDraw, layerControl, store);

      expect(store.observationsApiParams).toStrictEqual({
        ...defaultParams,
        lat: 10,
        lng: 10,
        radius: 1.6,
        place_id: placeCity.id,
      });
      expect(store.geolocation).toStrictEqual(type);
      if (type === "tracking") {
        expect(store.trackingTimestamp).toStrictEqual(123456);
      }
      expect(store.selectedPlaces).toStrictEqual([placeCity, currentPlace]);
      expect(Object.keys(store.placesMapLayers)).toStrictEqual([
        `${placeCity.id}`,
      ]);
      expect(store.placesMarkers.map((m) => m._latlng)).toStrictEqual([
        { lat: 10, lng: 10 },
        { lat: 10, lng: 10 },
      ]);

      await removePlace(currentPlace.id, store);

      expect(store.observationsApiParams).toStrictEqual({
        ...defaultParams,
        place_id: placeCity.id,
      });
      expect(store.selectedPlaces).toStrictEqual([placeCity]);
      expect(Object.keys(store.placesMapLayers)).toStrictEqual([
        `${placeCity.id}`,
      ]);
      expect(store.placesMarkers.map((m) => m._latlng)).toStrictEqual([]);
    },
  );

  test.each(validGeolocationType)(
    "remove custom boundary when custom boundary and current place",
    async (type) => {
      let { map, store, terraDraw, layerControl } = setupMapAndStore();
      let currentPlace = createCurrentLocationDemo();
      let customBoundary = createBboxDemo();

      await initApp(
        `?nelat=0&nelng=0&swlat=0&swlng=0&lat=10&lng=10&geolocation=${type}`,
        "/",
        store,
      );
      await initPopulateMap(map, terraDraw, layerControl, store);

      expect(store.observationsApiParams).toStrictEqual({
        ...defaultParams,
        lat: 10,
        lng: 10,
        radius: 1.6,
        nelat: 0,
        nelng: 0,
        swlat: 0,
        swlng: 0,
      });
      expect(store.geolocation).toStrictEqual(type);
      if (type === "tracking") {
        expect(store.trackingTimestamp).toStrictEqual(123456);
      }
      expect(store.selectedPlaces).toStrictEqual([
        customBoundary,
        currentPlace,
      ]);
      expect(Object.keys(store.placesMapLayers)).toStrictEqual([
        `${customBoundary.id}`,
      ]);
      expect(store.placesMarkers.map((m) => m._latlng)).toStrictEqual([
        { lat: 10, lng: 10 },
        { lat: 10, lng: 10 },
      ]);

      await removePlace(customBoundary.id, store);

      expect(store.observationsApiParams).toStrictEqual({
        ...defaultParams,
        lat: 10,
        lng: 10,
        radius: 1.6,
      });
      expect(store.selectedPlaces).toStrictEqual([currentPlace]);
      expect(Object.keys(store.placesMapLayers)).toStrictEqual([]);
      expect(store.placesMarkers.map((m) => m._latlng)).toStrictEqual([
        { lat: 10, lng: 10 },
        { lat: 10, lng: 10 },
      ]);
    },
  );

  test.each(validGeolocationType)(
    "remove current place when custom boundary and current place",
    async (type) => {
      let { map, store, terraDraw, layerControl } = setupMapAndStore();
      let currentPlace = createCurrentLocationDemo();
      let customBoundary = createBboxDemo();

      await initApp(
        `?nelat=0&nelng=0&swlat=0&swlng=0&lat=10&lng=10&geolocation=${type}`,
        "/",
        store,
      );
      await initPopulateMap(map, terraDraw, layerControl, store);

      expect(store.observationsApiParams).toStrictEqual({
        ...defaultParams,
        lat: 10,
        lng: 10,
        radius: 1.6,
        nelat: 0,
        nelng: 0,
        swlat: 0,
        swlng: 0,
      });
      expect(store.geolocation).toStrictEqual(type);
      if (type === "tracking") {
        expect(store.trackingTimestamp).toStrictEqual(123456);
      }
      expect(store.selectedPlaces).toStrictEqual([
        customBoundary,
        currentPlace,
      ]);
      expect(Object.keys(store.placesMapLayers)).toStrictEqual([
        `${customBoundary.id}`,
      ]);
      expect(store.placesMarkers.map((m) => m._latlng)).toStrictEqual([
        { lat: 10, lng: 10 },
        { lat: 10, lng: 10 },
      ]);

      await removePlace(currentPlace.id, store);

      expect(store.observationsApiParams).toStrictEqual({
        ...defaultParams,
        nelat: 0,
        nelng: 0,
        swlat: 0,
        swlng: 0,
      });
      expect(store.selectedPlaces).toStrictEqual([customBoundary]);
      expect(Object.keys(store.placesMapLayers)).toStrictEqual([
        `${customBoundary.id}`,
      ]);
      expect(store.placesMarkers.map((m) => m._latlng)).toStrictEqual([]);
    },
  );
});

describe("drawBBoxHandler", () => {
  test("adds custom boundary to store and map", async () => {
    let { map, store, terraDraw, layerControl } = setupMapAndStore();
    let coors: LatLngType[] = [
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
    ];
    let customBoundary = bboxPlaceRecord(coors);

    await initApp(``, "/", store);
    await initPopulateMap(map, terraDraw, layerControl, store);
    await drawBBoxHandler(coors, store);

    expect(store.observationsApiParams).toStrictEqual({
      ...defaultParams,
      nelat: 0,
      nelng: 0,
      swlat: 0,
      swlng: 0,
    });
    expect(store.selectedPlaces).toStrictEqual([customBoundary]);
    expect(Object.keys(store.placesMapLayers)).toStrictEqual([
      `${customBoundary.id}`,
    ]);
  });

  test("if place exists, adds custom boundary and deletes place", async () => {
    let { map, store, terraDraw, layerControl } = setupMapAndStore();
    let coors: LatLngType[] = [
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
    ];
    let customBoundary = bboxPlaceRecord(coors);

    await initApp(`place_id=${placeCity.id}`, "/", store);
    await initPopulateMap(map, terraDraw, layerControl, store);
    await drawBBoxHandler(coors, store);

    expect(store.observationsApiParams).toStrictEqual({
      ...defaultParams,
      nelat: 0,
      nelng: 0,
      swlat: 0,
      swlng: 0,
    });
    expect(store.selectedPlaces).toStrictEqual([customBoundary]);
    expect(Object.keys(store.placesMapLayers)).toStrictEqual([
      `${customBoundary.id}`,
    ]);
  });

  test("if custom boundary exists, adds new custom boundary", async () => {
    let { map, store, terraDraw, layerControl } = setupMapAndStore();
    let coors: LatLngType[] = [
      [1, 1],
      [1, 1],
      [1, 1],
      [1, 1],
      [1, 1],
    ];
    let customBoundary = bboxPlaceRecord(coors);

    await initApp(`nelat=0&nelng=0&swlat=0&swlng=0`, "/", store);
    await initPopulateMap(map, terraDraw, layerControl, store);
    await drawBBoxHandler(coors, store);

    expect(store.observationsApiParams).toStrictEqual({
      ...defaultParams,
      nelat: 1,
      nelng: 1,
      swlat: 1,
      swlng: 1,
    });
    expect(store.selectedPlaces).toStrictEqual([customBoundary]);
    expect(Object.keys(store.placesMapLayers)).toStrictEqual([
      `${customBoundary.id}`,
    ]);
  });

  test.each(validGeolocationType)(
    "if current place exists, adds custom boundary and keep current place",
    async (type) => {
      let { map, store, terraDraw, layerControl } = setupMapAndStore();
      let coors: LatLngType[] = [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
      ];
      let customBoundary = bboxPlaceRecord(coors);
      let currentPlace = createCurrentLocationDemo();

      await initApp(`lat=10&lng=10&geolocation=${type}`, "/", store);
      await initPopulateMap(map, terraDraw, layerControl, store);
      await drawBBoxHandler(coors, store);

      expect(store.observationsApiParams).toStrictEqual({
        ...defaultParams,
        lat: 10,
        lng: 10,
        radius: 1.6,
        nelat: 0,
        nelng: 0,
        swlat: 0,
        swlng: 0,
      });
      expect(store.geolocation).toStrictEqual(type);
      if (type === "tracking") {
        expect(store.trackingTimestamp).toStrictEqual(123456);
      }
      expect(store.selectedPlaces).toStrictEqual([
        currentPlace,
        customBoundary,
      ]);
      expect(Object.keys(store.placesMapLayers)).toStrictEqual([
        `${customBoundary.id}`,
      ]);
      expect(store.placesMarkers.map((m) => m._latlng)).toStrictEqual([
        { lat: 10, lng: 10 },
        { lat: 10, lng: 10 },
      ]);
    },
  );
});

describe("currentLocationHandler", () => {
  let context = {
    latitudeEl: {},
    longitudeEl: {},
    formChangeHandlerDebounced: () => {},
  } as ViewSearch;

  test("add current location to map and store", async () => {
    let { map, store, terraDraw, layerControl } = setupMapAndStore();
    let currentPlace = createCurrentLocationDemo();

    await initApp(``, "/", store);
    await initPopulateMap(map, terraDraw, layerControl, store);
    await currentLocationHandler(store, context);

    expect(store.observationsApiParams).toStrictEqual({
      ...defaultParams,
      lat: 10,
      lng: 10,
      radius: 1.6,
    });
    expect(store.selectedPlaces).toStrictEqual([currentPlace]);
    expect(Object.keys(store.placesMapLayers)).toStrictEqual([]);
    expect(store.placesMarkers.map((m) => m._latlng)).toStrictEqual([
      { lat: 10, lng: 10 },
      { lat: 10, lng: 10 },
    ]);
  });

  test("add current location when there is a place", async () => {
    let { map, store, terraDraw, layerControl } = setupMapAndStore();
    let currentPlace = createCurrentLocationDemo();

    await initApp(`place_id=${placeCity.id}`, "/", store);
    await initPopulateMap(map, terraDraw, layerControl, store);
    await currentLocationHandler(store, context);

    expect(store.observationsApiParams).toStrictEqual({
      ...defaultParams,
      lat: 10,
      lng: 10,
      radius: 1.6,
      place_id: placeCity.id,
    });
    expect(store.selectedPlaces).toStrictEqual([placeCity, currentPlace]);
    expect(Object.keys(store.placesMapLayers)).toStrictEqual([
      `${placeCity.id}`,
    ]);
    expect(store.placesMarkers.map((m) => m._latlng)).toStrictEqual([
      { lat: 10, lng: 10 },
      { lat: 10, lng: 10 },
    ]);
  });

  test("add current location when there is a custom boundary", async () => {
    let { map, store, terraDraw, layerControl } = setupMapAndStore();
    let currentPlace = createCurrentLocationDemo();
    let customBoundary = createBboxDemo();

    await initApp(`nelat=0&nelng=0&swlat=0&swlng=0`, "/", store);
    await initPopulateMap(map, terraDraw, layerControl, store);
    await currentLocationHandler(store, context);

    expect(store.observationsApiParams).toStrictEqual({
      ...defaultParams,
      lat: 10,
      lng: 10,
      radius: 1.6,
      nelat: 0,
      nelng: 0,
      swlat: 0,
      swlng: 0,
    });
    expect(store.selectedPlaces).toStrictEqual([customBoundary, currentPlace]);
    expect(Object.keys(store.placesMapLayers)).toStrictEqual([
      `${customBoundary.id}`,
    ]);
    expect(store.placesMarkers.map((m) => m._latlng)).toStrictEqual([
      { lat: 10, lng: 10 },
      { lat: 10, lng: 10 },
    ]);
  });

  test("add current location when there is a current location", async () => {
    let { map, store, terraDraw, layerControl } = setupMapAndStore();
    let currentPlace = createCurrentLocationDemo();

    await initApp(`lat=5&lng=5&geolocation=current`, "/", store);
    await initPopulateMap(map, terraDraw, layerControl, store);
    await currentLocationHandler(store, context);

    expect(store.observationsApiParams).toStrictEqual({
      ...defaultParams,
      lat: 10,
      lng: 10,
      radius: 1.6,
    });
    expect(store.geolocation).toStrictEqual("current");
    expect(store.selectedPlaces).toStrictEqual([currentPlace]);
    expect(Object.keys(store.placesMapLayers)).toStrictEqual([]);
    expect(store.placesMarkers.map((m) => m._latlng)).toStrictEqual([
      { lat: 10, lng: 10 },
      { lat: 10, lng: 10 },
    ]);
  });
});
