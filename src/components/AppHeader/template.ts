import { html } from "../../lib/component_utils";

export const template = html`
  <header>
    <nav class="navbar" id="sitenav">
      <span class="navbar-brand">My site</span>
      <ul class="navbar-nav">
        <li>
          <a href="/" class="navlink" role="menuitem">Home</a>
        </li>
        <li>
          <a href="/about/" class="navlink" role="menuitem">About</a>
        </li>
      </ul>
    </nav>
  </header>
`;
