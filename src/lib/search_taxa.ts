import type {
  AppStoreType,
} from "../types/app.d.ts";

export function removeOneTaxonFromMap(appStore: AppStoreType, taxonId: number) {
  if (!appStore.taxaMapLayers) return;
  let mapLayers = appStore.taxaMapLayers[taxonId];
  if (!mapLayers) return;
  let layerControl = appStore.map.layerControl;
  if (!layerControl) return;

  mapLayers.forEach((layer) => {
    // remove layer from layer control
    layerControl.removeLayer(layer);
    // remove layer from map
    layer.remove();
  });

  delete appStore.taxaMapLayers[taxonId];
  // HACK: trigger change in proxy store
  appStore.taxaMapLayers = appStore.taxaMapLayers;
}
