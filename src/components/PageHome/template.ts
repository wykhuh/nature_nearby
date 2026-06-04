import { html } from "../../lib/component_utils";

export const template = html`
  <app-header></app-header>
  <observations-header></observations-header>
  <div id="map"></div>
  <div id="view-controls">
    <button id="view-search" data-view="search">search</button>
    <button id="view-observations" data-view="observations">observations</button>
    <button id="view-species" data-view="species">species</button>
  </div>
  <div id="view-container"></div>
`;
