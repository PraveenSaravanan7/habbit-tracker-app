export enum THEMES {
  LIGHT,
  DARK,
  DARK1,
}

export interface ITheme {
  name: THEMES;
  isDark: boolean;
  colors: {
    transparentBackdrop: string;
    background: string;
    text: string;
    disabledText: string;
    primary: {
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
    };
    surface: {
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
    };
  };
}

const dark: ITheme = {
  name: THEMES.DARK,
  isDark: true,
  colors: {
    transparentBackdrop: 'rgba(0,0,0,0.85)',
    background: '#000000',
    text: '#ffffff',
    disabledText: 'rgba(255,255,255,0.5)',
    primary: {
      100: '#673ab7',
      200: '#7a4fbf',
      300: '#8c64c8',
      400: '#9d79d0',
      500: '#ae8fd8',
      600: '#bfa5e0',
    },
    surface: {
      100: '#121212',
      200: '#282828',
      300: '#3f3f3f',
      400: '#575757',
      500: '#717171',
      600: '#8b8b8b',
    },
  },
};

export const themes: ITheme[] = [dark];

export const commonColors = {
  red: '#d2382e', // x
  salmon: '#e54456',
  cerise: '#d12d60',
  fuchsia: '#cc33a7',
  purple: '#bf32cc', // x
  blueViolet: '#8c4de6',
  indigo: '#7667e4', // x
  royalBlue: '#496ed9',
  azure: '#3486c2',
  teal: '#409ea6',
  seaGreen: '#35a17d',
  shamrockGreen: '#45a160',
  green: '#449932',
  oliveGreen: '#73ac37',
  yellowGreen: '#8fac38', // x
  mustard: '#ac961f',
  orange: '#ec9512',
  redOrange: '#ec8013',
  rust: '#cc6733',
  tomatoRed: '#cd4d34',
};
