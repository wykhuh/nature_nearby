import { getAppPage } from "../../lib/init_app";
import { formatAppParams, updatePushState } from "../../lib/url_utils";
import type { AppStoreType, RouterType } from "../../types/app";

export async function pageChangeHandler(
  event: CustomEvent,
  appStore: AppStoreType,
  router: RouterType,
) {
  let target = event.target as HTMLInputElement;
  if (!target) return;

  const path = target.getAttribute("href");
  if (!path) return;

  appStore.currentPage = getAppPage(path);

  let url = `${window.location.origin}${path}`;
  let params = formatAppParams(appStore);
  if (params) {
    url += `?${params}`;
  }
  updatePushState(path, url, appStore);
  router.go(path);
}
