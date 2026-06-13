import { leftBigIcon, noPhoto, rightBigIcon } from "../../assets/icons";
import { formatTaxonPhotoAltText } from "../../lib/render_utils";
import { range } from "../../lib/utils";
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
  content += renderControls(taxon, mediaCount);

  return content;
}

function renderControls(taxon: ObservationTaxon, mediaCount: number) {
  let content = `<div role="group" class="carousel-controls" aria-label="carousel controls">`;
  content += "<div class='item-selector'>";
  content += `<button class="prev-selector" aria-label="Previous slide">${leftBigIcon}</button>`;

  content += "<div>";
  range(0, mediaCount - 1).forEach((num) => {
    let classnames = ["carousel-item-selector"];
    if (num == 0) {
      classnames.push("current");
    }
    content += `<button
      class="${classnames.join(" ")}"
      data-item-index="${num}"
      data-item-id="${taxon.id}"
      aria-disabled="${num === 0 ? true : false}">
        <span class="sr-only">Show slide ${num + 1} of ${mediaCount + 1}: ${taxon.name}</span>
        ${num + 1}
      </button>`;
  });
  content += "</div>";

  content += `<button class="next-selector" aria-label="Next slide">${rightBigIcon}</button>`;
  content += `</div>`;
  content += "</div>";

  return content;
}

function renderSound(sound: ObservationSound, index: number) {
  let content = `<div ${index > 0 ? "hidden" : ""} data-item-index="${index}" class="carousel-item media sound">`;
  let url = sound.file_url;
  if (url) {
    content += ` <audio controls src="${url}"></audio>`;
  }
  content += "</div>";
  return content;
}

function renderPhoto(
  photo: ObservationPhoto,
  index: number,
  taxon: ObservationTaxon,
  appStore: AppStoreType,
) {
  let content = "";
  let url = photo.url?.replace("/square.", `/medium.`);
  if (url) {
    let altText = formatTaxonPhotoAltText(taxon, appStore);
    content += `<img ${index > 0 ? "hidden" : ""} data-item-index="${index}" class="carousel-item" src="${url}" alt="${altText}">`;
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
}
