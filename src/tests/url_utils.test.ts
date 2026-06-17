// @vitest-environment jsdom

import { expect, test, describe } from "vitest";
import { decodeAppUrl, formatAppParams } from "../lib/url_utils";
import { defaultStore } from "../lib/store";
import {
  createCurrentLocationDemo,
  milkweed,
  monarch,
  placeCity,
  placeCountry,
  userDemo,
} from "./fixtures/data";
import { observationsApiNames, validView } from "../data/app_data";
import { allTaxaRecord } from "../data/inat_data";

describe("decodeAppUrl", () => {
  test("returns empty object if no search params", () => {
    let results = decodeAppUrl("", "/");

    expect(results).toStrictEqual({});
  });

  test.each(observationsApiNames)(
    "add key and value to object for valid params",
    (field) => {
      let results = decodeAppUrl(`?${field}=abc`, "/");
      if (field === "view") {
        return;
      }

      expect(results).toStrictEqual({ [field]: "abc" });
    },
  );

  test("converts boolean string values to boolean", () => {
    let results = decodeAppUrl(`?sounds=true&photos=false`, "/");

    expect(results).toStrictEqual({ sounds: true, photos: false });
  });

  test("converts numeric string values to numbers", () => {
    let results = decodeAppUrl(`?month=3&lat=-30&lng=40.56&`, "/");

    expect(results).toStrictEqual({ month: 3, lat: -30, lng: 40.56 });
  });

  test("does not change string values", () => {
    let results = decodeAppUrl(
      `?quality_grade=research,casual&order=desc`,
      "/",
    );

    expect(results).toStrictEqual({
      quality_grade: "research,casual",
      order: "desc",
    });
  });

  test("ignores invalid search params", () => {
    let results = decodeAppUrl("?foo=1", "/");

    expect(results).toStrictEqual({});
  });

  test("ignore search params on about page", () => {
    let results = decodeAppUrl("?project_id=abc&place_id=456", "/about/");

    expect(results).toStrictEqual({});
  });

  test.each(validView)("returns valid views", (view) => {
    let results = decodeAppUrl(`?view=${view}`, "/");

    expect(results).toStrictEqual({ view: view });
  });

  test("ignore invalid views", () => {
    let results = decodeAppUrl(`?view=bad`, "/");

    expect(results).toStrictEqual({});
  });
});

describe("formatAppParams", () => {
  test("return empty string for default store", () => {
    let store = structuredClone(defaultStore);

    let result = formatAppParams(store);

    expect(result).toBe("");
  });

  test.each(observationsApiNames)(
    "returns valid observation params",
    (param) => {
      if (["view", "taxon_id", "place_id", "colors"].includes(param)) {
        return;
      }

      let store = structuredClone(defaultStore);
      // @ts-ignore
      store.observationsApiParams[param] = "abc";

      let result = formatAppParams(store);

      expect(result).toStrictEqual(`${param}=abc`);
    },
  );

  test("returns place_id if store has place", () => {
    let store = structuredClone(defaultStore);
    store.selectedPlaces = [placeCity];

    let result = formatAppParams(store);

    expect(result).toBe(`place_id=${placeCity.id}`);
  });

  test("returns lat and lng, ignore place_id if store has current location", () => {
    let store = structuredClone(defaultStore);
    store.observationsApiParams.lat = 0;
    store.observationsApiParams.lng = 10;
    store.selectedPlaces = [createCurrentLocationDemo()];

    let result = formatAppParams(store);

    expect(result).toBe(`lat=0&lng=10`);
  });

  test("returns lat and lng, place_id if store has selected place and current location", () => {
    let store = structuredClone(defaultStore);
    store.observationsApiParams.lat = 0;
    store.observationsApiParams.lng = 10;
    store.selectedPlaces = [createCurrentLocationDemo(), placeCity];

    let result = formatAppParams(store);

    expect(result).toBe(`place_id=${placeCity.id}&lat=0&lng=10`);
  });

  test("returns taxon_id if store has taxon", () => {
    let store = structuredClone(defaultStore);
    store.selectedTaxa = [monarch];

    let result = formatAppParams(store);

    expect(result).toBe(`taxon_id=${monarch.id}`);
  });

  test("does not return taxon_id if store has default taxon", () => {
    let store = structuredClone(defaultStore);
    store.selectedTaxa = [allTaxaRecord];

    let result = formatAppParams(store);

    expect(result).toBe(``);
  });

  test("returns place_id and taxon_id if store has places and taxa", () => {
    let store = structuredClone(defaultStore);
    store.selectedTaxa = [monarch, milkweed];
    store.selectedPlaces = [placeCity, placeCountry];

    let result = formatAppParams(store);

    expect(result).toBe(
      `taxon_id=${monarch.id},${milkweed.id}` +
        `&place_id=${placeCity.id},${placeCountry.id}`,
    );
  });

  test("returns undefined if  store has place and page is about", () => {
    let store = structuredClone(defaultStore);
    store.currentPage = "about";
    store.selectedPlaces = [placeCity];

    let result = formatAppParams(store);

    expect(result).toBe(undefined);
  });

  test("returns unobserved_by_user_id if params have unobserved_by_user", () => {
    let store = structuredClone(defaultStore);
    store.observationsApiParams.unobserved_by_user_id = userDemo.id;

    let result = formatAppParams(store);

    expect(result).toBe(`unobserved_by_user_id=${userDemo.id}`);
  });

  test("does not add view if currentView is search", () => {
    let store = structuredClone(defaultStore);
    store.currentView = "search";

    let result = formatAppParams(store);

    expect(result).toStrictEqual(``);
  });

  test.each(validView.filter((v) => v !== "search"))(
    "returns views if currentView is not search",
    (view) => {
      let store = structuredClone(defaultStore);
      store.currentView = view;

      let result = formatAppParams(store);

      expect(result).toStrictEqual(`view=${view}`);
    },
  );

  test("ignore invalid valid views", () => {
    let store = structuredClone(defaultStore);
    // @ts-ignore
    store.currentView = "bad";

    let result = formatAppParams(store);

    expect(result).toStrictEqual("");
  });
});
