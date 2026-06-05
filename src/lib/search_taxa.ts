import autoComplete from "@tarekraafat/autocomplete.js";

import type {
  NormalizedTaxon,
  AutoCompleteEventType,
  AppStoreType,
  DataComponentType,
} from "../types/app.d.ts";
import { getAutocompleteTaxa } from "../lib/inat_api.ts";
import type { iNatAutocompleteTaxaAPI } from "../types/inat_api";
import {
  addDefaultTaxonToStoreAndMap,
  addValueToCommaSeparatedString,
  formatTaxonName,
  normalizeTaxonResult,
  removeDefaultTaxonFromStoreAndMap,
  removeIdfromInatApiParams,
  resetPageNumber,
} from "./data_utils.ts";

import { renderTaxonNames } from "./render_utils";
import { getColor, appColorSchemes } from "./map_colors_utils.ts";
import {
  renderSelectedResources,
  showHideHeader,
  updateTilesForSelectedTaxa,
} from "./search_utils.ts";

export function setupTaxaSearch(selector: string, appStore: AppStoreType) {
  const autoCompleteTaxaJS = new autoComplete({
    autocomplete: "off",
    selector: selector,
    placeHolder: "Enter species name",
    threshold: 2,
    searchEngine: (query: string, record: NormalizedTaxon) => {
      return renderAutocompleteTaxon(record, query, appStore);
    },
    data: {
      src: async (query: string) => {
        try {
          let data = await getAutocompleteTaxa(
            query,
            appStore.observationsApiParams.locale,
          );
          return processAutocompleteTaxa(data, query, appStore);
        } catch (error) {
          console.error("setupTaxaSearch ERROR:", error);
        }
      },
    },
    resultsList: {
      maxResults: 50,
    },
    events: {
      input: {
        selection: (event: AutoCompleteEventType) => {
          const selection = event.detail.selection.value as NormalizedTaxon;
          autoCompleteTaxaJS.input.value = selection.title;
        },
      },
    },
  });

  return autoCompleteTaxaJS;
}

export function processAutocompleteTaxa(
  response: iNatAutocompleteTaxaAPI,
  query: string,
  appStore: AppStoreType,
): NormalizedTaxon[] {
  let taxa = response.results.map((result) => {
    normalizeTaxonResult(result, appStore);
    let data: NormalizedTaxon = {
      name: result.name,
      default_photo: result.default_photo?.square_url,
      preferred_common_name: result.preferred_common_name,
      matched_term: result.matched_term,
      rank: result.rank,
      id: result.id,
    };
    let { title, subtitle } = formatTaxonName(data, appStore, query);
    // title is the value shown in the input
    data.title = title || subtitle;

    return data;
  });

  return taxa;
}

export function renderAutocompleteTaxon(
  item: NormalizedTaxon,
  inputValue: string,
  appStore: AppStoreType,
): string {
  let html = `
  <div class="taxa-ac-option" data-testid="taxa-ac-option">
    <div class="thumbnail">`;

  if (item.default_photo) {
    html += `
      <img class="thumbnail" src="${item.default_photo}" alt="">`;
  } else {
  }

  let url = undefined;
  html += `
    </div>
    <div class="taxon-name">
      ${renderTaxonNames(item, appStore, url, inputValue, false)}
    </div>
  </div>`;

  return html;
}
// called by autocomplete search when an taxa option is selected
export async function taxonSelectedHandler(
  selection: NormalizedTaxon,
  appStore: AppStoreType,
) {
  // remove default taxon

  if (appStore.observationsApiParams.taxon_id === "0") {
    removeDefaultTaxonFromStoreAndMap(appStore);
  }

  let { title, subtitle } = formatTaxonName(selection, appStore);
  let color = getColor(appStore, appColorSchemes[appStore.primaryColorScheme]);

  // save taxa to store
  let taxon = {
    ...selection,
    title,
    subtitle,
    color,
  };

  appStore.selectedTaxa = [...appStore.selectedTaxa, taxon];
  resetPageNumber(appStore);

  appStore.observationsApiParams = {
    ...appStore.observationsApiParams,
    taxon_id: addValueToCommaSeparatedString(
      taxon.id,
      appStore.observationsApiParams.taxon_id,
    ),
    colors: addValueToCommaSeparatedString(
      taxon.color,
      appStore.observationsApiParams.colors,
    ),
  };

  appStore.color = color;

  await updateTilesForSelectedTaxa(appStore);
  renderSelectedResources(appStore, true);
}

export function showHideTaxaHeader() {
  showHideHeader("#sidebar-menu .taxa-heading", "selectedTaxa");
}

export function renderTaxaList(appStore: AppStoreType) {
  let listEl = document.querySelector("#selected-species-list");
  if (!listEl) return;

  let element = "species-list-item";

  listEl.innerHTML = "";
  appStore.selectedTaxa.forEach((taxon) => {
    let templateEl = document.createElement(element) as DataComponentType;
    templateEl.data = taxon;
    templateEl.type = "taxon";
    listEl.appendChild(templateEl);
  });
}

// called when user deletes a taxon.
// use debounce so if people quickly remove multiple items, app only calls API once
export async function removeTaxon(taxonId: number, appStore: AppStoreType) {
  removeOneTaxonFromMap(appStore, taxonId);
  removeOneTaxonFromStore(appStore, taxonId);

  // if no selected taxa, load allTaxaRecord
  if (appStore.selectedTaxa.length === 0) {
    await addDefaultTaxonToStoreAndMap(appStore);
  }

  renderSelectedResources(appStore, true);
}

export function removeOneTaxonFromStore(
  appStore: AppStoreType,
  taxonId: number,
) {
  appStore.selectedTaxa = appStore.selectedTaxa.filter(
    (taxon) => taxon.id !== taxonId,
  );

  resetPageNumber(appStore);
  removeIdfromInatApiParams(appStore, "selectedTaxa", taxonId);
}

export function removeOneTaxonFromMap(appStore: AppStoreType, taxonId: number) {
  if (!appStore.taxaMapLayers) return;
  let mapLayers = appStore.taxaMapLayers[taxonId];
  if (!mapLayers) return;
  let layerControl = appStore.map.layerControl;
  if (!layerControl) return;

  mapLayers.forEach((layer) => {
    // remove layer from layer control
    layerControl.removeLayer(layer);
    // remove layer from map
    layer.remove();
  });

  delete appStore.taxaMapLayers[taxonId];
  // HACK: trigger change in proxy store
  appStore.taxaMapLayers = appStore.taxaMapLayers;
}
