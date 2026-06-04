import type { AppStoreType } from "../types/app";

export function setSelectedOption(selector: string) {
  let el = document.querySelector(selector) as HTMLOptionElement;
  if (el) {
    el.selected = true;
  }
}

export function setInputValue(selector: string, value: any) {
  let el = document.querySelector(selector) as HTMLOptionElement;
  if (el) {
    el.value = value;
  }
}

export function setInputChecked(selector: string, value: any) {
  let el = document.querySelector(selector) as HTMLInputElement;
  if (el) {
    el.checked = value;
  }
}

export function populateFormFields(
  formSelector: string,
  field_type: { [k: string]: string },
  appStore: AppStoreType,
) {
  for (let [field, value] of Object.entries(appStore.observationsApiParams)) {
    if (field_type[field] === undefined) {
      continue;
    }

    let fieldType = field_type[field];
    if (fieldType === "skip") {
    } else if (fieldType === "search") {
    } else if (fieldType === "select") {
      setSelectedOption(
        `${formSelector} select#${field} option[value='${value}']`,
      );
    } else if (fieldType === "multiselect") {
      value
        .toString()
        .split(",")
        .forEach((v: any) => {
          setSelectedOption(
            `${formSelector} select[name='${field}'] option[value='${v}']`,
          );
        });
    } else if (fieldType === "textInput") {
      setInputValue(`${formSelector} input#${field}`, value);
    } else if (fieldType === "dateInput") {
      setInputValue(`${formSelector} input#${field}`, value);
    } else if (fieldType === "checkbox") {
      value
        .toString()
        .split(",")
        .forEach((v: any) => {
          setInputChecked(
            `${formSelector} input[name='${field}'][value='${v}']`,
            true,
          );
        });
    } else {
      throw new Error("processFields not implemnt for " + fieldType);
    }
  }
}
