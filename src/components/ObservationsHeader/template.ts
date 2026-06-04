import { html } from "../../lib/component_utils";

export const observationsHeaderLinks = html`
  <ul class="observations-stats">
    <li id="observations_observations" data-count-label="observations_observations">
      <span class="header-count">&nbsp;</span><span>Observations</span>
    </li>
    <li id="observations_species" data-count-label="observations_species">
      <span class="header-count">&nbsp;</span><span id="observations_species_label">Species</span>
    </li>
  </ul>
`;

export const template = html`
  <div id="observations-header">
    <nav id="observations-nav">${observationsHeaderLinks}</nav>
  </div>
`;
