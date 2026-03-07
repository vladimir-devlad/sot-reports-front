import { alpha, createTheme } from "@mui/material/styles";
import { palette } from "./palette";

const typography = {
  fontFamily: [
    "Roboto",
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "sans-serif",
  ].join(","),
  h1: { fontSize: "2rem", fontWeight: 700, lineHeight: 1.2 },
  h2: { fontSize: "1.75rem", fontWeight: 700, lineHeight: 1.3 },
  h3: { fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.3 },
  h4: { fontSize: "1.25rem", fontWeight: 600, lineHeight: 1.4 },
  h5: { fontSize: "1.1rem", fontWeight: 600, lineHeight: 1.4 },
  h6: { fontSize: "1rem", fontWeight: 600, lineHeight: 1.5 },
  subtitle1: { fontSize: "0.95rem", fontWeight: 500 },
  subtitle2: { fontSize: "0.85rem", fontWeight: 500 },
  body1: { fontSize: "0.95rem", lineHeight: 1.6 },
  body2: { fontSize: "0.85rem", lineHeight: 1.6 },
  caption: { fontSize: "0.75rem" },
  button: { fontSize: "0.875rem", fontWeight: 600, textTransform: "none" },
};

const shape = { borderRadius: 10 };

export const appTheme = createTheme({
  palette,
  typography,
  shape,
  shadows: [
    "none",
    "0px 1px 3px rgba(0,0,0,0.08)",
    "0px 2px 6px rgba(0,0,0,0.10)",
    "0px 4px 12px rgba(0,0,0,0.10)",
    "0px 6px 16px rgba(0,0,0,0.12)",
    "0px 8px 24px rgba(0,0,0,0.12)",
    ...Array(19).fill("none"),
  ],
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadius,
          paddingTop: 8,
          paddingBottom: 8,
          paddingLeft: 20,
          paddingRight: 20,
        },
        containedPrimary: {
          "&:hover": { backgroundColor: palette.primary.dark },
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 2 },
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadius * 1.2,
          border: `1px solid ${palette.divider}`,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadius,
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: palette.primary.main,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontSize: "0.9rem" },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6, fontWeight: 500 },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${palette.divider}`,
          backgroundColor: palette.background.paper,
          color: palette.text.primary,
          boxShadow: "0 1px 6px rgba(0,0,0,0.08)", // ← agrega esto
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: palette.background.paper,
          borderRight: `1px solid ${palette.divider}`,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": {
            backgroundColor: palette.background.subtle,
            fontWeight: 600,
            fontSize: "0.8rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: palette.text.secondary,
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: alpha(palette.primary.main, 0.04),
          },
        },
      },
    },
    MuiTooltip: {
      defaultProps: { arrow: true },
      styleOverrides: {
        tooltip: { borderRadius: 6, fontSize: "0.78rem" },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: shape.borderRadius * 1.2 },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { fontWeight: 600, textTransform: "none", fontSize: "0.9rem" },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: shape.borderRadius },
      },
    },
  },
});
