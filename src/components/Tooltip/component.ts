export class Tooltip extends HTMLElement {
  constructor() {
    super();
  }

  content = "";
  tooltip = "";
  id = "";

  connectedCallback() {
    this.content =
      this.getAttribute("data-content") || "Tooltip content not defined";
    this.tooltip = this.getAttribute("data-tooltip") || "Tooltip not defined";
    this.id = this.getAttribute("data-id") || "Tooltip id not defined";

    this.render();
  }

  disconnectedCallback() {}

  async handleEvent(event: Event) {
    let target = event.target as HTMLButtonElement;
    if (!target) return;
  }

  render() {
    let content = formatTooltip(this.content, this.tooltip);

    this.innerHTML = content;
  }
}

customElements.define("app-tooltip", Tooltip);

export function formatTooltip(
  content: string,
  tooltip: string,
  customId?: string,
) {
  const id = customId || `tp-${self.crypto.randomUUID()}`;
  let className = "tp-trigger";
  if (content === "?") {
    className += " icon";
  }
  let html = '<div class="tp-wrapper">';
  // https://stackoverflow.com/a/10836076
  // use <button type="button"> because default form button type is submit, which
  // will trigger a page reload

  // https://bugs.webkit.org/show_bug.cgi?id=261945
  // use <input type="button"> instead of <button> because of bug with
  // and <form><button type="button" popovertarget></form> with safari
  if (content.trim().startsWith("<svg")) {
    html += `<span class="svg-button">${content}<input class="${className}" type="button" popovertarget="${id}"></span>`;
  } else {
    html += `<input class="${className}" type="button" popovertarget="${id}" value="${content}">`;
  }
  html += `<div id='${id}' role='tooltip' popover >${tooltip}</div>`;
  html += "</div>";
  return html;
}
