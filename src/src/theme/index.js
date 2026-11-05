import React, { createContext, useContext, useMemo } from 'react';
import { createTheme } from './createTheme';
import { activeSchool } from '../config/schools';

const ThemeContext = createContext(null);

export function ThemeProvider({ school = activeSchool, children }) {
  const theme = useMemo(() => createTheme(school), [school]);
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);

// const styles = useStyles(makeStyles);  where makeStyles = (t) => StyleSheet.create({...})
export function useStyles(factory) {
  const theme = useTheme();
  return useMemo(() => factory(theme), [theme, factory]);
}
