import { setupComponent } from "../../lib/component_utils";
import { updateCountsHeader } from "./utils";
import { template } from "./template";
import type { AppStoreType } from "../../types/app";

class ObservationHeader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    setupComponent(template, this);

    this.render(window.app.store);

    window.addEventListener("popstateAfter", this);
    window.addEventListener("observationsChange", this);
  }

  disconnectedCallback() {
    window.removeEventListener("popstateAfter", this);
    window.removeEventListener("observationsChange", this);
  }

  handleEvent(event: Event) {
    let target = event.target as HTMLElement;
    if (!target) return;

    // update header counts
    // wait for storePopulated event to fetch counts so api request will have
    // correct params
    let updateCountsEvents = ["observationsChange", "popstateAfter"];
    if (updateCountsEvents.includes(event.type)) {
      updateCountsHeader(window.app.store);
    }
  }

  async render(appStore: AppStoreType) {
    updateCountsHeader(appStore);
  }
}

customElements.define("observations-header", ObservationHeader);
