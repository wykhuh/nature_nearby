import type {
  NameOrderType,
  ValidViews,
  ViewComponentType,
} from "../types/app";

export const viewComponentObj: ViewComponentType = {
  search: "view-search",
  observations: "view-observations",
  species: "view-species",
};

export const validView: ValidViews[] = ["search", "observations", "species"];

export const validNameOrders: NameOrderType[] = ["cs", "sc", "s"];
