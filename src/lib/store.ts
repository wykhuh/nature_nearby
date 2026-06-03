import type { AppStoreType } from "../types/app";

export const defaultStore: AppStoreType = {
  currentPage: "home",
  map: null,
  selectedPlaces: [],
  selectedTaxa: [],
  observationsParams: { spam: false, verifiable: true, per_page: 24 },
  viewMetadata: { name_order: "cs" },
};

const proxiedStore = new Proxy(structuredClone(defaultStore), {
  set(target, property, value) {
    (target as any)[property] = value;

    return true;
  },
});

export default proxiedStore;
