import { displayAppstoreData } from "../components/AppStoreViewer/utils";
import { siteCC } from "../data/inat_data";
import type { AppStoreType } from "../types/app";
import { primaryColorSchemeName } from "./map_colors_utils";

export const defaultStore: AppStoreType = {
  currentPage: "home",
  map: { map: null, layerControl: null, terraDraw: null },
  selectedPlaces: [],
  selectedTaxa: [],
  observationsApiParams: {
    spam: false,
    verifiable: true,
    per_page: 24,
    // quality_grade: "research",
    // captive: false,
    obscuration: "none",
    license: siteCC.join(","),
    photo_license: siteCC.join(","),
    photos: true,
  },
  viewMetadata: { name_order: "cs" },
  currentView: "search",
  taxaMapLayers: {},
  placesMapLayers: {},
  primaryColorScheme: primaryColorSchemeName,
  placesMarkers: [],
  radius: 1.6,
};

const proxiedStore = new Proxy(structuredClone(defaultStore), {
  set(target, property, value) {
    (target as any)[property] = value;

    displayAppstoreData(proxiedStore, `proxiedStore ${property.toString()}`);

    return true;
  },
});

export default proxiedStore;
