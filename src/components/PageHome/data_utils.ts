import { globalObs, globalObsSpecies } from "../../data/api/observations";
import { getObservations, getObservationsSpecies } from "../../lib/inat_api";
import type { AppStoreType } from "../../types/app";

export async function getObservationsData(appStore: AppStoreType) {
  if (import.meta.env?.VITE_CACHE === "true") {
    return globalObs;
  }

  let paramsString = new URLSearchParams(
    appStore.observationsApiParams as any,
  ).toString();

  let data = await getObservations(paramsString);
  return data;
}

export async function getObservationsSpeciesData(appStore: AppStoreType) {
  if (import.meta.env?.VITE_CACHE === "true") {
    return globalObsSpecies;
  }

  let paramsString = new URLSearchParams(
    appStore.observationsApiParams as any,
  ).toString();

  let data = await getObservationsSpecies(paramsString);

  return data;
}
