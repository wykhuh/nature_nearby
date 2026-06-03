import { setupComponent } from "../../lib/component_utils";
import type { AppStoreType, DataComponentType } from "../../types/app";
import { getObservationsData } from "../PageHome/data_utils";
import { template } from "./template";

class ViewObservations extends HTMLElement {
  constructor() {
    super();
  }

  containerEl: null | HTMLDivElement = null;

  connectedCallback() {
    setupComponent(template, this);
    this.containerEl = this.querySelector("#observations-grid");
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
    let results = await getObservationsData(appStore);
    if (results) {
      results.forEach((result) => {
        let component = document.createElement(
          "card-observation",
        ) as DataComponentType;
        component.data = result;
        this.containerEl?.appendChild(component);
      });
    }
  }
}

customElements.define("view-observations", ViewObservations);
