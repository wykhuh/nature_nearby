import { updateAppUrl } from "../../lib/url_utils";
import type { AppStoreType, DataComponentType } from "../../types/app";
import type { iNatAPIError, iNatObservationsAPI } from "../../types/inat_api";
import { getObservationsData } from "../PageHome/data_utils";

export function renderObservations(
  data: iNatObservationsAPI | iNatAPIError | undefined,
  appStore: AppStoreType,
) {
  const containerEl = document.querySelector("#observations-grid");
  if (!containerEl) return;
  containerEl.innerHTML = "";

  if (!data) {
    containerEl.textContent = "No records found";
    return;
  } else if ("error" in data) {
    if (data.error.startsWith("Result window is too large")) {
      containerEl.textContent = "Invalid page number";
    } else {
      containerEl.textContent = data.error;
    }
    delete appStore.observationsApiParams.page;
    return;
  }

  let pagination1 = document.createElement("app-pagination") as DataComponentType;
  pagination1.data = {
    perPage: data.per_page,
    currentPage: data.page,
    totalRecords: Math.min(data.total_results, 10000),
    paginationCallback,
  };
  containerEl.appendChild(pagination1);

  data.results.forEach((result) => {
    let component = document.createElement("card-observation") as DataComponentType;
    component.data = result;
    containerEl.appendChild(component);
  });

  let pagination2 = document.createElement("app-pagination") as DataComponentType;
  pagination2.data = {
    perPage: data.per_page,
    currentPage: data.page,
    totalRecords: Math.min(data.total_results, 10000),
    paginationCallback,
    scrollToSelector: "#view-container",
  };
  containerEl.appendChild(pagination2);
}

export async function paginationCallback(num: number, appStore: AppStoreType) {
  const containerEl = document.querySelector("#observations-grid");
  if (!containerEl) return;

  appStore.observationsApiParams = {
    ...appStore.observationsApiParams,
    page: num,
  };

  let data = await getObservationsData(appStore);
  renderObservations(data, appStore);
  updateAppUrl(window.location, appStore);
}
