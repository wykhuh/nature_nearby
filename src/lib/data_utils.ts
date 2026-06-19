import type { Map, TileLayer } from "leaflet";
import L from "leaflet";

import type {
  AppStoreSelectedResourcesKeysType,
  AppStoreType,
  CustomLayerOptionsType,
  NormalizedPlace,
  NormalizedTaxon,
  ObservationsApiParamsKeysType,
  PlaceTypesKey,
} from "../types/app";
import type {
  AutocompletePlacePlace,
  AutocompleteTaxonResult,
  ObservationTaxon,
  PlaceResult,
  TaxonResult,
} from "../types/inat_api";
import { isNormalizediNatTaxonType } from "../types/types_utils";
import { getiNatMapTiles } from "./inat_api";
import { addOverlayToMap } from "./map_utils";
import { capitalizeFirstLetter } from "./utils";
import { cleanupObservationsMapParams } from "./cleanup_params_utils";
import { getColor, iNatOrange, primaryColorScheme } from "./map_colors_utils";
import { allTaxaRecord, placeTypes } from "../data/inat_data";

export function formatTaxonName(
  item:
    | NormalizedTaxon
    | ObservationTaxon
    | AutocompleteTaxonResult
    | TaxonResult,
  appStore: AppStoreType,
  searchTerm = "",
) {
  let includeMatchedTerm = searchTerm.length > 0;
  let hasCommonName = true;
  let title;
  let titleAriaLabel;
  let subtitle;
  let subtitleAriaLabel;
  let commonName;
  let scientificName;
  let rank;

  if (item.preferred_common_name) {
    commonName = item.preferred_common_name
      .split(" ")
      .map((word) => {
        if (word !== "and") {
          return capitalizeFirstLetter(word);
        } else {
          return word;
        }
      })
      .join(" ");
  } else {
    hasCommonName = false;
  }

  // has scientific name
  if (item.name) {
    scientificName = item.name;
  }

  if (item.rank) {
    rank = item.rank;
  }

  // add optional (matched_term)
  if (
    includeMatchedTerm &&
    isNormalizediNatTaxonType(item) &&
    item.matched_term
  ) {
    if (item.matched_term.toLowerCase() === commonName?.toLowerCase()) {
    } else if (
      item.matched_term.toLowerCase() === scientificName?.toLowerCase()
    ) {
    } else if (
      !commonName?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !scientificName?.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      commonName += ` (${capitalizeFirstLetter(item.matched_term)})`;
    }
  }

  let nameOrder = appStore.viewMetadata.name_order;
  if (nameOrder === "cs") {
    title = commonName;
    titleAriaLabel = commonName ? "taxon common name" : undefined;
    subtitle = scientificName;
    subtitleAriaLabel = scientificName ? "taxon scientific name" : undefined;
  } else if (nameOrder === "sc") {
    title = scientificName;
    titleAriaLabel = scientificName ? "taxon scientific name" : undefined;
    subtitle = commonName;
    subtitleAriaLabel = commonName ? "taxon common name" : undefined;
  } else {
    title = scientificName;
    titleAriaLabel = scientificName ? "taxon scientific name" : undefined;
  }

  return {
    title,
    titleAriaLabel,
    subtitle,
    subtitleAriaLabel,
    hasCommonName,
    rank,
  };
}

// called when user select taxa or place
export async function fetchiNatMapDataForTaxon(
  taxonObj: NormalizedTaxon,
  appStore: AppStoreType,
) {
  let map = appStore.map.map;
  let layerControl = appStore.map.layerControl;

  if (map === null) return;
  if (layerControl === null) return;

  let params = cleanupObservationsMapParams(appStore.observationsApiParams);
  let mapParams = {
    ...params,
    color: taxonObj.color,
  };
  if (taxonObj.id !== 0) {
    mapParams.taxon_id = taxonObj.id.toString();
  }

  // get iNaturalist map layers
  let { iNatGrid, iNatHeatmap, iNatTaxonRange, iNatPoint } = getiNatMapTiles(
    mapParams,
    taxonObj,
    appStore,
  );

  let iNatGridLayer = addOverlayToMap(iNatGrid, map, layerControl, true);
  let iNatPointLayer = addOverlayToMap(iNatPoint, map, layerControl);
  let iNatHeatmapLayer = addOverlayToMap(iNatHeatmap, map, layerControl);
  let iNatTaxonRangeLayer;
  if (iNatTaxonRange) {
    iNatTaxonRangeLayer = addOverlayToMap(iNatTaxonRange, map, layerControl);
  }

  let layers: (TileLayer | undefined)[] = [
    iNatGridLayer,
    iNatPointLayer,
    iNatHeatmapLayer,
  ];
  if (iNatTaxonRangeLayer) {
    layers.push(iNatTaxonRangeLayer);
  }

  return layers;
}

// reset page when changing filters so that pagination goes back to page 1
export function resetPageNumber(appStore: AppStoreType) {
  delete appStore.observationsApiParams.page;
}

// ================
// default taxon
// ================

export function addDefaultTaxaRecordToStore(appStore: AppStoreType) {
  let taxaResource: AppStoreSelectedResourcesKeysType;
  appStore.observationsApiParams = {
    ...appStore.observationsApiParams,
    colors: iNatOrange,
    taxon_id: "0",
  };
  taxaResource = "selectedTaxa";

  updateSelectedResource(
    structuredClone(allTaxaRecord),
    taxaResource,
    appStore,
  );

  appStore.color = iNatOrange;
}

export async function addDefaultTaxaRecordToMap(appStore: AppStoreType) {
  let layers = await fetchiNatMapDataForTaxon(
    structuredClone(allTaxaRecord),
    appStore,
  );
  if (!layers) return;

  appStore.taxaMapLayers = {
    ...appStore.taxaMapLayers,
    [allTaxaRecord.id]: layers,
  };
}

export async function addDefaultTaxa(appStore: AppStoreType) {
  if (appStore.selectedTaxa.length === 0) {
    await addDefaultTaxonToStoreAndMap(appStore);
  }
}

export async function addDefaultTaxonToStoreAndMap(appStore: AppStoreType) {
  await addDefaultTaxaRecordToStore(appStore);
  await addDefaultTaxaRecordToMap(appStore);
}

export function removeDefaultTaxonFromStoreAndMap(appStore: AppStoreType) {
  let layerControl = appStore.map.layerControl;

  if (layerControl) {
    // remove from map
    let mapLayers = appStore.taxaMapLayers;
    clearMapLayers(mapLayers, layerControl);
  }

  // remove from store

  clearSelectedTaxa(appStore);

  appStore.color = "";
}

export function clearMapLayers(
  mapLayers: { [index: string]: TileLayer[] },
  layerControl: L.Control.Layers,
) {
  Object.values(mapLayers).forEach((layers) => {
    layers.forEach((layer) => {
      // remove layer from layer control
      layerControl.removeLayer(layer);
      // remove layer from map
      layer.remove();
    });
  });
}

function clearSelectedTaxa(appStore: AppStoreType) {
  delete appStore.observationsApiParams.taxon_id;
  delete appStore.observationsApiParams.colors;
  appStore.selectedTaxa = [];
  appStore.taxaMapLayers = {};
}

// ================
// selected resource
// ================

export function updateSelectedResource(
  record: NormalizedPlace | NormalizedTaxon,
  resourceName: AppStoreSelectedResourcesKeysType,
  appStore: AppStoreType,
) {
  let records = [];
  let ids: number[] = [];

  // @ts-ignore
  appStore[resourceName].forEach((selectedResource) => {
    // update existing taxon
    if (selectedResource.id === record.id) {
      records.push(record);
      // keep existing taxon
    } else {
      records.push(selectedResource);
    }
    ids.push(selectedResource.id);
  });

  // add new record
  if (!ids.includes(record.id)) {
    records.push(record);
  }

  appStore[resourceName] = records as any;
}

export function renderResourceGeometryLayer(
  resource: NormalizedPlace,
  map: Map,
  layerDescription: string,
): L.GeoJSON {
  let options: any = {
    color: "red",
    fillColor: "none",
    layer_description: `${layerDescription}: ${resource.name}, ${resource.id}`,
  };
  let layer = L.geoJSON(resource.geometry as any, options);
  layer.addTo(map);
  return layer;
}

// ================
// misc
// ================

export function updateSelectedTaxaColor(
  appStore: AppStoreType,
  resource: AppStoreSelectedResourcesKeysType,
) {
  if (appStore[resource].length > 0) {
    appStore.observationsApiParams.colors = appStore.selectedTaxa
      .map((r) => r.color)
      .join(",");
  }
  if (appStore.selectedTaxa.length === 0) {
    delete appStore.observationsApiParams.colors;
  }
}

function removeResourceId(
  appStore: AppStoreType,
  resource: AppStoreSelectedResourcesKeysType,
  property: ObservationsApiParamsKeysType,
  targetId: any,
) {
  // do nothing if existing resource has corresponding  target id
  if (appStore[resource].map((p) => p.id).includes(targetId)) {
    // if no selected resource, delete property
  } else if (appStore[resource].length === 0) {
    delete appStore.observationsApiParams[
      property as ObservationsApiParamsKeysType
    ];
  } else {
    // remove target id from comma separated string
    let ids = removeValueFromCommaSeparatedString(
      targetId,
      // @ts-ignore
      appStore.observationsApiParams[property],
    );
    if (ids) {
      // @ts-ignore
      appStore.observationsApiParams[property] = ids;
    } else {
      // handle cases when there is a selected resource but the id is not in
      // observationsApiParams
      delete appStore.observationsApiParams[
        property as ObservationsApiParamsKeysType
      ];
    }
  }
}

export function removeIdfromInatApiParams(
  appStore: AppStoreType,
  resource: AppStoreSelectedResourcesKeysType,
  value: any,
) {
  // NOTE: update when adding selectedResource
  if (resource === "selectedTaxa") {
    removeResourceId(appStore, resource, "taxon_id", value);

    updateSelectedTaxaColor(appStore, resource);
  } else if (resource === "selectedPlaces") {
    removeResourceId(appStore, resource, "place_id", value);
  } else {
    throw new Error(
      `removeIdfromInatApiParams not implemented for ${resource}`,
    );
  }
}

export function addValueToCommaSeparatedString(
  newValue?: number | string,
  currentValue?: string | number,
) {
  if (newValue === undefined) return;

  if (currentValue === undefined) {
    currentValue = newValue.toString();
  } else {
    if (typeof currentValue === "number") {
      currentValue = currentValue.toString();
    }
    // only add newValue to currentValue if currentValue does not have newValue
    let parts = currentValue.split(",").map((i) => {
      if (typeof newValue === "number") {
        return Number(i);
      } else {
        return i;
      }
    });
    if (!parts.includes(newValue)) {
      currentValue = currentValue + "," + newValue;
    }
  }

  return currentValue;
}

export function removeValueFromCommaSeparatedString(
  newValue?: number,
  currentValue?: string,
) {
  if (newValue === undefined) return;
  if (currentValue === undefined) return;

  let ids = currentValue
    .toString()
    .split(",")
    .filter((id) => Number(id) !== newValue)
    .join(",");
  if (ids === "") return;
  return ids;
}

export function normalizePlaceResult(
  record: AutocompletePlacePlace | PlaceResult,
): NormalizedPlace {
  let typeName;
  if (record.place_type) {
    typeName = placeTypes[record.place_type.toString() as PlaceTypesKey];
  }
  return {
    name: record.display_name,
    geometry: record.geometry_geojson as any,
    bounding_box: record.bounding_box_geojson,
    id: record.id,
    place_type_name: typeName,
  };
}

export function normalizeTaxonResult(
  record: TaxonResult | AutocompleteTaxonResult,
  appStore: AppStoreType,
): NormalizedTaxon {
  let nameData = formatTaxonName(record, appStore);
  let color = getColor(appStore, primaryColorScheme);
  appStore.color = color;

  let data: NormalizedTaxon = {
    id: record.id,
    name: record.name,
    preferred_common_name: record.preferred_common_name,
    iconic_taxon_name: record.iconic_taxon_name,
    color: color,
    rank: nameData.rank,
    title: nameData.title,
    subtitle: nameData.subtitle,
  };
  if (record.default_photo) {
    data.photos = [record.default_photo];
  }

  return data;
}

export function leafletMapLayers(
  appStore: AppStoreType,
  field = "layer_description" as keyof CustomLayerOptionsType,
) {
  let items: any[] = [];
  if (appStore.map.map) {
    appStore.map.map.eachLayer((layer) => {
      let options = layer.options as CustomLayerOptionsType;
      if (options[field]) {
        items.push(options[field]);
      }
    });
  }

  return items;
}
