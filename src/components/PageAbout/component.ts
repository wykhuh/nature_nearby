import { setupComponent } from "../../lib/component_utils";
// @ts-ignore
import template from "./template.md";

class PageAbout extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    setupComponent(template, this);
  }
}

customElements.define("page-about", PageAbout);
