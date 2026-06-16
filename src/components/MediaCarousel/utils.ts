import { leftBigIcon, noPhoto, rightBigIcon } from "../../assets/icons";
import {
  formatTaxonPhotoAltText,
  renderTaxonNames,
} from "../../lib/render_utils";
import type { AppStoreType } from "../../types/app";
import type {
  ObservationPhoto,
  ObservationSound,
  ObservationsResult,
  ObservationTaxon,
} from "../../types/inat_api";

export function renderCarousel(
  observation: ObservationsResult,
  appStore: AppStoreType,
) {
  let photos = observation.photos;
  let sounds = observation.sounds;
  let taxon = observation.taxon;

  let mediaCount = photos.length + sounds.length;

  if (mediaCount === 0) {
    let content = noPhoto;
    return content;
  }

  let content = "";
  content = '<div class="details">';
  content += renderTaxonNames(taxon, appStore);
  content += `<span class="media-count"><span class="current-index">1</span>/${mediaCount}</span>`;
  content += "</div>";

  content += `<div class="media">`;
  if (photos.length > 0) {
    photos.forEach((photo, i) => {
      content += renderPhoto(photo, i, taxon, appStore);
    });
  }

  sounds.forEach((sound, i) => {
    content += renderSound(sound, i + photos.length);
  });

  content += "</div>";
  if (mediaCount > 1) {
    content += renderControls();
  }
  return content;
}

function renderControls() {
  let content = `<div role="group" class="carousel-controls" aria-label="carousel controls">`;
  content += "<div class='item-selector'>";
  content += `<button class="prev-selector" aria-label="Previous slide">${leftBigIcon}</button>`;

  content += `<button class="next-selector" aria-label="Next slide">${rightBigIcon}</button>`;
  content += `</div>`;
  content += "</div>";

  return content;
}

function renderSound(sound: ObservationSound, index: number) {
  let content;
  let url = sound.file_url;
  if (url) {
    content = `<figure ${index > 0 ? "hidden" : ""} data-item-index="${index}" class="carousel-item sound">`;
    content += ` <audio loading="lazy" controls src="${url}"></audio>`;
    content += `<figcaption>`;
    content += `<span>${sound.attribution}</span>`;
    content += `</figcaption>`;
    content += `</figure>`;
  }
  return content;
}

function renderPhoto(
  photo: ObservationPhoto,
  index: number,
  taxon: ObservationTaxon,
  appStore: AppStoreType,
) {
  let content;
  let url = photo.url?.replace("/square.", `/medium.`);
  if (url) {
    let altText = formatTaxonPhotoAltText(taxon, appStore);
    content = `<figure ${index > 0 ? "hidden" : ""} data-item-index="${index}" class="carousel-item">`;
    content += `<img loading="lazy" src="${url}" alt="${altText}">`;
    content += `<figcaption>`;
    content += `<span>${photo.attribution}</span>`;
    content += `</figcaption>`;
    content += `</figure>`;
  }
  return content;
}

export function setCurrentMedia(index: number, componentCtx: HTMLElement) {
  let currentItemContainer = componentCtx.querySelector<HTMLDivElement>(
    `.carousel-item:not([hidden])`,
  );
  if (currentItemContainer) {
    currentItemContainer.hidden = true;
  }
  let itemContainer = componentCtx.querySelector<HTMLDivElement>(
    `.carousel-item[data-item-index='${index}']`,
  );
  if (itemContainer) {
    itemContainer.hidden = false;
  }
  let countEl = componentCtx.querySelector(".current-index");
  if (countEl) {
    countEl.textContent = `${index + 1}`;
  }
}
