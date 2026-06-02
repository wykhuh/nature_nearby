import type { AppStoreType, ValidViews } from "../../types/app";
import { viewComponent } from "../data/app_data";

export function changeView(
  view: ValidViews,
  _appStore: AppStoreType,
  componentCtx: any,
) {
  componentCtx.viewContainerEl.innerHTML = "";
  let component = document.createElement(viewComponent[view]);
  componentCtx.viewContainerEl.appendChild(component);
}
