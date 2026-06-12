import { setupComponent } from "../../lib/component_utils";
import { initFilters, setView, updateCountsHeader } from "./utils";
import { template } from "./template";
import type { AppStoreType, ValidViews } from "../../types/app";

export class ObservationHeader extends HTMLElement {
  constructor() {
    super();
  }

  searchCtrlEl: null | HTMLButtonElement = null;
  observationsCtrlEl: null | HTMLButtonElement = null;
  speciesCtrlEl: null | HTMLButtonElement = null;

  connectedCallback() {
    setupComponent(template, this);

    this.render(window.app.store);

    this.searchCtrlEl = this.querySelector("#view-search");
    this.observationsCtrlEl = this.querySelector("#view-observations");
    this.speciesCtrlEl = this.querySelector("#view-species");

    window.addEventListener("popstateAfter", this);
    window.addEventListener("observationsChange", this);
    document
      .querySelectorAll("#observations-header button")
      .forEach((button) => {
        button.addEventListener("click", this);
      });
  }

  disconnectedCallback() {
    window.removeEventListener("popstateAfter", this);
    window.removeEventListener("observationsChange", this);
    document
      .querySelectorAll("#observations-header button")
      .forEach((button) => {
        button.removeEventListener("click", this);
      });
  }

  handleEvent(event: Event) {
    let target = event.target as HTMLElement;
    if (!target) return;

    // update header counts
    // wait for storePopulated event to fetch counts so api request will have
    // correct params
    let updateCountsEvents = ["observationsChange", "popstateAfter"];
    if (updateCountsEvents.includes(event.type)) {
      updateCountsHeader(window.app.store);
    }

    if (event.type === "click") {
      event.preventDefault();

      let view = target.dataset.view || target.closest("button")?.dataset.view;
      if (view) {
        setView(view as ValidViews, window.app.store);
      }
    }
  }

  async render(appStore: AppStoreType) {
    updateCountsHeader(appStore);
    initFilters(appStore, this);
  }
}

customElements.define("observations-header", ObservationHeader);
