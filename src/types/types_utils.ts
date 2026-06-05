import type { NormalizedTaxon } from "./app";
import type { AutocompleteTaxonResult, ObservationTaxon } from "./inat_api";

export function isNormalizediNatTaxonType(
  record: NormalizedTaxon | ObservationTaxon | AutocompleteTaxonResult,
): record is NormalizedTaxon {
  return "matched_term" in record;
}
