import { iNatTaxaUrl } from "../../data/inat_data";
import {
  addValueToCommaSeparatedString,
  normalizeTaxonResult,
  removeDefaultTaxonFromStoreAndMap,
} from "../../lib/data_utils";
import {
  renderTaxonDefaultPhoto,
  renderTaxonNames,
} from "../../lib/render_utils";
import { updateTilesForSelectedTaxaDebounced } from "../../lib/search_utils";
import { updateAppUrl } from "../../lib/url_utils";
import { pluralize } from "../../lib/utils";
import type { AppStoreType, NormalizedTaxon } from "../../types/app";
import type { ObservationsSpeciesResult } from "../../types/inat_api";
import { setView } from "../ObservationsHeader/utils";
import type { CardSpecies } from "./component";

export function changeViewHandler(
  taxon: NormalizedTaxon,
  appStore: AppStoreType,
) {
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

export function renderCard(
  data: ObservationsSpeciesResult,
  appStore: AppStoreType,
  componentContext: CardSpecies,
) {
  let photoEl = componentContext.querySelector(".photo") as HTMLLinkElement;
  if (photoEl) {
    let img = renderTaxonDefaultPhoto(data.taxon, appStore, "medium");
    if (img) {
      photoEl.innerHTML = img;
    }
  }

  let mediaEl = componentContext.querySelector(".media") as HTMLLinkElement;
  if (mediaEl) {
    let establishmentMeans =
      data.taxon.establishment_means?.establishment_means;

    if (establishmentMeans) {
      let options = {} as any;
      if (establishmentMeans === "native") {
        options = {
          content: "N",
          tooltip: establishmentMeans,
          id: "tp-native",
          class: "establishment-means native",
        };
      } else if (establishmentMeans === "introduced") {
        options = {
          content: "IN",
          tooltip: establishmentMeans,
          id: "tp-introduced",
          class: "establishment-means introduced",
        };
      } else if (establishmentMeans === "endemic") {
        options = {
          content: "E",
          tooltip: establishmentMeans,
          id: "tp-endemic",
          class: "establishment-means endemic",
        };
      }
      let tooltip = document.createElement("app-tooltip");
      tooltip.className = options.class;
      tooltip.dataset.id = options.id;
      tooltip.dataset.content = options.content;
      tooltip.dataset.tooltip = options.tooltip;

      mediaEl.appendChild(tooltip);
    }
  }

  let detailsEl = componentContext.querySelector(".details");

  if (detailsEl) {
    let content = renderTaxonNames(
      data.taxon,
      appStore,
      `${iNatTaxaUrl}/${data.taxon.id}`,
    );

    let taxonData = normalizeTaxonResult(data.taxon, appStore);
    content += `<span class="observations-count">
        <a class="nav-link" href="/" data-taxon='${JSON.stringify(taxonData)}'>${pluralize(data.count, "observation", true)}</a>
        </span>`;

    detailsEl.innerHTML = content;
  }
}
