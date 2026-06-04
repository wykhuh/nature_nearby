import type {
  AppStoreSelectedResourcesKeysType,
  AppStoreType,
  MapTilesAPIParamsType,
  NormalizedPlace,
  NormalizedTaxon,
  PlaceTypesKey,
} from "../types/app";
import type {
  ObservationTaxon,
  PlaceResult,
  PlaceSearchRecord,
  TaxonResult,
} from "../types/inat_api";
import { capitalizeFirstLetter } from "./utils";
import { cleanupObservationsMapParams } from "./cleanup_params_utils";
import { getColor, iNatOrange, primaryColorScheme } from "./map_colors_utils";
import { allTaxaRecord, placeTypes } from "../data/inat_data";
import { addOverlayToMap } from "./map_utils";
import type { TileLayer } from "leaflet";
import { getiNatMapTiles } from "./inat_api";

export function formatTaxonName(
  item: ObservationTaxon | NormalizedTaxon,
  appStore: AppStoreType,
) {
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

  let mapParams = {} as MapTilesAPIParamsType;
  let params = cleanupObservationsMapParams(appStore.observationsApiParams);
  mapParams = {
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

  // @ts-ignore
  appStore[resourceName] = records as any;
}

export function normalizePlaceResult(
  record: PlaceSearchRecord | PlaceResult,
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
  record: TaxonResult,
  appStore: AppStoreType,
): NormalizedTaxon {
  let nameData = formatTaxonName(record, appStore);
  let color = getColor(appStore, primaryColorScheme);
  appStore.color = color;

  return {
    id: record.id,
    name: record.name,
    preferred_common_name: record.preferred_common_name,
    iconic_taxon_name: record.iconic_taxon_name,
    photos: [record.default_photo],
    color: color,
    rank: nameData.rank,
    title: nameData.title,
    subtitle: nameData.subtitle,
  };
}
