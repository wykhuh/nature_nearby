import { updateAppUrl } from "../../lib/url_utils";
import type { AppStoreType, DataComponentType } from "../../types/app";
import type {
  iNatAPIError,
  iNatObservationsSpeciesAPI,
} from "../../types/inat_api";
import { getObservationsSpeciesData } from "../PageHome/data_utils";

export function renderObservations(
  data: iNatObservationsSpeciesAPI | iNatAPIError | undefined,
  appStore: AppStoreType,
) {
  const containerEl = document.querySelector("#observations-species-container");
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

  let pagination1 = document.createElement(
    "app-pagination",
  ) as DataComponentType;
  pagination1.data = {
    perPage: data.per_page,
    currentPage: data.page,
    totalRecords: Math.min(data.total_results, 10000),
    paginationCallback,
  };
  containerEl.appendChild(pagination1);

  const gridContainerEl = document.createElement("div");
  gridContainerEl.className = "grid-auto-fill";
  gridContainerEl.id = "observations-species-grid";

  data.results.forEach((result) => {
    let component = document.createElement("card-species") as DataComponentType;
    component.data = result;
    gridContainerEl.appendChild(component);
  });
  containerEl.append(gridContainerEl);

  let pagination2 = document.createElement(
    "app-pagination",
  ) as DataComponentType;
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
  const containerEl = document.querySelector("#observations-species-grid");
  if (!containerEl) return;

  appStore.observationsApiParams = {
    ...appStore.observationsApiParams,
    page: num,
  };

  let data = await getObservationsSpeciesData(appStore);
  renderObservations(data, appStore);
  updateAppUrl(window.location, appStore);
}
