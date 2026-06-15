import type { ObservationsSpeciesResult } from "../../types/inat_api";
import type { DataComponentType, AppStoreType } from "../../types/app";
import { setupComponent } from "../../lib/component_utils";
import { template } from "./template";
import { changeViewHandler, renderCard } from "./utils";

export class CardSpecies extends HTMLElement {
  constructor() {
    super();
  }

  observationsLink: null | HTMLLinkElement = null;

  connectedCallback() {
    setupComponent(template, this);
    let data = (this as DataComponentType).data as ObservationsSpeciesResult;

    this.render(data, window.app.store);

    this.observationsLink = this.querySelector(".nav-link");

    this.observationsLink?.addEventListener("click", this);
  }

  disconnectedCallback() {
    this.observationsLink?.removeEventListener("click", this);
  }

  handleEvent(event: Event) {
    let target = event.target as HTMLLinkElement;
    if (!target) return;

    let appStore = window.app.store;

    if (event.type === "click") {
      event.preventDefault();
      if (target.className === "nav-link" && target.dataset.taxon) {
        let taxon = JSON.parse(target.dataset.taxon);
        changeViewHandler(taxon, appStore);
      }
    }
  }

  async render(data: ObservationsSpeciesResult, appStore: AppStoreType) {
    renderCard(data, appStore, this);
  }
}

customElements.define("card-species", CardSpecies);
