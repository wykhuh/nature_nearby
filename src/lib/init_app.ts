import type { AppPage, AppStoreType } from "../types/app";
import { decodeAppUrl } from "./url_utils";

const pathPage = {
  "/about/": "about",
  "/": "home",
};

export function getAppPage(pathname: string) {
  return pathPage[pathname as keyof typeof pathPage] as AppPage;
}

export async function initApp(searchParams: string, pathname: string, appStore: AppStoreType) {
  let urlData = decodeAppUrl(searchParams, pathname);

  if (urlData.page) {
    appStore.observationsParams.page = urlData.page;
  }
  if (urlData.per_page) {
    appStore.observationsParams.per_page = urlData.per_page;
  }
}

export async function registerServiceWorker() {
  // register service worker
  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register("/service_worker.js", {
        type: "module",
      });
      console.log("service worker register");
    } catch (err) {
      console.log("service worker not register", err);
    }

    //listen for messages from the service worker
    navigator.serviceWorker.addEventListener(
      "message",
      onMessageFromServiceWorker,
    );
  } else {
    console.log("Service workers are not supported.");
  }
}

function onMessageFromServiceWorker(event: MessageEvent) {
  console.log("Message from service worker:", event.data);
}

export function sendMessageToServiceWorker(message: any) {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage(message);
  }
}
