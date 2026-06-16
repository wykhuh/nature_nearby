import { square } from "../../assets/icons";
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

class IconSquare extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = square;
  }
}

customElements.define("icon-square", IconSquare);
