import "leaflet/dist/leaflet.css";
import type { Map } from "leaflet";
import "../../assets/autocomplete.css";

import { setupComponent } from "../../lib/component_utils";
import type { AppStoreType } from "../../types/app";
import { template } from "./template";
import { removeMap, renderMap } from "../../lib/map_utils.ts";

class PageHome extends HTMLElement {
  constructor() {
    super();
  }

  map: Map | null = null;

  connectedCallback() {
    setupComponent(template, this);

    this.render(window.app.store);
  }

  disconnectedCallback() {
    removeMap(window.app.store);
  }

  handleEvent(event: CustomEvent) {
    let target = event.target as HTMLInputElement;
    if (!target) return;
    let appStore = window.app.store;
    console.log(appStore);
  }

  async render(appStore: AppStoreType) {
    // render map
    if (!appStore.map) {
      appStore.map = renderMap();
    }
  }
}

customElements.define("page-home", PageHome);
