import { viewComponentObj } from "../../data/app_data";
import { updateAppUrl } from "../../lib/url_utils";
import type { AppStoreType, ValidViews } from "../../types/app";

export function setView(view: ValidViews, appStore: AppStoreType, componentCtx: any) {
  if (appStore.currentView === view) return;

  // reset page
  delete appStore.observationsParams.page;
  updateAppUrl(window.location, appStore);
  appStore.currentView = view;

  // render view
  componentCtx.viewContainerEl.innerHTML = "";
  let component = document.createElement(viewComponentObj[view]);
  componentCtx.viewContainerEl.appendChild(component);
}
