import { setupComponent } from "../../lib/component_utils";
import type { AppStoreType, DataComponentType } from "../../types/app";
import { getObservationsSpeciesData } from "../PageHome/data_utils";
import { template } from "./template";

class ViewObservationsSpecies extends HTMLElement {
  constructor() {
    super();
  }

  containerEl: null | HTMLDivElement = null;

  connectedCallback() {
    setupComponent(template, this);
    this.containerEl = this.querySelector("#observations-species-grid");
    this.render(window.app.store);
  }

  disconnectedCallback() {}

  handleEvent(event: CustomEvent) {
    let target = event.target as HTMLInputElement;
    if (!target) return;
    let appStore = window.app.store;
    console.log(appStore);
  }

  async render(appStore: AppStoreType) {
    let results = await getObservationsSpeciesData(appStore);

    if (results) {
      results.forEach((result) => {
        let component = document.createElement(
          "card-species",
        ) as DataComponentType;
        component.data = result;
        this.containerEl?.appendChild(component);
      });
    }
  }
}

customElements.define("view-species", ViewObservationsSpecies);
