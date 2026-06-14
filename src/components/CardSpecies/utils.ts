import {
  addValueToCommaSeparatedString,
  removeDefaultTaxonFromStoreAndMap,
} from "../../lib/data_utils";
import { updateTilesForSelectedTaxaDebounced } from "../../lib/search_utils";
import { updateAppUrl } from "../../lib/url_utils";
import type { AppStoreType } from "../../types/app";
import { setView } from "../ObservationsHeader/utils";

export function changeViewHandler(taxon, appStore: AppStoreType) {
  // update store
  removeDefaultTaxonFromStoreAndMap(appStore);
  appStore.selectedTaxa.push(taxon);
  if (appStore.observationsApiParams.taxon_id) {
    let ids = addValueToCommaSeparatedString(
      taxon.id,
      appStore.observationsApiParams.taxon_id,
    );
    appStore.observationsApiParams.taxon_id = ids;
  } else {
    appStore.observationsApiParams.taxon_id = taxon.id.toString();
  }
  // update url
  updateAppUrl(window.location, appStore);
  // update view
  setView("observations", appStore, true);
  // update map tiles
  updateTilesForSelectedTaxaDebounced(appStore);
  // update header count
  window.dispatchEvent(new Event("observationsChange"));
}
