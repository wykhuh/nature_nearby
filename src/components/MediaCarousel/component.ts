import { html, setupComponent } from "../../lib/component_utils";
import type { AppStoreType, DataComponentType } from "../../types/app";
import type { ObservationsResult } from "../../types/inat_api";
import { renderCarousel, setCurrentMedia } from "./utils";

const template = html` <div
  id="carousel"
  role="region"
  aria-roledescription="carousel"
  aria-label="Observation's Photos and Sounds"
></div>`;

class MediaCarousel extends HTMLElement {
  constructor() {
    super();
  }

  prevEl: HTMLButtonElement | null = null;
  nextEl: HTMLButtonElement | null = null;
  currentIndex = 0;
  observation: ObservationsResult | null = null;
  mediaCount = 0;

  connectedCallback() {
    setupComponent(template, this);
    this.observation = (this as DataComponentType).data;
    if (!this.observation) return;

    let photosCount = this.observation.photos
      ? this.observation.photos.length
      : 0;
    let soundsCount = this.observation.sounds
      ? this.observation.sounds.length
      : 0;
    this.mediaCount = photosCount + soundsCount;

    this.render(window.app.store);

    this.prevEl?.addEventListener("click", this);
    this.nextEl?.addEventListener("click", this);
  }

  disconnectedCallback() {
    this.prevEl?.removeEventListener("click", this);
    this.nextEl?.removeEventListener("click", this);
  }

  handleEvent(event: Event) {
    let target = event.target as HTMLInputElement;
    if (!target) return;

    if (event.type === "click") {
      if (target.className === "prev-selector") {
        if (this.currentIndex === 0) return;
        this.currentIndex -= 1;
        setCurrentMedia(this.currentIndex, this);
        this.updateCarouselState();
      } else if (target.className === "next-selector") {
        if (this.currentIndex === this.mediaCount - 1) return;
        this.currentIndex += 1;
        setCurrentMedia(this.currentIndex, this);
        this.updateCarouselState();
      }
    }
  }

  async render(appStore: AppStoreType) {
    if (!this.observation) return;

    let content = renderCarousel(this.observation, appStore);
    this.innerHTML = content;

    this.updateCarouselState();
  }

  updateCarouselState() {
    if (this.prevEl === null) {
      this.prevEl = this.querySelector(".prev-selector");
      this.nextEl = this.querySelector(".next-selector");
    }
    if (!this.prevEl) return;
    if (!this.nextEl) return;

    // update prev/next
    if (this.currentIndex === 0) {
      this.prevEl.disabled = true;
    } else {
      this.prevEl.disabled = false;
    }
    if (this.currentIndex === this.mediaCount - 1) {
      this.nextEl.disabled = true;
    } else {
      this.nextEl.disabled = false;
    }

    // update current item
    let oldCurrent = this.querySelector(".carousel-item-selector.current");
    if (oldCurrent) {
      oldCurrent.classList.remove("current");
    }

    let newCurrent = this.querySelector(
      `.carousel-item-selector[data-item-index="${this.currentIndex}"]`,
    );

    if (newCurrent) {
      newCurrent.classList.add("current");
    }
  }
}

customElements.define("media-carousel", MediaCarousel);
