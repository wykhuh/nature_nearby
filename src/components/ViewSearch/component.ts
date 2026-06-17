import { setupComponent } from "../../lib/component_utils";
import {
  addCurrentPlaceToMapAndStore,
  currentLocationHandler,
} from "../../lib/search_current_place";
import {
  placeSelectedHandler,
  setupPlacesSearch,
} from "../../lib/search_places";
import { setupTaxaSearch, taxonSelectedHandler } from "../../lib/search_taxa";
import {
  setupUnobservedByUserSearch,
  unobservedByUserSelectedHandler,
} from "../../lib/search_unobserved";
import { debouncePromise } from "../../lib/utils";
import type { AppStoreType } from "../../types/app";
import {
  renderSelectedMoreFiltersList,
  renderSelectedFiltersList,
} from "./render_utils";
import { updateAppWithFormData } from "./shared_utils";
import { template } from "./template";
import {
  initFilters,
  presetDatesHandler,
  resetFormHandler,
  showMoreOptionsHandler,
} from "./utils";

export class ViewSearch extends HTMLElement {
  constructor() {
    super();
  }

  formEl: null | HTMLFormElement = null;
  currentLocationEl: null | HTMLButtonElement = null;
  searchPlacesInputEl: HTMLInputElement | null = null;
  searchSpeciesInputEl: HTMLInputElement | null = null;
  searchUnobservedInputEl: HTMLInputElement | null = null;
  moreOptionsButton: HTMLButtonElement | null = null;
  moreOptionsContainer: HTMLDivElement | null = null;
  showMoreOptions = false;
  moreFilterContainer: HTMLDivElement | null = null;
  latitudeEl: HTMLInputElement | null = null;
  longitudeEl: HTMLInputElement | null = null;
  radiusEl: HTMLInputElement | null = null;

  connectedCallback() {
    setupComponent(template, this);
    this.formEl = this.querySelector("#observations-form") as HTMLFormElement;
    this.searchPlacesInputEl = document.querySelector("#search-places");
    this.searchSpeciesInputEl = document.querySelector("#search-taxa");
    this.searchUnobservedInputEl = document.querySelector(
      "#search-unobserved-by-user",
    );
    this.currentLocationEl = document.querySelector("#current-location");
    this.moreOptionsButton = document.querySelector("#more-options");
    this.moreOptionsContainer = document.querySelector(
      "#more-options-container",
    );
    this.moreFilterContainer = document.querySelector(".more-filters-list");
    this.latitudeEl = this.querySelector<HTMLInputElement>("#lat");
    this.longitudeEl = this.querySelector<HTMLInputElement>("#lng");
    this.radiusEl = this.querySelector<HTMLInputElement>("#radius");

    this.render(window.app.store);

    this.formEl?.addEventListener("input", this);
    this.formEl?.addEventListener("reset", this);
    this.searchPlacesInputEl?.addEventListener("selection", this);
    this.searchSpeciesInputEl?.addEventListener("selection", this);
    this.searchUnobservedInputEl?.addEventListener("selection", this);
    this.currentLocationEl?.addEventListener("click", this);
    this.moreOptionsButton?.addEventListener("click", this);
  }

  disconnectedCallback() {
    this.formEl?.removeEventListener("input", this);
    this.formEl?.removeEventListener("reset", this);
    this.searchPlacesInputEl?.removeEventListener("selection", this);
    this.searchSpeciesInputEl?.removeEventListener("selection", this);
    this.searchUnobservedInputEl?.removeEventListener("selection", this);
    this.currentLocationEl?.removeEventListener("click", this);
    this.moreOptionsButton?.removeEventListener("click", this);
  }

  handleEvent(event: CustomEvent) {
    let target = event.target as HTMLInputElement;
    if (!target) return;
    if (!this.formEl) return;
    if (!this.currentLocationEl) return;
    if (!this.moreOptionsContainer) return;
    if (!this.moreOptionsButton) return;
    if (!this.moreFilterContainer) return;

    let appStore = window.app.store;
    if (event.type === "click") {
      event.preventDefault();

      if (target.name === "current-location") {
        currentLocationHandler(appStore, this);
      } else if (target.id === "more-options") {
        showMoreOptionsHandler(this);
      }
    }

    if (event.type === "input") {
      let searches = [
        "search-places",
        "search-taxa",
        "search-unobserved-by-user",
      ];
      // use formChangeHandler to clear search input; use autocomplete to select record
      if (searches.includes(target.id)) {
        if (target.value === "") {
          this.formChangeHandlerDebounced(this.formEl);
        }
      } else if (target.id === "presetDates") {
        presetDatesHandler(
          target as unknown as HTMLSelectElement,
          this.formEl,
          appStore,
        );
      } else {
        this.formChangeHandlerDebounced(this.formEl).then(() => {
          addCurrentPlaceToMapAndStore(appStore);
        });
      }
    }

    if (event.type === "reset") {
      resetFormHandler(appStore);
    }

    // when search item is selected
    if (event.type === "selection") {
      let record = event.detail.selection.value;
      if (target.id === "search-places") {
        placeSelectedHandler(record, appStore);
      } else if (target.id === "search-taxa") {
        taxonSelectedHandler(record, appStore);
      } else if (target.id === "search-unobserved-by-user") {
        unobservedByUserSelectedHandler(record, appStore);
      }
    }
  }

  async render(appStore: AppStoreType) {
    initFilters(appStore);

    setupPlacesSearch("#search-places");
    setupTaxaSearch("#search-taxa", appStore);
    setupUnobservedByUserSearch("#search-unobserved-by-user");
    renderSelectedFiltersList(appStore);
    renderSelectedMoreFiltersList(appStore);
  }

  formChangeHandlerDebounced = debouncePromise(this.formChangeHandler);

  async formChangeHandler(form: HTMLFormElement) {
    const data = new FormData(form);

    await updateAppWithFormData(data, window.app.store);
  }
}

customElements.define("view-search", ViewSearch);
