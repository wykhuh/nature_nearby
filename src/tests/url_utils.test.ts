// @vitest-environment jsdom

import { expect, test, describe } from "vitest";
import { decodeAppUrl, formatAppParams } from "../lib/url_utils";
import { defaultStore } from "../lib/store";
import { milkweed, monarch, placeCity, placeCountry } from "./fixtures/data";
import { defaultParamsString } from "./fixtures/test_helpers";
import { observationsApiNames } from "../data/app_data";

describe("decodeAppUrl", () => {
  test("returns empty object if no search params", () => {
    let results = decodeAppUrl("", "/");

    expect(results).toStrictEqual({});
  });

  test.each(observationsApiNames)(
    "add key and value to object for valid params",
    (field) => {
      let results = decodeAppUrl(`?${field}=abc`, "/");

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
});

describe("formatAppParams", () => {
  test("return key/value string for default store", () => {
    let store = structuredClone(defaultStore);

    let result = formatAppParams(store);

    expect(result).toBe(
      "spam=false&verifiable=true&per_page=24&obscuration=none&photos=true",
    );
  });

  test("returns place_id if store has place", () => {
    let store = structuredClone(defaultStore);
    store.selectedPlaces = [placeCity];

    let result = formatAppParams(store);

    expect(result).toBe(`place_id=${placeCity.id}&${defaultParamsString}`);
  });

  test("returns taxon_id if store has place", () => {
    let store = structuredClone(defaultStore);
    store.selectedTaxa = [monarch];

    let result = formatAppParams(store);

    expect(result).toBe(`taxon_id=${monarch.id}&${defaultParamsString}`);
  });

  test("returns place_id and taxon_id if store has places and taxa", () => {
    let store = structuredClone(defaultStore);
    store.selectedTaxa = [monarch, milkweed];
    store.selectedPlaces = [placeCity, placeCountry];

    let result = formatAppParams(store);

    expect(result).toBe(
      `taxon_id=${monarch.id},${milkweed.id}` +
        `&place_id=${placeCity.id},${placeCountry.id}` +
        `&${defaultParamsString}`,
    );
  });

  test("returns undefined if  store has place and page is about", () => {
    let store = structuredClone(defaultStore);
    store.currentPage = "about";
    store.selectedPlaces = [placeCity];

    let result = formatAppParams(store);

    expect(result).toBe(undefined);
  });
});
