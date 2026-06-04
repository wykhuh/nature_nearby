// @vitest-environment jsdom

import { expect, test, describe, beforeAll, afterEach, afterAll } from "vitest";
import { defaultStore } from "../lib/store";
import { placeCountry, placeCity, monarch, milkweed } from "./fixtures/data";
import { createMockServer, defaultParams } from "./fixtures/test_helpers";
import { observationsApiNames } from "../data/app_data";
import { initApp } from "../lib/init_app";

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

describe("initApp", () => {
  test("if no search params, set observationsApiParams to default params ", async () => {
    let store = structuredClone(defaultStore);

    await initApp("", "/", store);

    expect(store.observationsApiParams).toStrictEqual(defaultParams);
  });

  test.each(observationsApiNames)(
    "if search params, add params to observationsApiParams",
    async (field) => {
      let store = structuredClone(defaultStore);
      let value: string | number = "abc";
      let paramStr = `?${field}=${value}`;
      if (field === "place_id") {
        paramStr = `?${field}=${placeCity.id}`;
        value = placeCity.id;
      } else if (field === "taxon_id") {
        paramStr = `?${field}=${monarch.id}`;
        value = monarch.id;
      }

      await initApp(paramStr, "/", store);

      let expected = { ...defaultParams, [field]: value };
      expect(store.observationsApiParams).toStrictEqual(expected);
    },
  );

  test("ignore invalid params", async () => {
    let store = structuredClone(defaultStore);

    await initApp(`?bad=abc`, "/", store);

    let expected = { ...defaultParams };
    expect(store.observationsApiParams).toStrictEqual(expected);
  });

  test("if one place_id, add place to observationsApiParams and selectedPlaces", async () => {
    let store = structuredClone(defaultStore);

    await initApp(`?place_id=${placeCity.id}`, "/", store);

    let expected = { ...defaultParams, place_id: placeCity.id };
    expect(store.observationsApiParams).toStrictEqual(expected);
    expect(store.selectedPlaces).toStrictEqual([placeCity]);
  });

  test("if multiple place_id, add place to observationsApiParams and selectedPlaces", async () => {
    let store = structuredClone(defaultStore);

    await initApp(`?place_id=${placeCity.id},${placeCountry.id}`, "/", store);

    let expected = {
      ...defaultParams,
      place_id: `${placeCity.id},${placeCountry.id}`,
    };
    expect(store.observationsApiParams).toStrictEqual(expected);
    expect(store.selectedPlaces).toStrictEqual([placeCity, placeCountry]);
  });

  test("if one taxon_id, add taxon to observationsApiParams and selectedTaxa", async () => {
    let store = structuredClone(defaultStore);

    await initApp(`?taxon_id=${monarch.id}`, "/", store);

    let expected = { ...defaultParams, taxon_id: monarch.id };
    expect(store.observationsApiParams).toStrictEqual(expected);
    expect(store.selectedTaxa).toStrictEqual([monarch]);
  });

  test("if multiple taxon_id, add taxa to observationsApiParams and selectedTaxa", async () => {
    let store = structuredClone(defaultStore);

    await initApp(`?taxon_id=${monarch.id},${milkweed.id}`, "/", store);

    let expected = {
      ...defaultParams,
      taxon_id: `${monarch.id},${milkweed.id}`,
    };
    expect(store.observationsApiParams).toStrictEqual(expected);
    expect(store.selectedTaxa).toStrictEqual([monarch, milkweed]);
  });
});
