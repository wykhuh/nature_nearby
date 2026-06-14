import "./components/PageHome/component.ts";
import "./components/PageAbout/component.ts";
import "./components/AppHeader/component.ts";
import "./components/ViewSearch/component.ts";
import "./components/ViewSpecies/component.ts";
import "./components/ViewObservations/component.ts";
import "./components/CardObservation/component.ts";
import "./components/CardSpecies/component.ts";
import "./components/ObservationsHeader/component.ts";
import "./components/Pagination/component.ts";
import "./components/SelectedFiltersItem/component.ts";
import "./components/AppStoreViewer/component.ts";
import "./components/MediaCarousel/component.ts";

import store from "./lib/store.ts";
import { initApp, registerServiceWorker } from "./lib/init_app.ts";
import Router from "./lib/router.ts";

await registerServiceWorker();

window.app = { store: store, router: Router };

// populate app store
await initApp(
  window.location.search,
  window.location.pathname,
  window.app.store,
);
// load page component
Router.init();

// called when user pressess browser back or next
window.addEventListener("popstate", (event) => {
  Router.go(event.state.pathname);
});

// TODO: switch pagination to get all pages
// TODO: track user movement
