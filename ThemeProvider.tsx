import React, {createContext, useContext, useState} from 'react';
import {ITheme, THEMES, themes} from './themes';
// import {StatusBar} from 'react-native';

interface IThemeContext {
  theme: ITheme;
  setTheme: (theme: THEMES) => void;
}

const initThemeContext: IThemeContext = {
  theme: themes[0],
  setTheme: () => {},
};

const ThemeContext = createContext<IThemeContext>(initThemeContext);

export const ThemeProvider = ({children}: {children: JSX.Element}) => {
  // const isDarkMode = useColorScheme() === 'dark'; // To find device theme
  const [theme, setTheme] = useState<ITheme>(initThemeContext.theme);

  const updateTheme = (selectedTheme: THEMES) => {
    setTheme(
      () =>
        themes.find(cand => cand.name === selectedTheme) ||
        initThemeContext.theme,
    );
  };

  return (
    <ThemeContext.Provider value={{theme: theme, setTheme: updateTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const the = useContext(ThemeContext);

  return the;
};
