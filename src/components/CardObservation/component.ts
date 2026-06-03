import type { ObservationsResult } from "../../types/inat_api";
import type { DataComponentType, AppStoreType } from "../../types/app";
import {
  renderDates,
  renderMedia,
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

  connectedCallback() {
    this.render();

    window.addEventListener("observationsDisplayFieldsChanged", this);
  }

  disconnectedCallback() {
    window.removeEventListener("observationsDisplayFieldsChanged", this);
  }

  handleEvent() {
    this.renderCard(window.app.store);
  }

  async render() {
    setupComponent(template, this);

    this.renderCard(window.app.store);
  }

  renderCard(appStore: AppStoreType) {
    let cardEl = this.querySelector(".card");
    if (!cardEl) return;

    let data = (this as DataComponentType).data as ObservationsResult;

    cardEl.innerHTML = "";
    let url = `${iNatObservationsUrl}/${data.id}`;
    cardEl.innerHTML = renderMedia(
      url,
      data.taxon,
      data.photos,
      data.sounds,
      appStore,
    );

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
