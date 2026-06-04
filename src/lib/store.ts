import type { AppStoreType } from "../types/app";
import { primaryColorSchemeName } from "./map_colors_utils";

export const defaultStore: AppStoreType = {
  currentPage: "home",
  map: { map: null, layerControl: null },
  selectedPlaces: [],
  selectedTaxa: [],
  observationsApiParams: {
    spam: false,
    verifiable: true,
    per_page: 24,
    // quality_grade: "research",
    // captive: false,
    obscuration: "none",
    // license: siteCC.join(","),
    // photo_license: siteCC.join(","),
    photos: true,
  },
  viewMetadata: { name_order: "cs" },
  currentView: "search",
  primaryColorScheme: primaryColorSchemeName,
};

const proxiedStore = new Proxy(structuredClone(defaultStore), {
  set(target, property, value) {
    (target as any)[property] = value;

    return true;
  },
});

export default proxiedStore;
