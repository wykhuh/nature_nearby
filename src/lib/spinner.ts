import type { Spinner } from "../types/app";

export function createSpinner(selector: string): Spinner {
  let elements: NodeListOf<HTMLDivElement> | null = null;
  function init(selector: string) {
    let els = document.querySelectorAll<HTMLDivElement>(selector);
    if (els.length > 0) {
      elements = els;
    }
  }
  return {
    start: function () {
      init(selector);
      if (elements) {
        elements.forEach((element) => {
          element.style.display = "inline-block";
        });
      }
    },
    stop() {
      if (elements) {
        elements.forEach((element) => {
          element.style.display = "none";
        });
      }
    },
  };
}
