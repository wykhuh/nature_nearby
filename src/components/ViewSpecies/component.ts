import { setupComponent } from "../../lib/component_utils";
import { createSpinner } from "../../lib/spinner";
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
  }

  async render(appStore: AppStoreType) {
    let spinner = createSpinner(".obs-loader");
    spinner.start();
    let data = await getObservationsSpeciesData(appStore);
    spinner.stop();

    renderObservations(data, appStore);
  }
}

customElements.define("view-species", ViewObservationsSpecies);
