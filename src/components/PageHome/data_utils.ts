import { globalObs, globalObsSpecies } from "../../data/api/observations";
import {
  cleanupObervationsParams,
  cleanupObervationsSpeciesParams,
} from "../../lib/cleanup_params_utils";
import { getObservations, getObservationsSpecies } from "../../lib/inat_api";
import type { AppStoreType } from "../../types/app";

export async function getObservationsData(appStore: AppStoreType) {
  if (import.meta.env?.VITE_CACHE === "true") {
    return globalObs;
  }

  let params = cleanupObervationsParams(appStore);
  return await getObservations(params);
}

export async function getObservationsSpeciesData(appStore: AppStoreType) {
  if (import.meta.env?.VITE_CACHE === "true") {
    return globalObsSpecies;
  }

  let params = cleanupObervationsSpeciesParams(appStore);
  return await getObservationsSpecies(params);
}
