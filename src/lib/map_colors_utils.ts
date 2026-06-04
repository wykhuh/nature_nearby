import type { AppColorSchemes, AppColorSchemesNames, AppStoreType } from "../types/app";

export let iNatOrange = "#f16f3a";

export const glasbey_30 = [
  "#d60000",
  "#8c3bff",
  "#018700",
  "#00acc6",
  "#97ff00",
  "#ff7ed1",
  "#6b004f",
  "#ffa52f",
  "#573b00",
  "#005659",
  "#0000dd",
  "#00fdcf",
  "#a17569",
  "#bcb6ff",
  "#95b577",
  "#bf03b8",
  "#645474",
  "#790000",
  "#0774d8",
  "#fdf490",
  "#004b00",
  "#8e7900",
  "#ff7266",
  "#edb8b8",
  "#5d7e66",
  "#9ae4ff",
  "#eb0077",
  "#a57bb8",
  "#5900a3",
  "#03c600",
];

export const appColorSchemes: AppColorSchemes = {
  "Glasbey (30)": glasbey_30,
};

export const primaryColorSchemeName: AppColorSchemesNames = "Glasbey (30)";
export const primaryColorScheme = appColorSchemes[primaryColorSchemeName];

export function getColor(appStore: AppStoreType, colorArray: string[]) {
  let color = appStore.color;
  if (colorArray === undefined) {
    colorArray = primaryColorScheme;
  }
  if (color === undefined || color === "") {
    color = colorArray[0];
  } else {
    let index = colorArray.indexOf(color);
    color = getColorByIndex(index, colorArray);
  }

  return color;
}

export function getColorByIndex(index: number, colorArray: string[]) {
  return colorArray[(index + 1) % colorArray.length];
}
