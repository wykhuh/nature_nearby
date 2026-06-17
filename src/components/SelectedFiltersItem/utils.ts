import { observationsFieldName_InputType } from "../../data/app_data";
import {
  setInputChecked,
  setInputValue,
  setSelectedOption,
  unsetSelectedOption,
} from "../../lib/form_utils";
import type {
  AppStoreType,
  ObservationsApiParamsKeysType,
} from "../../types/app";
import { updateAppWithFormData } from "../ViewSearch/shared_utils";

export async function deleteFilter(
  fieldTemp: ObservationsApiParamsKeysType,
  value: string,
  appStore: AppStoreType,
) {
  let resourceFieldName_InputType = observationsFieldName_InputType;
  let field = fieldTemp as keyof typeof resourceFieldName_InputType;
  let inputType = resourceFieldName_InputType[field];
  if (inputType === "select") {
    unsetSelectedOption(
      `#observations-form select#${field} option[value='${value}']`,
    );
  } else if (inputType === "multiselect") {
    value
      .toString()
      .split(",")
      .forEach((v) => {
        unsetSelectedOption(
          `#observations-form select#${field} option[value='${v}']`,
        );
      });
  } else if (inputType === "checkbox") {
    value
      .toString()
      .split(",")
      .forEach((v) => {
        setInputChecked(
          `#observations-form input[name='${field}'][value='${v}']`,
          false,
        );
      });
  } else if (inputType === "textInput") {
    setInputValue(`#observations-form input#${field}`, "");
  } else if (inputType === "dateInput") {
    setInputValue(`#observations-form input#${field}`, "");
  } else if (inputType === "search") {
    setInputValue(`#observations-form [name='${field}']`, "");
  } else {
    throw new Error(
      `need to add another option for SelectedFiltersItem: ${field} ${inputType}`,
    );
  }

  await updateForm(appStore);
}

async function updateForm(appStore: AppStoreType) {
  let form = document.querySelector("#observations-form") as HTMLFormElement;
  const data = new FormData(form);

  await updateAppWithFormData(data, appStore);
}

export async function deleteCurrentLocationFilter() {
  setInputValue(`#observations-form input#lat`, "");
  setInputValue(`#observations-form input#lng`, "");
  setSelectedOption(`#observations-form select#radius option`);
}
