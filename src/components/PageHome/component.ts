import "leaflet/dist/leaflet.css";
import type { Map } from "leaflet";
import "../../assets/autocomplete.css";

import { setupComponent } from "../../lib/component_utils";
import type { AppStoreType } from "../../types/app";
import { template } from "./template";
import { clearMapLayers, removeMap, renderMap } from "../../lib/map_utils.ts";
import { viewComponentObj } from "../../data/app_data.ts";
import { initPopulateMap } from "../../lib/init_app.ts";
import { renderDemoLayers } from "../../lib/dev_utils.ts";

class PageHome extends HTMLElement {
  constructor() {
    super();
  }

  map: Map | null = null;
  viewContainerEl: null | HTMLDivElement = null;

  connectedCallback() {
    setupComponent(template, this);

    this.viewContainerEl = this.querySelector("#view-container");

    this.render(window.app.store);
  }

  disconnectedCallback() {
    removeMap(window.app.store);
    clearMapLayers(window.app.store);
  }

  handleEvent(event: CustomEvent) {
    let target = event.target as HTMLInputElement;
    if (!target) return;
  }

  async render(appStore: AppStoreType) {
    if (!appStore.map.map) {
      let { map, terraDraw, layerControl } = renderMap();
      await initPopulateMap(map, terraDraw, layerControl, appStore);

      if (import.meta.env?.VITE_MAP_DEBUG === "true") {
        renderDemoLayers(map);
      }
    }
    if (!this.viewContainerEl) return;
    if (!appStore.currentView) return;

    let component = document.createElement(
      viewComponentObj[appStore.currentView],
    );
    this.viewContainerEl.appendChild(component);
  }
}

customElements.define("page-home", PageHome);
