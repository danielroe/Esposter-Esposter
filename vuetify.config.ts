import type { ThemeDefinition, VuetifyOptions } from "vuetify";
import { defineVuetifyConfiguration } from "vuetify-nuxt-module/custom-configuration";
import { ThemeMode } from "./models/vuetify/ThemeMode";
import { SURFACE_DARK } from "./services/vuetify/constants";

// @TODO: Internal vuetify types
export type ThemeColors = NonNullable<ThemeDefinition["colors"]>;
type Theme = VuetifyOptions["theme"];
type Defaults = VuetifyOptions["defaults"];

const BaseColorsCommon = {
  primary: "#42b883",
  border: "#ccc",
  info: "#2d88ff",
} satisfies ThemeColors;

const BaseColorsMap = {
  [ThemeMode.light]: {
    ...BaseColorsCommon,
    background: "#dae0e6",
    surface: "#fff",
    text: "#000",
  },
  [ThemeMode.dark]: {
    ...BaseColorsCommon,
    background: "#18191a",
    surface: SURFACE_DARK,
    text: "#fff",
  },
} satisfies Record<ThemeMode, ThemeColors>;

type BaseColors = (typeof BaseColorsMap)[ThemeMode];

const toSixDigitHexColor = (hexColor: string) =>
  hexColor.length === 3 ? hexColor.split("").reduce((acc, curr) => `${acc}${curr}${curr}`, "") : hexColor;

const getBaseColorsExtension = (colors: BaseColors) => {
  const sanitisedColors = Object.entries(colors).reduce<Record<string, string>>((acc, [color, hex]) => {
    acc[color] = `${hex[0]}${toSixDigitHexColor(hex.substring(1))}`;
    return acc;
  }, {}) as BaseColors;
  return {
    backgroundOpacity40: `${sanitisedColors.background}66`,
    backgroundOpacity80: `${sanitisedColors.background}cc`,
    surfaceOpacity80: `${sanitisedColors.surface}cc`,
    infoOpacity10: `${sanitisedColors.info}1a`,
  };
};

const theme: Theme = {
  variations: {
    colors: ["primary"],
    lighten: 1,
    darken: 1,
  },
  themes: {
    [ThemeMode.light]: {
      dark: false,
      colors: {
        ...BaseColorsMap[ThemeMode.light],
        ...getBaseColorsExtension(BaseColorsMap[ThemeMode.light]),
      },
    },
    [ThemeMode.dark]: {
      dark: true,
      colors: {
        ...BaseColorsMap[ThemeMode.dark],
        ...getBaseColorsExtension(BaseColorsMap[ThemeMode.dark]),
      },
    },
  },
};

const defaults: Defaults = {
  VAutocomplete: { variant: "outlined" },
  VBtn: { style: { backgroundColor: "transparent" }, flat: true },
  VCombobox: { variant: "outlined" },
  VDataTable: {
    style: {
      borderRadius: ".25rem",
    },
    VToolbar: {
      style: {
        borderRadius: ".25rem",
      },
    },
  },
  VDialog: { width: 500, maxWidth: "100%" },
  VSelect: { variant: "outlined" },
  VTextarea: { variant: "outlined" },
  VTextField: { variant: "outlined" },
  VTooltip: { location: "top" },
};

export default defineVuetifyConfiguration({
  directives: true,
  theme,
  defaults,
});
