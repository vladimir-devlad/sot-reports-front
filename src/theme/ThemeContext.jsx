import { CssBaseline, ThemeProvider } from "@mui/material";
import { appTheme } from "./theme";

export const AppThemeProvider = ({ children }) => (
  <ThemeProvider theme={appTheme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
);
