import { setupComponent } from "../../lib/component_utils";
import { getLatLong } from "../../lib/geolocation";
import {
  placeSelectedHandler,
  setupPlacesSearch,
} from "../../lib/search_places";
import { setupTaxaSearch, taxonSelectedHandler } from "../../lib/search_taxa";
import { updateAppUrl } from "../../lib/url_utils";
import { debounce } from "../../lib/utils";
import type { AppStoreType } from "../../types/app";
import {
  renderSelectedMoreFiltersList,
  renderSelectedFiltersList,
} from "./render_utils";
import { updateAppWithFormData } from "./shared_utils";
import { template } from "./template";
import { initFilters, presetDatesHandler, resetFormHandler } from "./utils";

class ViewSearch extends HTMLElement {
  constructor() {
    super();
  }

  formEl: null | HTMLFormElement = null;
  nearbyObservationsEl: null | HTMLButtonElement = null;
  searchPlacesInputEl: HTMLInputElement | null = null;
  searchSpeciesInputEl: HTMLInputElement | null = null;
  moreOptionsButton: HTMLButtonElement | null = null;
  moreOptionsContainer: HTMLDivElement | null = null;
  showMoreOptions = false;
  moreFilterContainer: HTMLDivElement | null = null;

  connectedCallback() {
    setupComponent(template, this);
    this.formEl = this.querySelector("#observations-form") as HTMLFormElement;
    this.searchPlacesInputEl = document.querySelector("#search-places");
    this.searchSpeciesInputEl = document.querySelector("#search-taxa");
    this.nearbyObservationsEl = document.querySelector("#nearby-observations");
    this.moreOptionsButton = document.querySelector("#more-options");
    this.moreOptionsContainer = document.querySelector(
      "#more-options-container",
    );
    this.moreFilterContainer = document.querySelector(".more-filters-list");

    this.render(window.app.store);

    this.formEl?.addEventListener("input", this);
    this.formEl?.addEventListener("reset", this);
    this.searchPlacesInputEl?.addEventListener("selection", this);
    this.searchSpeciesInputEl?.addEventListener("selection", this);
    this.nearbyObservationsEl?.addEventListener("click", this);
    this.moreOptionsButton?.addEventListener("click", this);
  }

  disconnectedCallback() {
    this.formEl?.removeEventListener("input", this);
    this.formEl?.removeEventListener("reset", this);
    this.searchPlacesInputEl?.removeEventListener("selection", this);
    this.searchSpeciesInputEl?.removeEventListener("selection", this);
    this.nearbyObservationsEl?.removeEventListener("click", this);
    this.moreOptionsButton?.removeEventListener("click", this);
  }

  handleEvent(event: CustomEvent) {
    let target = event.target as HTMLInputElement;
    if (!target) return;
    if (!this.formEl) return;
    if (!this.nearbyObservationsEl) return;
    if (!this.moreOptionsContainer) return;
    if (!this.moreOptionsButton) return;
    if (!this.moreFilterContainer) return;

    let appStore = window.app.store;
    if (event.type === "click") {
      if (target.name === "nearby-observations") {
        event.preventDefault();
        this.setNearbyObservations(event);
      } else if (target.id === "more-options") {
        this.showMoreOptions = !this.showMoreOptions;
        if (this.showMoreOptions) {
          this.moreOptionsButton.textContent = "Less Options";
          this.moreOptionsContainer.classList.remove("hidden");
          this.moreFilterContainer.classList.remove("hidden");
        } else {
          this.moreOptionsButton.textContent = "More Options";
          this.moreOptionsContainer.classList.add("hidden");
          this.moreFilterContainer.classList.add("hidden");
        }
      }
    }

    if (event.type === "input") {
      let searches = ["search-places", "search-taxa"];
      // use formChangeHandler to clear search input; use autocomplete to select record
      if (searches.includes(target.id)) {
        if (target.value === "") {
          this.formChangeHandlerDebounced(event, this.formEl);
        }
      } else if (target.id === "presetDates") {
        presetDatesHandler(
          target as unknown as HTMLSelectElement,
          this.formEl,
          appStore,
        );
      } else {
        this.formChangeHandlerDebounced(event, this.formEl);
      }
    }

    if (event.type === "reset") {
      resetFormHandler(appStore);
    }

    // when search item is selected
    if (event.type === "selection") {
      let record = event.detail.selection.value;
      if (target.id === "search-places") {
        placeSelectedHandler(record, appStore).then(() => {
          renderSelectedFiltersList(appStore);
          updateAppUrl(window.location, appStore);
        });
      } else if (target.id === "search-taxa") {
        taxonSelectedHandler(record, appStore).then(() => {
          renderSelectedFiltersList(appStore);
          updateAppUrl(window.location, appStore);
        });
      }
    }
  }

  async render(appStore: AppStoreType) {
    initFilters(appStore);

    setupPlacesSearch("#search-places");
    setupTaxaSearch("#search-taxa", appStore);
    renderSelectedFiltersList(appStore);
    renderSelectedMoreFiltersList(appStore);
  }

  formChangeHandlerDebounced = debounce(this.formChangeHandler);

  async formChangeHandler(event: Event, form: HTMLFormElement) {
    event.preventDefault();

    const data = new FormData(form);

    await updateAppWithFormData(data, window.app.store);
  }

  async setNearbyObservations(event: Event) {
    let data = await getLatLong();

    if (data) {
      let latitudeEl = this.querySelector<HTMLInputElement>("#lat");
      if (latitudeEl) {
        latitudeEl.value = data.coords.latitude.toString();
      }
      let longitudeEl = this.querySelector<HTMLInputElement>("#lng");
      if (longitudeEl) {
        longitudeEl.value = data.coords.longitude.toString();
      }

      this.formChangeHandlerDebounced(event, this.formEl);
    }
  }
}

customElements.define("view-search", ViewSearch);
