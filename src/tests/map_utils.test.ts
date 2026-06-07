// @vitest-environment jsdom

import jsdom from "jsdom";
import { expect, test, describe, beforeEach } from "vitest";

import { addiNatBBoxToMap } from "../lib/map_utils";
import { setupMapAndStore } from "./fixtures/test_helpers";

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

describe("addiNatBBoxToMap", () => {
  test("takes iNat NE SW number, and adds bounding box to store and map", () => {
    let { store } = setupMapAndStore();
    store.observationsApiParams.nelat = 0;
    store.observationsApiParams.nelng = 5;
    store.observationsApiParams.swlat = -20;
    store.observationsApiParams.swlng = -5;

    addiNatBBoxToMap(store);

    expect(store.placesMapLayers[0][0].getBounds()).toStrictEqual({
      _northEast: { lat: 0, lng: 5 },
      _southWest: { lat: -20, lng: -5 },
    });
    expect(store.placesMapLayers[0][0].getLatLngs()).toStrictEqual([
      [
        { lat: 0, lng: 5 },
        { lat: -20, lng: 5 },
        { lat: -20, lng: -5 },
        { lat: 0, lng: -5 },
      ],
    ]);
  });
});
