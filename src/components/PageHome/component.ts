import "leaflet/dist/leaflet.css";
import type { Map } from "leaflet";
import "../../assets/autocomplete.css";

import { setupComponent } from "../../lib/component_utils";
import type { AppStoreType, ValidViews } from "../../types/app";
import { template } from "./template";
import { removeMap, renderMap } from "../../lib/map_utils.ts";
import { setView } from "./utils.ts";
import { viewComponentObj } from "../../data/app_data.ts";
import { initRenderMap } from "../../lib/init_app.ts";

class PageHome extends HTMLElement {
  constructor() {
    super();
  }

  map: Map | null = null;
  searchCtrlEl: null | HTMLButtonElement = null;
  observationsCtrlEl: null | HTMLButtonElement = null;
  speciesCtrlEl: null | HTMLButtonElement = null;
  viewContainerEl: null | HTMLDivElement = null;

  connectedCallback() {
    setupComponent(template, this);

    this.searchCtrlEl = this.querySelector("#view-search");
    this.observationsCtrlEl = this.querySelector("#view-observations");
    this.speciesCtrlEl = this.querySelector("#view-species");
    this.viewContainerEl = this.querySelector("#view-container");

    this.render(window.app.store);

    this.searchCtrlEl?.addEventListener("click", this);
    this.observationsCtrlEl?.addEventListener("click", this);
    this.speciesCtrlEl?.addEventListener("click", this);
  }

  disconnectedCallback() {
    removeMap(window.app.store);

    this.searchCtrlEl?.removeEventListener("click", this);
    this.observationsCtrlEl?.removeEventListener("click", this);
    this.speciesCtrlEl?.removeEventListener("click", this);
  }

  handleEvent(event: CustomEvent) {
    let target = event.target as HTMLInputElement;
    if (!target) return;
    let appStore = window.app.store;

    if (event.type === "click") {
      let views = ["view-search", "view-observations", "view-species"];
      if (views.includes(target.id)) {
        let view = target.dataset.view as ValidViews;
        if (view) {
          setView(view, appStore, this);
        }
      }
    }
  }

  async render(appStore: AppStoreType) {
    if (!appStore.map.map) {
      let { map, layerControl } = renderMap();
      appStore.map.map = map;
      appStore.map.layerControl = layerControl;
      await initRenderMap(map, appStore);
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
