import autoComplete from "@tarekraafat/autocomplete.js";

import type {
  AutoCompleteEventType,
  AppStoreType,
  NormalizedUser,
} from "../types/app.d.ts";
import { getAutocompleteUsers } from "../lib/inat_api.ts";
import type { iNatAutocompleteUsersAPI } from "../types/inat_api";

import { updateAppState } from "../components/ViewSearch/shared_utils.ts";
import { setUnobservedByUserIdFormField } from "../components/ViewSearch/utils.ts";

export function setupUnobservedByUserSearch(selector: string) {
  const autoCompleteUsersJS = new autoComplete({
    autocomplete: "off",
    selector: selector,
    placeHolder: "Enter username",
    threshold: 2,
    searchEngine: (_query: string, record: NormalizedUser) => {
      return renderAutocompleteUser(record);
    },
    data: {
      src: async (query: string) => {
        try {
          let data = await getAutocompleteUsers(query);
          return processAutocompleteUser(data);
        } catch (error) {
          console.error("setupUserSearch ERROR:", error);
        }
      },
    },
    resultsList: {
      maxResults: 25,
    },
    events: {
      input: {
        selection: (event: AutoCompleteEventType) => {
          const selection = event.detail.selection.value as NormalizedUser;
          autoCompleteUsersJS.input.value = selection.login;
        },
      },
    },
  });

  return autoCompleteUsersJS;
}

export function processAutocompleteUser(
  data: iNatAutocompleteUsersAPI,
): NormalizedUser[] {
  return data.results.map((item) => {
    return {
      id: item.id,
      login: item.login,
      name: item.name,
    };
  });
}

export function renderAutocompleteUser(item: NormalizedUser): string {
  let html = `
  <div class="users-ac-option" data-testid="users-ac-option">
    <div class="user-name">
    ${item.login}`;

  html += `
    </div>
  </div>`;

  return html;
}

// called by autocomplete search when an user option is selected
export async function unobservedByUserSelectedHandler(
  selection: NormalizedUser,
  appStore: AppStoreType,
) {
  // add to store
  appStore.selectedUnobservedByUser = selection;

  appStore.observationsApiParams = {
    ...appStore.observationsApiParams,
    unobserved_by_user_id: selection.id,
  };

  setUnobservedByUserIdFormField(appStore);

  updateAppState(appStore);
}

export function removeUnobservedByUser(appStore: AppStoreType) {
  appStore.selectedUnobservedByUser = {} as NormalizedUser;
  delete appStore.observationsApiParams.unobserved_by_user_id;

  setUnobservedByUserIdFormField(appStore);

  updateAppState(appStore);
}
