import { viewComponentObj } from "../../data/app_data";
import type { AppStoreType, ValidViews } from "../../types/app";

export function setView(
  view: ValidViews,
  _appStore: AppStoreType,
  componentCtx: any,
) {
  componentCtx.viewContainerEl.innerHTML = "";
  let component = document.createElement(viewComponentObj[view]);
  componentCtx.viewContainerEl.appendChild(component);
}
