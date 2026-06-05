import { x } from "../../assets/icons";
import { formatTaxonName } from "../../lib/data_utils";
import { removePlace } from "../../lib/search_places";
import { removeTaxon } from "../../lib/search_taxa";
import type {
  AppStoreType,
  DataComponentType,
  NormalizedPlace,
  NormalizedTaxon,
  ObservationsApiParamsKeysType,
} from "../../types/app";
import { updateAppState } from "../ViewSearch/shared_utils";
import { deleteFilter } from "./utils";

type ParamsType = {
  field: ObservationsApiParamsKeysType;
  value: string;
};
class SelectedFiltersItem extends HTMLElement {
  constructor() {
    super();
  }

  data: undefined | NormalizedTaxon | NormalizedTaxon | ParamsType = undefined;
  type: undefined | string = undefined;
  buttonEl: null | HTMLButtonElement = null;

  connectedCallback() {
    this.data = (this as DataComponentType).data;
    this.type = (this as DataComponentType).type;

    if (this.type === "taxon") {
      this.renderTaxon(this.data as NormalizedTaxon, window.app.store);
    } else if (this.type === "place") {
      this.renderPlace(this.data as NormalizedPlace);
    } else {
      this.render(this.data as ParamsType);
    }

    this.buttonEl = this.querySelector(".close-button");

    this.buttonEl?.addEventListener("click", this);
  }

  disconnectedCallback() {
    this.buttonEl?.removeEventListener("click", this);
  }

  handleEvent(event: Event) {
    if (event.type === "click") {
      debugger;
      if (this.type === "taxon") {
        removeTaxon(
          Number((this.data as NormalizedTaxon).id),
          window.app.store,
        );
        this.innerHTML = "";
        updateAppState(window.app.store);
      } else if (this.type === "place") {
        removePlace(
          Number((this.data as NormalizedPlace).id),
          window.app.store,
        );
        this.innerHTML = "";
        updateAppState(window.app.store);
      } else {
        deleteFilter(
          (this.data as ParamsType).field,
          (this.data as ParamsType).value,
          window.app.store,
        );
      }
    }
  }

  render(data: ParamsType) {
    let itemEl = document.createElement("li");
    itemEl.textContent = `${data.field}=${data.value}`;
    let button = document.createElement("button");
    button.innerHTML = x;
    button.className = "close-button";
    button.dataset.testid = "filter-list-item-close";

    itemEl.appendChild(button);
    this.appendChild(itemEl);
  }

  renderTaxon(taxon: NormalizedTaxon, appStore: AppStoreType) {
    let itemEl = document.createElement("li");
    let { title, subtitle } = formatTaxonName(taxon, appStore);
    itemEl.textContent = subtitle ? `${title} (${subtitle})` : `${title}`;
    let button = document.createElement("button");
    button.innerHTML = x;
    button.className = "close-button";
    button.dataset.testid = "filter-list-item-close";

    itemEl.appendChild(button);
    this.appendChild(itemEl);
  }

  renderPlace(place: NormalizedPlace) {
    let itemEl = document.createElement("li");
    itemEl.textContent = `${place.name}`;
    let button = document.createElement("button");
    button.innerHTML = x;
    button.className = "close-button";
    button.dataset.testid = "filter-list-item-close";

    itemEl.appendChild(button);
    this.appendChild(itemEl);
  }
}

customElements.define("selected-filters-item", SelectedFiltersItem);
