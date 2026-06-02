import { setupComponent } from "../../lib/component_utils";
import type { AppStoreType } from "../../types/app";
import { template } from "./template";

class ViewSpecies extends HTMLElement {
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

  async render(_appStore: AppStoreType) {}
}

customElements.define("view-species", ViewSpecies);
