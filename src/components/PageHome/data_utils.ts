import { globalObs, globalObsSpecies } from "../../data/api/observations";
import { getObservations, getObservationsSpecies } from "../../lib/inat_api";
import type { AppStoreType } from "../../types/app";
import type {
  iNatObservationsAPI,
  iNatObservationsSpeciesAPI,
} from "../../types/inat_api";

export async function getObservationsData(appStore: AppStoreType) {
  if (import.meta.env?.VITE_CACHE === "true") {
    return globalObs.results;
  }

  let paramsString = new URLSearchParams(
    appStore.observationsParams as any,
  ).toString();

  let data = (await getObservations(paramsString)) as iNatObservationsAPI;
  if (data) {
    return data.results;
  }
}

export async function getObservationsSpeciesData(appStore: AppStoreType) {
  if (import.meta.env?.VITE_CACHE === "true") {
    return globalObsSpecies.results;
  }

  let paramsString = new URLSearchParams(
    appStore.observationsParams as any,
  ).toString();

  let data = (await getObservationsSpecies(
    paramsString,
  )) as iNatObservationsSpeciesAPI;
  if (data) {
    return data.results;
  }
}
