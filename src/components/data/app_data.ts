import type { ViewComponentType } from "../../types/app";

export const viewComponent: ViewComponentType = {
  search: "view-search",
  observations: "view-observations",
  species: "view-species",
};

export const validView = ["search", "observations", "species"] as const;
