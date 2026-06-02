import { setupComponent } from "../../lib/component_utils";
import { template } from "./template";
import { pageChangeHandler } from "./utils";

class AppHeader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    setupComponent(template, this);

    this.querySelectorAll("a.navlink").forEach((a) => {
      a.addEventListener("click", this);
    });
  }

  disconnectedCallback() {
    this.querySelectorAll("a.navlink").forEach((a) => {
      a.removeEventListener("click", this);
    });
  }

  handleEvent(event: CustomEvent) {
    let target = event.target as HTMLDivElement;
    if (!target) return;

    if (event.type === "click") {
      event.preventDefault();
      if (target.className === "navlink") {
        pageChangeHandler(event, window.app.store, window.app.router);
      }
    }
  }
}

customElements.define("app-header", AppHeader);
