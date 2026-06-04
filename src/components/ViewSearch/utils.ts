import { observationsFieldName_InputType } from "../../data/app_data";
import { populateFormFields } from "../../lib/form_utils";
import type { AppStoreType } from "../../types/app";

export function initFilters(appStore: AppStoreType) {
  populateFormFields(
    "#observations-form",
    observationsFieldName_InputType,
    appStore,
  );
}
