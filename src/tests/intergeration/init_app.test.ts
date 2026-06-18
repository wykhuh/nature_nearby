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
} from "vitest";
import { defaultStore } from "../../lib/store";
import {
  placeCountry,
  placeCity,
  monarch,
  milkweed,
  createCurrentLocationDemo,
  userDemo,
} from "../fixtures/data";
import {
  createMockServer,
  defaultParams,
  setupMapAndStore,
} from "../fixtures/test_helpers";
import { observationsApiNames, validView } from "../../data/app_data";
import { initApp, initPopulateMap } from "../../lib/init_app";
import { allTaxaRecord, bboxPlaceRecord } from "../../data/inat_data";
import { leafletMapLayers } from "../../lib/data_utils";

const server = createMockServer();
beforeAll(() => {
  server.listen();
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});

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

describe("initApp", () => {
  test("if no search params, set observationsApiParams to default params ", async () => {
    let store = structuredClone(defaultStore);

    await initApp("", "/", store);

    expect(store.observationsApiParams).toStrictEqual(defaultParams);
    expect(store.selectedTaxa).toStrictEqual([allTaxaRecord]);
    expect(store.color).toBe(allTaxaRecord.color);
    expect(store.currentView).toBe("search");
  });

  test("if invalid param, set observationsApiParams to default params ", async () => {
    let store = structuredClone(defaultStore);

    await initApp("?foo=bad", "/", store);

    expect(store.observationsApiParams).toStrictEqual(defaultParams);
    expect(store.selectedTaxa).toStrictEqual([allTaxaRecord]);
    expect(store.color).toBe(allTaxaRecord.color);
    expect(store.currentView).toBe("search");
  });

  test.each(observationsApiNames)(
    "if search params, add params to observationsApiParams",
    async (field) => {
      let store = structuredClone(defaultStore);
      let value: string | number = "abc";
      let paramStr = `?${field}=${value}`;
      if (
        [
          "colors",
          "taxon_id",
          "place_id",
          "view",
          "unobserved_by_user_id",
        ].includes(field)
      ) {
        return;
      }

      await initApp(paramStr, "/", store);

      let expected = { ...defaultParams, [field]: value };
      expect(store.observationsApiParams).toStrictEqual(expected);
      expect(store.color).toBe(allTaxaRecord.color);
      expect(store.currentView).toBe("search");
    },
  );

  test("ignore invalid params", async () => {
    let store = structuredClone(defaultStore);

    await initApp(`?bad=abc`, "/", store);

    let expected = { ...defaultParams };
    expect(store.observationsApiParams).toStrictEqual(expected);
    expect(store.selectedTaxa).toStrictEqual([allTaxaRecord]);
    expect(store.color).toBe(allTaxaRecord.color);
    expect(store.currentView).toBe("search");
  });

  test.each(validView)(
    "sets currentView based on valid view param",
    async (view) => {
      let store = structuredClone(defaultStore);

      await initApp(`?view=${view}`, "/", store);

      expect(store.observationsApiParams).toStrictEqual(defaultParams);
      expect(store.color).toBe(allTaxaRecord.color);
      expect(store.currentView).toBe(view);
    },
  );

  test("ignores invalid", async () => {
    let store = structuredClone(defaultStore);

    await initApp(`?view=bad`, "/", store);

    expect(store.observationsApiParams).toStrictEqual(defaultParams);
    expect(store.color).toBe(allTaxaRecord.color);
    expect(store.currentView).toBe("search");
  });

  test("if one taxon_id, add taxon to observationsApiParams and selectedTaxa", async () => {
    let store = structuredClone(defaultStore);

    await initApp(`?taxon_id=${monarch.id}`, "/", store);

    let expected = {
      ...defaultParams,
      taxon_id: monarch.id,
      colors: monarch.color,
    };
    expect(store.observationsApiParams).toStrictEqual(expected);
    expect(store.selectedTaxa).toStrictEqual([monarch]);
    expect(store.color).toBe(monarch.color);
    expect(store.currentView).toBe("search");
  });

  test("if multiple taxon_id, add taxa to observationsApiParams and selectedTaxa", async () => {
    let store = structuredClone(defaultStore);

    await initApp(`?taxon_id=${monarch.id},${milkweed.id}`, "/", store);

    let expected = {
      ...defaultParams,
      taxon_id: `${monarch.id},${milkweed.id}`,
      colors: `${monarch.color},${milkweed.color}`,
    };
    expect(store.observationsApiParams).toStrictEqual(expected);
    expect(store.selectedTaxa).toStrictEqual([monarch, milkweed]);
    expect(store.color).toBe(milkweed.color);
    expect(store.currentView).toBe("search");
  });

  test("if one unobserved_by_user_id, add unobserved_by_user_id to observationsApiParams and selectedUnobservedByUser", async () => {
    let store = structuredClone(defaultStore);

    await initApp(`?unobserved_by_user_id=${userDemo.id}`, "/", store);

    let expected = {
      ...defaultParams,
      unobserved_by_user_id: userDemo.id,
    };
    expect(store.observationsApiParams).toStrictEqual(expected);
    expect(store.selectedUnobservedByUser).toStrictEqual(userDemo);
  });
});

describe("initApp and initPopulateMap", () => {
  test("if one place_id, add place to observationsApiParams and selectedPlaces", async () => {
    let { map, store, terraDraw, layerControl } = setupMapAndStore();

    await initApp(`?place_id=${placeCity.id}`, "/", store);
    await initPopulateMap(map, terraDraw, layerControl, store);

    let expected = { ...defaultParams, place_id: placeCity.id };
    expect(store.observationsApiParams).toStrictEqual(expected);
    expect(store.selectedPlaces).toStrictEqual([placeCity]);
    expect(store.selectedTaxa).toStrictEqual([allTaxaRecord]);
    expect(store.color).toBe(allTaxaRecord.color);
    expect(store.currentView).toBe("search");
    expect(Object.keys(store.placesMapLayers)).toStrictEqual([
      `${placeCity.id}`,
    ]);
    expect(leafletMapLayers(store)).toStrictEqual([
      "basemap: Open Street Map",
      "basemap: USGS Topo",
      "basemap: USGS Imagery",
      "basemap: Open Street Map",
      "place layer: city, state, 1",
      "place layer: city, state, 1",
      "overlay: iNat grid, taxon_id 0, place_id 1",
    ]);
  });

  test("if multiple place_id, add place to observationsApiParams and selectedPlaces", async () => {
    let { map, store, terraDraw, layerControl } = setupMapAndStore();

    await initApp(`?place_id=${placeCity.id},${placeCountry.id}`, "/", store);
    await initPopulateMap(map, terraDraw, layerControl, store);

    let expected = {
      ...defaultParams,
      place_id: `${placeCity.id},${placeCountry.id}`,
    };
    expect(store.observationsApiParams).toStrictEqual(expected);
    expect(store.selectedPlaces).toStrictEqual([placeCity, placeCountry]);
    expect(store.selectedTaxa).toStrictEqual([allTaxaRecord]);
    expect(store.color).toBe(allTaxaRecord.color);
    expect(store.currentView).toBe("search");
    expect(Object.keys(store.placesMapLayers)).toStrictEqual([
      `${placeCity.id}`,
      `${placeCountry.id}`,
    ]);
    expect(leafletMapLayers(store)).toStrictEqual([
      "basemap: Open Street Map",
      "basemap: USGS Topo",
      "basemap: USGS Imagery",
      "basemap: Open Street Map",
      "place layer: city, state, 1",
      "place layer: city, state, 1",
      "place layer: country, Asia, 2",
      "place layer: country, Asia, 2",
      "overlay: iNat grid, taxon_id 0, place_id 1,2",
    ]);
  });

  test("if NE/SW, adds custom boundary to store", async () => {
    let { map, store, terraDraw, layerControl } = setupMapAndStore();

    await initApp(`?nelat=0&nelng=0&swlat=0&swlng=0`, "/", store);
    await initPopulateMap(map, terraDraw, layerControl, store);

    expect(store.observationsApiParams).toStrictEqual({
      ...defaultParams,
      nelat: 0,
      nelng: 0,
      swlat: 0,
      swlng: 0,
    });
    expect(store.selectedPlaces).toStrictEqual([
      bboxPlaceRecord([
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
      ]),
    ]);
    expect(Object.keys(store.placesMapLayers)).toStrictEqual([
      `${allTaxaRecord.id}`,
    ]);
    expect(leafletMapLayers(store)).toStrictEqual([
      "basemap: Open Street Map",
      "basemap: USGS Topo",
      "basemap: USGS Imagery",
      "basemap: Open Street Map",
      "place layer: Custom Boundary, 0",
      "bounding box",
      "overlay: iNat grid, taxon_id 0",
    ]);
  });

  test("if lat, lng, adds lat and lng to store", async () => {
    let { map, store, terraDraw, layerControl } = setupMapAndStore();

    await initApp(`?lat=10&lng=10`, "/", store);
    await initPopulateMap(map, terraDraw, layerControl, store);

    expect(store.observationsApiParams).toStrictEqual({
      ...defaultParams,
      lat: 10,
      lng: 10,
      radius: 1.6,
    });
    expect(store.selectedPlaces).toStrictEqual([]);
    expect(Object.keys(store.placesMapLayers)).toStrictEqual([]);
    expect(leafletMapLayers(store)).toStrictEqual([
      "basemap: Open Street Map",
      "basemap: USGS Topo",
      "basemap: USGS Imagery",
      "basemap: Open Street Map",
      "overlay: iNat grid, taxon_id 0",
    ]);
  });

  test("if lat, lng and geolocation=current, adds current place to store", async () => {
    let { map, store, terraDraw, layerControl } = setupMapAndStore();
    let currentPlace = createCurrentLocationDemo();

    await initApp(`?lat=10&lng=10&geolocation=current`, "/", store);
    await initPopulateMap(map, terraDraw, layerControl, store);

    expect(store.observationsApiParams).toStrictEqual({
      ...defaultParams,
      lat: 10,
      lng: 10,
      radius: 1.6,
    });
    expect(store.geolocation).toStrictEqual("current");
    expect(store.selectedPlaces).toStrictEqual([currentPlace]);
    expect(Object.keys(store.placesMapLayers)).toStrictEqual([]);
    expect(leafletMapLayers(store)).toStrictEqual([
      "basemap: Open Street Map",
      "basemap: USGS Topo",
      "basemap: USGS Imagery",
      "basemap: Open Street Map",
      "overlay: iNat grid, taxon_id 0",
    ]);
  });

  test("if lat, lng, and radius, adds current place to store", async () => {
    let { map, store, terraDraw, layerControl } = setupMapAndStore();
    let currentPlace = createCurrentLocationDemo();

    await initApp(`?lat=10&lng=10&geolocation=current&radius=5`, "/", store);
    await initPopulateMap(map, terraDraw, layerControl, store);

    expect(store.observationsApiParams).toStrictEqual({
      ...defaultParams,
      lat: 10,
      lng: 10,
      radius: 5,
    });
    expect(store.geolocation).toStrictEqual("current");
    expect(store.selectedPlaces).toStrictEqual([
      {
        ...currentPlace,
        bounding_box: {
          coordinates: [
            [
              [9.954340245293842, 9.955033919704059],
              [10.045659754706168, 9.955033919704059],
              [10.045659754706168, 10.044966080295932],
              [9.954340245293842, 10.044966080295932],
              [9.954340245293842, 9.955033919704059],
            ],
          ],
          type: "Polygon",
        },
      },
    ]);
    expect(Object.keys(store.placesMapLayers)).toStrictEqual([]);
    expect(leafletMapLayers(store)).toStrictEqual([
      "basemap: Open Street Map",
      "basemap: USGS Topo",
      "basemap: USGS Imagery",
      "basemap: Open Street Map",
      "overlay: iNat grid, taxon_id 0",
    ]);
  });

  test("if lat, lng, and place_id, adds current place and place to store", async () => {
    let { map, store, terraDraw, layerControl } = setupMapAndStore();
    let currentPlace = createCurrentLocationDemo();

    await initApp(
      `?lat=10&lng=10&geolocation=current&place_id=${placeCity.id}`,
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
    expect(store.geolocation).toStrictEqual("current");
    expect(store.selectedPlaces).toStrictEqual([placeCity, currentPlace]);
    expect(Object.keys(store.placesMapLayers)).toStrictEqual([
      `${placeCity.id}`,
    ]);
    expect(leafletMapLayers(store)).toStrictEqual([
      "basemap: Open Street Map",
      "basemap: USGS Topo",
      "basemap: USGS Imagery",
      "basemap: Open Street Map",
      "place layer: city, state, 1",
      "place layer: city, state, 1",
      "overlay: iNat grid, taxon_id 0, place_id 1",
    ]);
  });

  test("if lat, lng, and NE/SW, adds current place and custom boundary to store", async () => {
    let { map, store, terraDraw, layerControl } = setupMapAndStore();
    let currentPlace = createCurrentLocationDemo();

    await initApp(
      `?lat=10&lng=10&nelat=0&nelng=0&swlat=0&swlng=0&geolocation=current`,
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
    expect(store.geolocation).toStrictEqual("current");
    expect(store.selectedPlaces).toStrictEqual([
      bboxPlaceRecord([
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
      ]),
      currentPlace,
    ]);
    expect(Object.keys(store.placesMapLayers)).toStrictEqual([
      `${allTaxaRecord.id}`,
    ]);
    expect(leafletMapLayers(store)).toStrictEqual([
      "basemap: Open Street Map",
      "basemap: USGS Topo",
      "basemap: USGS Imagery",
      "basemap: Open Street Map",
      "place layer: Custom Boundary, 0",
      "bounding box",
      "overlay: iNat grid, taxon_id 0",
    ]);
  });
});
