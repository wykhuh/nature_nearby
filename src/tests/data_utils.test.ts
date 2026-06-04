// @vitest-environment jsdom

import { expect, test, describe } from "vitest";
import { defaultStore } from "../lib/store";
import {
  monarch,
  monarchTaxaApiResponse,
  placeCity,
  places1APIResponse,
} from "./fixtures/data";
import { normalizePlaceResult, normalizeTaxonResult } from "../lib/data_utils";

describe("normalizePlaceResult", () => {
  test("normalizes place api result", () => {
    let placeResult = places1APIResponse.results[0];

    let result = normalizePlaceResult(placeResult);

    expect(result).toStrictEqual(placeCity);
  });
});

describe("normalizeTaxonResult", () => {
  test("normalizes taxa api result", () => {
    let store = structuredClone(defaultStore);
    let taxonResult = monarchTaxaApiResponse.results[0];

    let result = normalizeTaxonResult(taxonResult, store);

    expect(result).toStrictEqual(monarch);
  });
});
