import { viewComponentObj } from "../../data/app_data";
import { updateAppUrl } from "../../lib/url_utils";
import type { AppStoreType, ValidViews } from "../../types/app";

export function setView(
  view: ValidViews,
  appStore: AppStoreType,
  componentCtx: any,
) {
  if (appStore.currentView === view) return;

  // reset page
  delete appStore.observationsApiParams.page;
  updateAppUrl(window.location, appStore);
  appStore.currentView = view;

  // render view
  componentCtx.viewContainerEl.innerHTML = "";
  let component = document.createElement(viewComponentObj[view]);
  componentCtx.viewContainerEl.appendChild(component);
  updateAppUrl(window.location, appStore);

  // set .current-view class
  let oldEl = document.querySelector(`#view-controls button.current-view`);
  if (oldEl) {
    oldEl.classList.remove("current-view");
  }
  let el = document.querySelector(`#view-controls button[data-view="${view}"]`);
  if (el) {
    el.classList.add("current-view");
  }
}

export function initFilters(appStore: AppStoreType) {
  // set .current-view class
  let view = appStore.currentView;
  let el = document.querySelector(`#view-controls button[data-view="${view}"]`);
  if (el) {
    el.classList.add("current-view");
  }
}
