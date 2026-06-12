import { search } from "../../assets/icons";
import { html } from "../../lib/component_utils";

export const observationsHeaderLinks = html`
  <ul>
    <li>
      <button data-view="search">${search}Search</button>
    </li>
    <li>
      <button data-view="observations">
        <span data-count-label="observations" class="header-count">&nbsp;</span
        ><span>Observations</span>
      </button>
    </li>
    <li>
      <button data-view="species">
        <span data-count-label="species" class="header-count">&nbsp;</span
        ><span>Species</span>
      </button>
    </li>
  </ul>
`;

export const template = html`
  <div id="observations-header">
    <nav id="observations-nav">${observationsHeaderLinks}</nav>
  </div>
`;
