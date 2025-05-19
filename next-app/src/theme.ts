'use client';
import { createTheme } from '@mui/material/styles';

// TableCheck colors using the recommended https://m2.material.io/inline-tools/color/ and the https://zenoo.github.io/mui-theme-creator/
const theme = createTheme({
  typography: {
    fontFamily: 'var(--font-roboto)',
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#7935D2',
    },
    secondary: {
      main: '#3c3c3c',
    },
  },
});

// TODO: I could add a dark mode theme with a top-level toggle, and follow user browser preference
const darkTheme = createTheme({
  typography: {
    fontFamily: 'var(--font-roboto)',
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#7935D2',
      dark: '#2a114a',
    },
    secondary: {
      main: '#3c3c3c',
    },
    background: {
      default: '#0d0516',
      paper: '#301356',
    },
  },
});

export { theme, darkTheme };
