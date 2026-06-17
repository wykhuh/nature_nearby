import L from "leaflet";
import type { Circle, GeoJSON, Map } from "leaflet";
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerIconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";
import { TerraDraw, TerraDrawRectangleMode } from "terra-draw";
import { TerraDrawLeafletAdapter } from "terra-draw-leaflet-adapter";

import { loggerUrl } from "./logger";
import type {
  AppStoreType,
  CircleSettings,
  CoordinatesType,
  CustomGeoJSONType,
  GeoJSONSettings,
  iNatBBox,
  LatLngType,
  LeafletBoundsType,
  LngLatType,
  MarkerSettings,
  ObservationsApiParamsType,
  ObservationTilesSettingType,
} from "../types/app";
import type { MultiPolygonJson } from "../types/inat_api";
import { square } from "../assets/icons.ts";

// ====================
// setup
// ====================

export function renderMap() {
  let map = L.map("map", {
    center: [0, 0],
    zoom: 0,
    maxZoom: 19,
    // NOTE: set worldCopyJump to true so that rectangles from rectangles
    // have -180 to 180 longitudes that iNat API requires
    worldCopyJump: true,
  });
  map.zoomControl.setPosition("bottomright");
  L.Icon.Default.prototype.options.iconUrl = markerIconUrl;
  L.Icon.Default.prototype.options.iconRetinaUrl = markerIconRetinaUrl;
  L.Icon.Default.prototype.options.shadowUrl = markerShadowUrl;
  // necessary to avoid Leaflet adds some prefix to image path.
  L.Icon.Default.imagePath = "";

  // add basemaps
  let { OpenStreetMap, USGSTopo, USGSImagery } = getMapTiles();
  L.tileLayer(OpenStreetMap.url, OpenStreetMap.options).addTo(map);
  L.tileLayer(USGSTopo.url, USGSTopo.options).addTo(map);
  L.tileLayer(USGSImagery.url, USGSImagery.options).addTo(map);

  const layerControl = L.control
    .layers(undefined, undefined, { collapsed: true })
    .addTo(map);

  addLayerToMap(OpenStreetMap, map, layerControl, true);
  addLayerToMap(USGSTopo, map, layerControl);
  addLayerToMap(USGSImagery, map, layerControl);

  const terraDraw = setupTerraDraw(map);
  terraDraw.start();

  createDrawRectButton(map, terraDraw);

  return { map, layerControl, terraDraw };
}

export function setupTerraDraw(map: Map) {
  return new TerraDraw({
    adapter: new TerraDrawLeafletAdapter({
      lib: L,
      map,
    }),
    modes: [new TerraDrawRectangleMode()],
  });
}

export function createDrawRectButton(
  map: Map,
  terraDraw: TerraDraw,
): HTMLButtonElement | null {
  let buttonEl: HTMLButtonElement = null as unknown as HTMLButtonElement;

  const DrawRect = L.Control.extend({
    onAdd: function (_map: Map) {
      buttonEl = L.DomUtil.create(
        "button",
        "leaflet-bar leaflet-control leaflet-control-draw-rect",
      );

      buttonEl.innerHTML = square;

      buttonEl.onclick = async function () {
        let mode = terraDraw.getMode();
        if (mode === "static") {
          buttonEl.classList.add("active");
          terraDraw.setMode("rectangle");
        } else {
          buttonEl.classList.remove("active");
          terraDraw.setMode("static");
        }
      };

      return buttonEl;
    },
    onRemove: function (_map: Map) {},
  });

  function drawRect(opts: any) {
    return new DrawRect(opts);
  }
  drawRect({ position: "topleft" }).addTo(map);

  return buttonEl;
}

export function addiNatBBoxToMap(appStore: AppStoreType) {
  let map = appStore.map.map;
  if (!map) return;

  // convert bounding box
  let latLngCoors = convertiNatBBoxToLatLng(
    appStore.observationsApiParams,
    map,
  );

  if (!latLngCoors) return;
  let lngLatCoors = convertiNatBBoxToLngLat(appStore.observationsApiParams);
  if (!lngLatCoors) return;

  let layer = renderBoundingBoxLayer(map, latLngCoors) as any;
  appStore.placesMapLayers["0"] = [layer as unknown as CustomGeoJSONType];
}

// ====================
// render to map
// ====================

export function addLayerToMap(
  tileObj: ObservationTilesSettingType,
  map: any,
  layerControl: any,
  checked = false,
) {
  loggerUrl(tileObj.url);

  let layer = L.tileLayer(tileObj.url, tileObj.options);
  if (checked) {
    layer.addTo(map);
  }
  layerControl.addBaseLayer(layer, tileObj.options.control_name);

  return layer;
}

export function addOverlayToMap(
  tileObj: ObservationTilesSettingType,
  map: any,
  layerControl: any,
  checked = false,
) {
  if (!tileObj) return;

  loggerUrl(tileObj.url);

  let layer = L.tileLayer(tileObj.url, tileObj.options);

  try {
    if (checked) {
      layer.addTo(map);
    }
    layerControl.addOverlay(layer, tileObj.options.control_name);
    return layer;
  } catch (error) {
    console.log("addOverlayToMap ERROR:", error);
  }
}

export function renderSelectedPlacesBoundaries(appStore: AppStoreType) {
  let map = appStore.map.map;
  if (!map) return;

  // add places layers
  appStore.selectedPlaces.forEach((place) => {
    let options: GeoJSONSettings = {
      color: "red",
      fillColor: "none",
      layer_description: `place layer: ${place.name}, ${place.id}`,
      geometry: place.geometry as MultiPolygonJson,
    };
    let layer = renderGeojsonLayer(options, map);

    appStore.placesMapLayers = {
      ...appStore.placesMapLayers,
      [place.id]: [layer as CustomGeoJSONType],
    };
  });
}

export function renderMarker(settings: MarkerSettings, map: Map) {
  return L.marker([settings.latitude, settings.longitude]).addTo(map);
}

export function renderGeojsonLayer(
  settings: GeoJSONSettings,
  map: Map,
): GeoJSON {
  let options: any = {
    color: settings.color,
    fillColor: settings.fillColor,
    fillOpacity:
      settings.fillOpacity === undefined ? 0.2 : settings.fillOpacity,
    layer_description: settings.layer_description,
  };
  // make geojson not clickable
  // https://stackoverflow.com/a/58675812
  if (settings.interactive === false || settings.interactive === true) {
    options.style = { interactive: settings.interactive };
  }

  var geojsonFeature: any = {
    type: "Feature",
    geometry: settings.geometry,
  };

  return L.geoJSON(geojsonFeature, options).addTo(map);
}

export function renderCircleMarker(settings: CircleSettings, map: Map) {
  let options: any = {
    color: settings.color || "red",
    fillColor: settings.fillColor,
    fillOpacity:
      settings.fillOpacity === undefined ? 0.2 : settings.fillOpacity,
    radius: settings.radius || 500,
  };
  if (settings.interactive === false || settings.interactive === true) {
    options.style = { interactive: settings.interactive };
  }

  return L.circle([settings.latitude, settings.longitude], options).addTo(map);
}

export function renderBoundingBoxLayer(
  map: Map,
  latLngCoors: LatLngType[],
  options = {
    fillColor: "none",
    weight: 1,
    layer_description: "bounding box",
  },
) {
  let layer = L.polygon(latLngCoors, options);
  layer.addTo(map);
  return layer;
}

export function renderCircle(appStore: AppStoreType) {
  if (appStore.observationsApiParams.radius === undefined) return;
  if (appStore.observationsApiParams.lat === undefined) return;
  if (appStore.observationsApiParams.lng === undefined) return;
  return L.circle(
    [appStore.observationsApiParams.lat, appStore.observationsApiParams.lng],
    {
      radius: appStore.observationsApiParams.radius * 1000,
      color: "#4983c6",
      weight: 2,
      fillOpacity: 0,
      interactive: false,
    },
  );
}

// ====================
// convert data
// ====================

export function convertLnLatToiNatBBox(
  normlizedCoordinates: LngLatType[],
  originalCoordinates: LngLatType[],
) {
  let json: any = [
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [normlizedCoordinates],
      },
    },
  ];

  let bounds = L.geoJSON(json).getBounds() as LeafletBoundsType;
  let bbox = {
    nelat: cleanBoundsCoordinate(bounds._northEast.lat),
    nelng: cleanBoundsCoordinate(bounds._northEast.lng),
    swlat: cleanBoundsCoordinate(bounds._southWest.lat),
    swlng: cleanBoundsCoordinate(bounds._southWest.lng),
  };

  if (crossesAntimerdian(originalCoordinates)) {
    fixBBoxThatCrossesAntimerdian(bbox);
  }

  return bbox;
}

function cleanBoundsCoordinate(value: number) {
  return value === -0 ? 0 : value;
}

export function convertCircleToBBox(circle: Circle) {
  let bounds = circle.getBounds() as LeafletBoundsType;

  let coors: LngLatType[] = [
    [bounds._southWest.lng, bounds._southWest.lat],
    [bounds._northEast.lng, bounds._southWest.lat],
    [bounds._northEast.lng, bounds._northEast.lat],
    [bounds._southWest.lng, bounds._northEast.lat],
    [bounds._southWest.lng, bounds._southWest.lat],
  ];

  return coors;
}

// turn iNat nelng,nelat,swlng,swlat into geometry that leaflet understands
export function convertiNatBBoxToLatLng(
  params: ObservationsApiParamsType,
  map: Map,
): LatLngType[] | undefined {
  let { nelng, nelat, swlng, swlat } = params;
  if (nelng === undefined) return;
  if (nelat === undefined) return;
  if (swlng === undefined) return;
  if (swlat === undefined) return;

  // handle bounding boxes that cross the antimerdian
  if (nelng < swlng) {
    let coors: LatLngType[] = [
      [swlat, swlng - 360],
      [swlat, nelng],
      [nelat, nelng],
      [nelat, swlng - 360],
      [swlat, swlng - 360],
    ];

    return coors;
  }

  // handle normal bounding boxes
  return [
    [swlat, swlng],
    [swlat, nelng],
    [nelat, nelng],
    [nelat, swlng],
    [swlat, swlng],
  ]
    .map((coors) => map.wrapLatLng(coors as any))
    .map((obj) => {
      return [obj.lat, obj.lng];
    });
}

export function convertiNatBBoxToLngLat(
  params: ObservationsApiParamsType,
): LngLatType[] | undefined {
  const { nelng, nelat, swlng, swlat } = params;
  if (nelng === undefined) return;
  if (nelat === undefined) return;
  if (swlng === undefined) return;
  if (swlat === undefined) return;

  // handle bounding boxes that cross the antimerdian
  if (nelng < swlng) {
    let coors: LatLngType[] = [
      [swlng - 360, swlat],
      [nelng, swlat],
      [nelng, nelat],
      [swlng - 360, nelat],
      [swlng - 360, swlat],
    ];

    return coors;
  }

  return [
    [swlng, swlat],
    [nelng, swlat],
    [nelng, nelat],
    [swlng, nelat],
    [swlng, swlat],
  ];
}

export function normalizeTerraDrawLngLat(
  coordinates: LngLatType[],
  map: L.Map,
) {
  // convert terra draw lng/lat to lat/lng for leaflet
  let latLngCoors = coordinates.map(flipLatLng);

  // convert coordinates that go beyond -180 and 180 for iNat API.
  let normalizedLatLng: LatLngType[] = latLngCoors
    .map((coors) => map.wrapLatLng(coors))
    .map((coors) => [coors.lat, coors.lng]);

  // convert normalized lat/lng to normalized lng/lat
  let normalizedLngLat = normalizedLatLng.map((coors) => flipLatLng(coors));

  return { normalizedLatLng, normalizedLngLat, latLng: latLngCoors };
}

export function crossesAntimerdian(coors: LngLatType[]) {
  let longitudes = [...new Set(coors.map((coor) => coor[0]))];
  if (
    (longitudes[0] < -180 && longitudes[1] > -180) ||
    (longitudes[0] > -180 && longitudes[1] < -180) ||
    (longitudes[0] < 180 && longitudes[1] > 180) ||
    (longitudes[0] > 180 && longitudes[1] < 180)
  ) {
    return true;
  } else {
    return false;
  }
}

export function fixBBoxThatCrossesAntimerdian(bbox: iNatBBox) {
  let nelng = bbox.nelng;
  let swlng = bbox.swlng;
  bbox.swlng = nelng;
  bbox.nelng = swlng;
  return bbox;
}

export function flipLatLng(coordinates: CoordinatesType): CoordinatesType {
  return [coordinates[1], coordinates[0]];
}

// ====================
// basemaps
// ====================

export function getMapTiles(): {
  [name: string]: ObservationTilesSettingType;
} {
  return {
    OpenStreetMap: {
      name: "Open Street Map",
      type: "basemap",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      options: {
        layer_description: "basemap: Open Street Map",
        control_name: "Open Street Map",
        layer_type: "basemap",
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors.',
        minZoom: 0,
        maxZoom: 19,
      },
    },
    USGSTopo: {
      name: "USGS Topo",
      type: "basemap",
      url: "https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}",
      options: {
        layer_description: "basemap: USGS Topo",
        control_name: "USGS Topo",
        layer_type: "basemap",
        attribution:
          'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>',
        minZoom: 0,
        maxZoom: 16,
      },
    },
    USGSImagery: {
      name: "USGS Imagery",
      type: "basemap",
      url: "https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}",
      options: {
        layer_description: "basemap: USGS Imagery",
        control_name: "USGS Imagery",
        layer_type: "basemap",
        attribution:
          'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>',
        minZoom: 0,
        maxZoom: 16,
      },
    },
    OpenTopo: {
      name: "Open Topo",
      type: "basemap",
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      options: {
        layer_description: "basemap: Open Topo",
        control_name: "Open Topo",
        layer_type: "basemap",
        attribution:
          'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
        minZoom: 0,
        maxZoom: 17,
      },
    },
  };
}

// ====================
// misc
// ====================

export function fitBoundsPlaces(appStore: AppStoreType) {
  let map = appStore.map.map;
  if (!map) return;
  if (appStore.selectedPlaces.length === 0) return;

  let placesLayers = appStore.selectedPlaces
    .filter((p) => p.bounding_box !== undefined)
    .map((place) => {
      return L.geoJSON(place.bounding_box);
    });

  let layers = placesLayers;
  if (layers.length > 0) {
    map.fitBounds(L.featureGroup(layers).getBounds());
  }
}

export function fitBounds(layer: GeoJSON, map: Map) {
  map.fitBounds(L.featureGroup([layer]).getBounds(), { maxZoom: 6 });
}

export function removeMap(appStore: AppStoreType) {
  if (appStore.map.map) {
    // remove map and event listeners
    appStore.map.map.remove();
    appStore.map.map = null;
  }

  if (appStore.map.layerControl) {
    appStore.map.layerControl.remove();
    appStore.map.layerControl = null;
  }

  if (appStore.map.terraDraw) {
    appStore.map.terraDraw.stop();
  }
}

export function clearMapLayers(appStore: AppStoreType) {
  appStore.taxaMapLayers = {};
  appStore.placesMapLayers = {};
  appStore.placesMarkers = [];
}
