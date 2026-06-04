import type { NormalizedTaxon } from "./app";
import type { ObservationTaxon } from "./inat_api";

export function isNormalizediNatTaxonType(
  record: NormalizedTaxon | ObservationTaxon,
): record is NormalizedTaxon {
  return "matched_term" in record;
}
