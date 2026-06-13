import type { ObservationsResult } from "../../types/inat_api";
import type { DataComponentType, AppStoreType } from "../../types/app";
import {
  renderDates,
  renderMediaCounts,
  renderQualityGrade,
  renderTaxonNames,
  renderUser,
} from "../../lib/render_utils";
import { iNatObservationsUrl } from "../../data/inat_data";
import { setupComponent } from "../../lib/component_utils";

const template = '<div class="card"></div>';

class CardObservation extends HTMLElement {
  constructor() {
    super();
  }

  currentIndex = 0;
  data: ObservationsResult | null = null;
  mediaCount = 0;

  connectedCallback() {
    setupComponent(template, this);
    this.data = (this as DataComponentType).data as ObservationsResult;
    let photosCount = this.data.photos ? this.data.photos.length : 0;
    let soundsCount = this.data.sounds ? this.data.sounds.length : 0;
    this.mediaCount = photosCount + soundsCount;

    this.render(this.data, window.app.store);
  }

  disconnectedCallback() {}

  handleEvent(event: Event) {
    let target = event.target as HTMLInputElement;
    if (!target) return;
  }

  async render(data: ObservationsResult, appStore: AppStoreType) {
    let cardEl = this.querySelector(".card");
    if (!cardEl) return;

    let component = document.createElement(
      "media-carousel",
    ) as DataComponentType;
    component.data = data;
    cardEl.appendChild(component);

    let detailsEl = document.createElement("div");
    detailsEl.className = "details";

    let detailsContent = ``;

    if (data.taxon) {
      detailsContent += renderTaxonNames(
        data.taxon,
        appStore,
        `${iNatObservationsUrl}/${data.id}`,
      );

      // some obsevations do not have taxa info
    } else {
      detailsContent += `<span class="title">`;
      detailsContent += `<a href="${iNatObservationsUrl}/${data.id}">Unknown</a>`;
      detailsContent += "</span>";
    }

    detailsContent += renderMediaCounts(data.photos, data.sounds);

    if (data.user) {
      detailsContent += "<div class='observed-data'>";
      detailsContent += renderUser(data.user);
      detailsContent += renderDates(data);
      detailsContent += "</div>";
    }

    if (data.quality_grade) {
      detailsContent += renderQualityGrade(data.quality_grade);
    }

    if (detailsContent !== "") {
      detailsEl.innerHTML = detailsContent;
      cardEl.appendChild(detailsEl);
    }
  }
}

customElements.define("card-observation", CardObservation);
