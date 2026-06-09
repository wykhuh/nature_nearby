import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import {
  monarchMilkweedTaxaApiResponse,
  monarchTaxaApiResponse,
  places1APIResponse,
  places2APIResponse,
} from "./data";
import { allTaxaRecord } from "../../data/inat_data";
import { renderMap } from "../../lib/map_utils";
import { defaultStore } from "../../lib/store";
import type { AppStoreType } from "../../types/app";

export const defaultParamsString =
  "spam=false&verifiable=true&per_page=24&obscuration=none&photos=true";

export const defaultParams = {
  spam: false,
  verifiable: true,
  per_page: 24,
  obscuration: "none",
  photos: true,
  taxon_id: `${allTaxaRecord.id}`,
  colors: allTaxaRecord.color,
};

export function createMockServer() {
  const handlers = [
    http.get("https://api.inaturalist.org/v2/places/1", async (_args) => {
      return HttpResponse.json(places1APIResponse);
    }),
    http.get("https://api.inaturalist.org/v2/places/1,2", async (_args) => {
      return HttpResponse.json(places2APIResponse);
    }),
    http.get("https://api.inaturalist.org/v2/taxa/48662", async (_args) => {
      return HttpResponse.json(monarchTaxaApiResponse);
    }),
    http.get(
      "https://api.inaturalist.org/v2/taxa/48662,56851",
      async (_args) => {
        return HttpResponse.json(monarchMilkweedTaxaApiResponse);
      },
    ),

    http.get("*", async (_args) => {
      console.error("!! request.url !!", _args.request.url);
      return HttpResponse.json({});
    }),
  ];

  const server = setupServer(...handlers);

  return server;
}

export function setupMapAndStore() {
  let { map, layerControl, terraDraw } = renderMap();
  let dup = structuredClone(defaultStore);
  let store: AppStoreType = {
    ...dup,
    map: {
      map: map,
      layerControl: layerControl,
      terraDraw: terraDraw,
    },
  };

  return { map, layerControl, store };
}
