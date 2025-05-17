import React, { createContext, useState } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState("light");

  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: "#1976d2",
      },
      background: {
        default: themeMode === "light" ? "#fff" : "#121212",
        paper: themeMode === "light" ? "#fff" : "#1e1e1e",
      },
    },
  });

  const toggleTheme = () => {
    setThemeMode(themeMode === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};