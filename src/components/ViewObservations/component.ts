import { setupComponent } from "../../lib/component_utils";
import { createSpinner } from "../../lib/spinner";
import type { AppStoreType } from "../../types/app";
import { getObservationsData } from "../PageHome/data_utils";
import { template } from "./template";
import { renderObservations } from "./util";

class ViewObservations extends HTMLElement {
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
    let data = await getObservationsData(appStore);
    spinner.stop();

    renderObservations(data, appStore);
  }
}

customElements.define("view-observations", ViewObservations);
