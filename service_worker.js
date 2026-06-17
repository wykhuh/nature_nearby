import { throttleAsync, logger } from "./service_worker_utils";

const version = 1.0;
const cacheName = `cache_${version}`;
const minutes = 60;
const cacheTime = minutes * 60 * 1000;
const throttleTime = 1000;

const throttledFetch = throttleAsync((url) => {
  return fetch(url);
}, throttleTime);

// add event listener that listens when browser install the
// service worker
self.addEventListener("install", (evt) => {
  logger("service worker has been installed");
});

// add event listener that listens when activate event is fired
self.addEventListener("activate", (evt) => {
  logger("service worker has been activated");

  clients.claim().then(() => {
    logger("service_worker has claimed all pages");
  });

  // delete old caches
  evt.waitUntil(
    caches.keys().then((keys) => {
      // need Promise all because evt.waitUntil expects one promise
      return Promise.all(
        keys
          .filter((key) => key !== cacheName)
          .map((key) => caches.delete(key)),
      );
    }),
  );
});

self.addEventListener("fetch", (ev) => {
  let url = ev.request.url;

  if (url.startsWith("https://api.inaturalist.org/v2/search")) {
  } else if (
    url.startsWith("https://api.inaturalist.org/v2/taxa/autocomplete")
  ) {
  } else if (
    url.startsWith("https://api.inaturalist.org/v2/users/autocomplete")
  ) {
  } else if (url.startsWith("https://api.inaturalist.org/v2")) {
    ev.respondWith(fetchHandler(ev));
  } else if (url.startsWith("https://api.inaturalist.org/v1")) {
    // ev.respondWith(fetchHandler(ev));
  } else if (url.startsWith("https://inaturalist-open-data.s3.amazonaws.com")) {
  } else if (url.startsWith("https://static.inaturalist.org")) {
  } else if (url.includes("tile.openstreetmap.org")) {
  } else if (url.startsWith("http://localhost")) {
  } else if (url.startsWith("https://basemap.nationalmap.gov")) {
  } else {
    logger("++ sw url not handled", url);
  }
});

self.addEventListener("message", (ev) => {
  let data = ev.data;
  if (data === "cancel_fetch") {
    throttledFetch.cancel();
  }
  logger("++ sw", data);
});

async function fetchHandler(evt) {
  // look if request is in cache
  let cacheResponse = await caches.match(evt.request);

  // return cache if response timestamp is recent enough
  if (cacheResponse) {
    let timestamp = cacheResponse.headers.get("X-timestamp");
    if (timestamp && Date.now() - Number(timestamp) < cacheTime) {
      logger("++ sw cache");
      return cacheResponse;
    }
  }

  try {
    let response = await throttledFetch(evt.request);

    logger("++ sw fetch");

    // create new response in order to add timestamp to header
    const newHeaders = new Headers(response.headers);
    newHeaders.append("X-timestamp", Date.now().toString());
    const newResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });

    // save response to cache
    const cache = await caches.open(cacheName);
    cache.put(evt.request, newResponse.clone());

    return newResponse;
  } catch (err) {
    return new Response(null, { status: 504, statusText: "Network error" });
  }
}
