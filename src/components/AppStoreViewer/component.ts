import { setupComponent, html } from "../../lib/component_utils";

export const template = html`
  <div id="display-json">
    <div class="controls"><button>show appstore</button></div>
    <pre id="display-json-wrapper" class="hidden"></pre>
  </div>
`;

export class AppstoreViewer extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    if (import.meta.env?.VITE_DEBUG === "false") {
      return;
    }

    setupComponent(template, this);

    this.render();
  }

  render() {
    let displayJsonWrapperEl = this.querySelector("#display-json-wrapper");

    if (!displayJsonWrapperEl) return;

    let buttonEl = this.querySelector("button");
    if (!buttonEl) return;

    buttonEl.addEventListener("click", () => {
      if (displayJsonWrapperEl.className === "hidden") {
        displayJsonWrapperEl.className = "";
      } else {
        displayJsonWrapperEl.className = "hidden";
      }
    });
  }
}

customElements.define("appstore-viewer", AppstoreViewer);
