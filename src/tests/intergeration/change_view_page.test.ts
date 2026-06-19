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
import { createCurrentLocationDemo } from "../fixtures/data";
import {
  createMockServer,
  defaultParams,
  setupMapAndStore,
} from "../fixtures/test_helpers";
import { initApp, initPopulateMap } from "../../lib/init_app";
import type { ViewSearch } from "../../components/ViewSearch/component";
import { getLatLong } from "../../lib/geolocation";
import { clearMapLayers, removeMap, renderMap } from "../../lib/map_utils";
import { currentLocationHandler } from "../../components/ViewSearch/utils";

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
});
beforeEach(() => {
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
});

describe("switch pages", () => {
  let context = {
    latitudeEl: {},
    longitudeEl: {},
    trackLocationEl: {},
    formChangeHandlerDebounced: () => {},
  } as ViewSearch;

  test("add current place on home page, switch to about, switch to home", async () => {
    let { map, store, terraDraw, layerControl } = setupMapAndStore();
    let currentPlace = createCurrentLocationDemo();

    await initApp(``, "/", store);
    await initPopulateMap(map, terraDraw, layerControl, store);

    await currentLocationHandler(store, context);

    expect(store.observationsApiParams).toStrictEqual({
      ...defaultParams,
      lat: 10,
      lng: 10,
      radius: store.radius,
    });
    expect(store.geolocation).toStrictEqual("current");
    expect(store.selectedPlaces).toStrictEqual([currentPlace]);
    expect(Object.keys(store.placesMapLayers)).toStrictEqual([]);
    expect(Object.keys(store.taxaMapLayers)).toStrictEqual(["0"]);
    expect(store.placesMarkers.length).toBe(2);

    // fake leaving home page
    removeMap(store);
    clearMapLayers(store);

    expect(store.geolocation).toStrictEqual("current");
    expect(store.selectedPlaces).toStrictEqual([currentPlace]);
    expect(Object.keys(store.placesMapLayers)).toStrictEqual([]);
    expect(Object.keys(store.taxaMapLayers)).toStrictEqual([]);
    expect(store.placesMarkers.length).toBe(0);

    // fake reloading home page
    let mapObj = renderMap();
    await initPopulateMap(
      mapObj.map,
      mapObj.terraDraw,
      mapObj.layerControl,
      store,
    );

    expect(store.observationsApiParams).toStrictEqual({
      ...defaultParams,
      lat: 10,
      lng: 10,
      radius: store.radius,
    });
    expect(store.geolocation).toStrictEqual("current");
    expect(store.selectedPlaces).toStrictEqual([currentPlace]);
    expect(Object.keys(store.placesMapLayers)).toStrictEqual(["-1"]);
    expect(Object.keys(store.taxaMapLayers)).toStrictEqual(["0"]);
    expect(store.placesMarkers.length).toBe(2);
  });
});
