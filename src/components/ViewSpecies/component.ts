import { setupComponent } from "../../lib/component_utils";
import type { AppStoreType } from "../../types/app";
import { getObservationsSpeciesData } from "../PageHome/data_utils";
import { template } from "./template";
import { renderObservations } from "./utils";

class ViewObservationsSpecies extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    setupComponent(template, this);
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
    let data = await getObservationsSpeciesData(appStore);

    renderObservations(data, appStore);
  }
}

customElements.define("view-species", ViewObservationsSpecies);
